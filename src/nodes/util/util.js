import Flow from '../flow';
import SubFlow from '../subflow';
import Node from './node';
import ContinuousOutput from './continuousoutput';
import {sep, join} from 'path';
import {readdir, stat} from 'fs';
import pify from 'pify';
import {filter, merge, uniq, find, findIndex, difference} from 'lodash';

let readDirP = pify(readdir);
let statP = pify(stat);

let customNodeSearchPaths = ['../'];

/**
 * 添加一个用户自定义的搜索路径，可以在node实例化的时候使用用户的实现
 *
 * @param {string} path 自定义搜索路径
 *
 */
export function addCustomNodeSeachPath(path) {
    if (path[path.length - 1] !== sep) {
        path += sep;
    }
    if (customNodeSearchPaths.indexOf(path) === -1) {
        customNodeSearchPaths.push(path);
    }
}

/**
 * 用于修正每个node实例在新建完成后的in和out，需要子类实现
 *
 * @param {Object} instance 实例配置
 *
 * @return {Object}
 */
export let postfix = createInstance;

export function getNodeClassByType(type) {
    let node = null;
    // 加入node_modules搜索路径
    // 这里运行时加入是希望用户添加的路径可以优先于node_modules搜索
    let customPaths = customNodeSearchPaths.concat('generic-runner-plugin-');
    for (var i = 0; i < customPaths.length; i++) {
        let customPath = customPaths[i];
        try {
            // 这里不能用path.join，path.join('./', 'xxx') => 'xxx' 会丢失前面的./
            node = require(customPath + type);
        }
        catch (e) {
        }
        if (node) {
            break;
        }
    };
    if (!node) {
        throw `node: '${type}' not found`;
    }

    if (node.default) {
        node = node.default;
    }
    return node;
}

/**
 * 获取所有的node
 *
 * @return {Array.<Node>}
 */
export async function getNodes() {
    let ret = {};
    let customPaths = customNodeSearchPaths.concat('../../../node_modules/');
    await Promise.all(customPaths.map(async customPath => {
        let childFiles = [];
        try {
            childFiles = await readDirP(join(__dirname, customPath));
        }
        catch (e) {
            console.log(e);
        }
        await Promise.all(childFiles.map(async fileName => {
            if (/^[\.]/.test(fileName)) {
                // 隐藏文件不管
                return;
            }

            try {
                let clazz;
                if (/node_modules/.test(customPath)) {
                    clazz = require(fileName);
                }
                else {
                    // 如果是文件夹就直接跳过
                    let fileStat = await statP(join(__dirname, customPath, fileName));
                    if (fileStat.isDirectory()) {
                        return;
                    }
                    clazz = require(customPath + fileName);
                }
                if (!clazz) {
                    throw `class: '${filename}' not found`;
                }
                if (clazz.default) {
                    clazz = clazz.default;
                }
                if (new RegExp('^' + clazz.type).test(fileName)) {
                    ret[clazz.type] = clazz;
                }
            }
            catch (e) {
                // 这里可能是由于node_modules下的模块不能直接require名字，而是需要require内部文件，就会报错
                // console.log(e);
            }
            return ;
        }));
    }));
    delete ret.link;
    delete ret.flow;
    return ret;
}

/**
 * 把一个flow或者subflow序列化
 *
 */
export function serialize(instance) {
    return JSON.stringify(instance, null, 4);
}

/**
 * 检查依赖关系是否ok
 * 把父级的services的声明写入到子节点的parentServices里
 * 使子节点可以方便的获取到已经有哪些service可用
 *
 * @param {Flow} flow flow
 *
 */
export function checkDep(flow) {
    let {nodes, links} = flow;
    // 输入为0的是起始node
    let startNodes = nodes.filter(node => node.in === 0);
    if (flow.type === 'subflow') {
        // subflow要动态的计算依赖
        flow.buildDep();
        // subflow需要找到输入口，添加到startnodes里
        let subflowEntries = flow.options.inMap.map(map => {
            return find(nodes, node => node.id === map.toId);
        });
        startNodes = startNodes.concat(subflowEntries);
    }
    function getNextNodes(node) {
        // 找到当前节点的所有输出link
        return links.filter(link => link.fromId === node.id)
            // 利用link找到下一个node
            .map(link => nodes.find(node => node.id === link.toId));
    }
    function walk(node) {
        // 检测当前node的依赖是否满足
        // different的用法是在第一个参数的数组里找第二个数组里没有的项
        // 这里subflow里的node会需要subflow自身的services，先组合一下再检测
        let unSupportServices = difference(node.dep, [...node.parentServices, ...flow.parentServices]);
        if (unSupportServices.length) {
            throw `node: '${node.name}' require service: '${unSupportServices}', but not found`;
        }
        if (node.out > 0) {
            let nextNodes = getNextNodes(node);
            nextNodes.map(nextNode => {
                // 把当前节点的parentServices传递下去
                // 同时也把当前节点提供的service传递下去
                nextNode.parentServices = uniq([...node.parentServices, ...node.constructor.services, ...flow.parentServices]);
            });
            nextNodes.map(node => walk(node));
        }
        if (node.type === 'subflow') {
            checkDep(node);
        }
    }
    startNodes.map(node => walk(node));
}

function createInstance(config) {
    try {
        // 找到对应的class
        let Clazz = getNodeClassByType(config.type);
        // 生成实例
        let instance = new Clazz(config);
        // 把序列化的值都赋给实例
        for (var item in config) {
            if (config.hasOwnProperty(item) && (item in instance)) {
                if (item === 'options') {
                    instance[item] = merge(instance[item], config[item]);
                }
                else {
                    // 其他的直接覆盖
                    instance[item] = config[item];
                }
            }
        }
        return instance;
    }
    catch (e) {
        console.log('>>>error: ', e);
    }
}

/**
 * 把一个序列化的数据反序列化为flow或者subflow
 *
 */
export function deserialize(configStr) {
    let flow = JSON.parse(configStr, function (key, value) {
        if (value.type && value.id !== undefined) {
            return createInstance(value);
        }
        return value;
    });
    try {
        checkDep(flow);
    }
    catch (e) {
        console.log(e);
        throw e;
    }
    return flow;
}

export function equal(node1, node2) {
    return node1.nodeId === node2.nodeId;
}

/**
 * 用于生成一个node，和运行node需要的参数的pair，作为中间态存储即将运行的node
 */
export class Pair {
    node = null;
    params = [];
    count = 0;
    ready = false;
    port = 0;
    constructor(node, param, port = 0) {
        if (node.in === 0) {
            this.ready = true;
        }
        this.node = node;
        this.port = port;
        this.addParam(param, port);
    }

    addParam(param, port = 0) {
        this.params[port] = param;
        this.count++;
        if (this.node.in === this.count) {
            this.ready = true;
        }
    }

    setData(data) {
        this.data = data;
    }

    setSession(session) {
        this.node.setSession(session);
    }
}

class Fifo {
    cache = [];
    index = {};

    constructor(options = {}) {
        this.onpush = options.onpush || function () {};
    }

    push(pair) {
        let {node, params, port} = pair;
        if (this.index[node.id]) {
            this.index[node.id].addParam(params[port], port);
        }
        else {
            this.cache.push(pair);
            this.index[node.id] = pair;
        }
        this.onpush();
    }

    shift() {
        this.cache.sort((a, b) => {return b.ready - a.ready});
        let pairs = this.cache.filter(item => item.ready);
        this.cache = this.cache.filter(item => !item.ready);
        if (!pairs.length) {
            return;
        }
        pairs.map(pair => {
            this.index[pair.node.id] = null;
        })
        return pairs;
    }

    concat(arr) {
        arr.map(pair => this.push(pair));
        return this;
    }
}

/**
 * 对一个异步结构进行遍历
 * 这里是一个对无论fe还是rd来讲都比较复杂的算法
 * 一个异步的遍历，还要有结束回调
 * rd懂遍历，但是不懂异步，fe懂异步，但是不懂遍历
 * 还好老子练过，小菜一碟
 *
 * @param {Flow} flow flow
 * @param {Array.<Pair>} pairs 一个数组，包含了node和param组成的pair，用于描述一个subflow的输入port和输入参数
 *
 * @return {Promise}
 */
export async function asyncFlowRunner(flow, pairs) {

    let nodes = new Fifo();

    // 把所有属于当前flow的node的context设置为属于当前flow
    flow.nodes.map(node => node.context.flow = flow);
    // 找到所有初始节点，初始节点就是in的数量是0的节点
    let startNodes = flow.nodes.filter(node => node.in === 0);
    if (pairs) {
        // 如果给出初始运行节点，找到当前flow里的自运行节点，合并在一起作为初始运行节点
        pairs = pairs.concat(startNodes.map(node => new Pair(node)));
    }
    else {
        // 没有给出初始运行节点
        pairs = startNodes.map(node => new Pair(node));
    }

    function getNextNodes(node, returnValue) {
        let {data, port} = returnValue;
        // 从当前节点找到对应的端口所有的link
        let links = flow.links.filter(link => link.fromId === node.id && link.fromPort === port);
        // 找到每个link对应的node
        return  links.map(link => {
            return {
                // 根据link指向的id找到node
                node: flow.nodes.find(node => node.id === link.toId),
                // 记录link指向的port
                port: link.toPort
            }
        })
        .map(obj => new Pair(obj.node, data, obj.port));
    }

    let cnt = 0;
    async function walk(node, param) {
        nodes.push(new Pair(node, param));
        return new Promise(async (resolve, reject) => {
            try {
                async function execNode(node, params) {
                    // 传递service
                    // 只传递声明过的service
                    node.context.service = {};
                    node.dep.map(key => {
                        node.context.service[key] =  flow.context.service[key];
                    });
                    // 执行node
                    let ret = await node.exec.apply(node, params);
                    if (ret instanceof ContinuousOutput) {
                        // 当前node的返回值是一个持续输出类型
                        // 注册事件，接收持续产生的输出
                        ret.onoutput(function (vnode) {
                            // 回调的参数是一个VirtualNode
                            // 用于仿造一个node，放到堆栈里，
                            vnode.setSession(node.getSession() + '_' + cnt++);
                            walk(vnode);
                        });

                    } else {
                        returnValue = ret;
                        if (node.out > 0) {
                            // 还有下一步，则把下一步添加到堆栈中
                            let pairs = getNextNodes(node, returnValue);
                            // 为每一个node设置session
                            pairs.map(pair => {
                                pair.setSession(node.getSession());
                            });
                            nodes.concat(pairs);
                        }
                    }
                    // 没有下一步了，不用特殊处理，堆栈没了就都执行结束了
                    return returnValue;
                }

                let pairs = null;
                let returnValue = null;
                while (pairs = nodes.shift()) {
                    await Promise.all(pairs.map(({node, params}) => execNode(node, params)));
                }
                resolve(returnValue);
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }

    let promises = pairs.map(({node,params}) => walk(node, params));

    // Promise.all(promises).then(function () {
    //     flow.dispose();
    // });

    // 并行对所有startNodes开始运行
    // 哪个快哪个就是最后的结果, 因为一个subflow的多个输出只有一个会被执行
    return Promise.race(promises);
}

export function buildFlowFromConfig(conf) {
    try {
        return deserialize(JSON.stringify(conf));
    } 
    catch (e) {
        console.log(e);
    }
}
