import Flow from './flow';
import SubFlow from './subflow';
import Node from './node';
import ContinuousOutput from './continuousoutput';
import {sep} from 'path';
import {merge, uniq, findIndex, difference} from 'lodash';

let customNodeSearchPaths = ['./'];

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
    if (customNodeSearchPaths.indexOf(path) !== -1) {
        customNodeSearchPaths.push(path);
    }
}

export function getNodeClassByType(type) {
    let node = null;
    // 加入node_modules搜索路径
    // 这里运行时加入是希望用户添加的路径可以优先于node_modules搜索
    let customPaths = customNodeSearchPaths.concat('conan-plugin-');
    for (var i = 0; i < customPaths.length; i++) {
        let customPath = customPaths[i];
        try {
            // util和node的实现都在同一级，直接当前目录查找
            // 这里不能用path.join，path.join('./', 'xxx') => 'xxx' 会丢失前面的./
            node = require(customPath + type);
        }
        catch (e) {
        }
        if (node) {
            break;
        }
    };

    if (node.default) {
        node = node.default;
    }
    return node;
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
    function getNextNodes(node) {
        // 找到当前节点的所有输出link
        return links.filter(link => link.fromId === node.id)
            // 利用link找到下一个node
            .map(link => nodes.find(node => node.id === link.toId));
    }
    function walk(node) {
        // 检测当前node的依赖是否满足
        // different的用法是在第一个参数的数组里找第二个数组里没有的项
        let unSupportServices = difference(node.constructor.dep, node.parentServices);
        if (unSupportServices.length) {
            throw `node: '${node.name}' require service: '${unSupportServices}', but not found`;
        }
        if (node.out > 0) {
            let nextNodes = getNextNodes(node);
            nextNodes.map(nextNode => {
                // 把当前节点的parentServices传递下去
                // 同时也把当前节点提供的service传递下去
                nextNode.parentServices = uniq([...node.parentServices, ...node.constructor.services]);
            });
            nextNodes.map(node => walk(node));
        }
    }
    startNodes.map(node => walk(node));
}

/**
 * 把一个序列化的数据反序列化为flow或者subflow
 *
 */
export function deserialize(configStr) {
    let flow = JSON.parse(configStr, function (key, value) {
        let Clazz = null;
        if (value.type) {
            try {
                // 找到对应的class
                Clazz = getNodeClassByType(value.type);
                // 生成实例
                let instance = new Clazz(value.options);
                // 把序列化的值都赋给实例
                for (var item in value) {
                    if (value.hasOwnProperty(item) && (item in instance)) {
                        if (item === 'options') {
                            instance[item] = merge(instance[item], value[item]);
                        }
                        else {
                            // 其他的直接覆盖
                            instance[item] = value[item];
                        }
                    }
                }
                return instance;
            }
            catch (e) {
                console.log('>>>error: ', e);
            }
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
}

class Fifo {
    cache = [];
    index = {};

    push(pair) {
        let {node, params, port} = pair;
        if (this.index[node.id]) {
            this.index[node.id].addParam(params[port], port);
        }
        else {
            this.cache.push(pair);
            this.index[node.id] = pair;
        }
    }

    shift() {
        this.cache.sort((a, b) => {return b.ready - a.ready});
        let pair = this.cache.shift();
        if (!pair) {
            return;
        }
        if (!pair.ready) {
            // 把这个节点放到最后
            this.cache.push(pair);
            // 这个情况在一个流程中某个node有多个输入时会出现
            // 当一个流程运行到这样一个节点，但是这个节点的前置依赖并没有被放入队列里就会这样
            return;
        }
        this.index[pair.node.id] = null;
        return pair;
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

    async function walk(node, param) {
        nodes.push(new Pair(node, param));
        return new Promise(async (resolve, reject) => {
            try {
                let pair = null;
                let returnValue = null;
                while (pair = nodes.shift()) {
                    let {node, params} = pair;
                    // 传递service
                    // 只传递声明过的service
                    let dep = node.constructor.dep;
                    node.context.service = {};
                    dep.map(key => {
                        node.context.service[key] =  flow.context.service[key];
                    })
                    // 执行node
                    let ret = await node.exec.apply(node, params);
                    if (ret instanceof ContinuousOutput) {
                        // 当前node的返回值是一个持续输出类型
                        // 注册事件，接收持续产生的输出
                        ret.onoutput(function (node) {
                            // 回调的参数是一个VirtualNode
                            // 用于仿造一个node，放到堆栈里，
                            walk(node);
                        });

                    } else {
                        returnValue = ret;
                        if (node.out > 0) {
                            // 还有下一步，则把下一步添加到堆栈中
                            let pairs = getNextNodes(node, returnValue);
                            nodes.concat(pairs);
                        }
                    }
                    // 没有下一步了，不用特殊处理，堆栈没了就都执行结束了
                }
                resolve(returnValue);
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }

    let promises = pairs.map(({node,param}) => walk(node, param));

    Promise.all(promises).then(function () {
        flow.dispose();
    });

    // 并行对所有startNodes开始运行
    // 哪个快哪个就是最后的结果, 因为一个subflow的多个输出只有一个会被执行
    return Promise.race(promises);
}

export function buildFlowFromConfig(conf) {
    return deserialize(JSON.stringify(conf));
}
