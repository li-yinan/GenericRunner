import Flow from '../flow';
import SubFlow from '../subflow';
import Node from './node';
import ContinuousOutput from './continuousoutput';
import ReturnValue from './returnvalue';
import {sep, join} from 'path';
import {readdir, stat} from 'fs';
import pify from 'pify';
import {filter, merge, uniq, find, findIndex, difference} from 'lodash';
import Context from './context';

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
 * 判断scope是否match，scope是以s开头的字符串，比如s_1, s_2, s_3_1 等
 * 每次一个sub scope就在前一个scope后面加一个新的数字
 * 而另一个无关的scope就把当前数字增加，比如s_1 => s_2
 * match的条件就是短的跟长的前几位完全一致，比如s_1和s_1_2match，但是s_1和s_2就不match
 *
 * @param {Context} context1
 * @param {Context} context2
 *
 * @return {Boolean}
*/
export function scopeMatch(context1, context2) {
    let scope1 = context1.scope;
    let scope2 = context2.scope;
    if (scope1 === scope2) {
        return true;
    }
    let longOne = scope1.length > scope2.length ? scope1 : scope2;
    let shortOne = scope1.length < scope2.length ? scope1 : scope2;

    if (scope1.length === scope2.length) {
        longOne = scope1;
        shortOne = scope2;
    }

    if (longOne.indexOf(shortOne) === 0) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 用于生成一个node，和运行node需要的参数的pair，作为中间态存储即将运行的node
 */
export class Pair {
    node = null;
    params = [];
    paramsFill = [];
    count = 0;
    ready = false;
    port = 0;
    context = null;
    constructor(node, param, port = 0, context) {
        if (node.in === 0) {
            this.ready = true;
        }
        this.node = node;
        this.port = port;
        this.addParam(param, port);
        this.setContext(context);
    }

    setContext(context) {
        if (this.context) {
            this.context = this.context.merge(context);
        }
        else {
            this.context = context;
        }
    }

    addParam(param, port = 0) {
        this.params[port] = param;
        this.paramsFill[port] = true;
        this.count++;
        let paramsCount = this.paramsFill.filter(param => param);
        if (this.node.in === paramsCount.length) {
            this.ready = true;
        }
    }

    setData(data) {
        this.data = data;
    }
}

class Fifo {
    cache = [];

    constructor(options = {}) {
        this.onpush = options.onpush || function () {};
    }

    push(pair) {
        let {node, params, port, context} = pair;
        let indexedNode = this.cache.find(cachedPair => cachedPair.node.id === node.id && scopeMatch(context, cachedPair.context));
        if (indexedNode) {
            console.log('addParam: ', params, ' from_scope: ', context.scope, '_to_scope: ', indexedNode.context.scope);
            indexedNode.addParam(params[port], port);
            indexedNode.setContext(context);
        }
        else {
            this.cache.push(pair);
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
export async function asyncFlowRunner(flow, pairs, context) {

    let nodes = new Fifo();
    context = context || new Context();

    // 把所有属于当前flow的node的context设置为属于当前flow
    flow.nodes.map(node => node.context.flow = flow);

    // 找到所有初始节点，初始节点就是in的数量是0的节点
    let startNodes = flow.nodes.filter(node => node.in === 0);
    let startPairs = startNodes.map(node => new Pair(node, null, 0, context.clone()));
    if (pairs) {
        // 如果给出初始运行节点，找到当前flow里的自运行节点，合并在一起作为初始运行节点
        pairs = pairs.concat(startPairs);
    }
    else {
        pairs = startPairs;
    }

    function getNextNodes(node, returnValue, context) {
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
        .map(obj => {
            let newContext = context.clone();
            newContext.from = {
                id: node.id,
                scope: context.scope,
                returnValue: returnValue,
                name: node.name
            };
            return new Pair(obj.node, data, obj.port, newContext);
        });
    }

    let cnt = 0;
    async function walk(node, param, context) {
        nodes.push(new Pair(node, param, 0, context.clone()));
        return new Promise(async (resolve, reject) => {
            try {
                let returnValue = null;
                async function execNode(node, params, context) {
                    // 执行node
                    let ret = await node.exec.apply(node, params.concat(context));
                    if (ret instanceof ContinuousOutput) {
                        // 当前node的返回值是一个持续输出类型
                        // 注册事件，接收持续产生的输出
                        ret.onoutput(function (vnode) {
                            // 回调的参数是一个VirtualNode
                            // 用于仿造一个node，放到堆栈里，
                            walk(vnode, null, context);
                        });

                    } else if (ret instanceof ReturnValue) {
                        try {
                            console.log('>>>node return<<< scope:',context.scope,' id: ', node.id, JSON.stringify(ret));
                        }
                        catch (e) {
                            console.log('>>>node return<<<结果无法stringify');
                        }
                        returnValue = ret;
                        if (node.out > 0) {
                            // 还有下一步，则把下一步添加到堆栈中
                            let pairs = getNextNodes(node, ret, context);
                            nodes.concat(pairs);
                        }
                    }
                    // 没有下一步了，不用特殊处理，堆栈没了就都执行结束了
                    return ret;
                }

                let pairs = null;
                while (pairs = nodes.shift()) {
                    await Promise.all(pairs.map(({node, params, context}) => execNode(node, params, context)));
                }
                resolve(returnValue);
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }

    let promises = pairs.map(({node,params}) => walk(node, params, context.clone()));

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
