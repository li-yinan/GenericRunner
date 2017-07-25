import Flow from './flow';
import SubFlow from './subflow';
import Node from './node';
import {sep} from 'path';
import {merge} from 'lodash';

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
 * 把一个序列化的数据反序列化为flow或者subflow
 *
 */
export function deserialize(configStr) {
    return JSON.parse(configStr, function (key, value) {
        let Clazz = null;
        if (value.type) {
            try {
                // 找到对应的class
                Clazz = getNodeClassByType(value.type);
                // 生成实例
                let instance = new Clazz();
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
}

class Fifo {
    cache = [];
    index = {};

    push(pair) {
        let {node, param, port} = pair;
        if (this.index[node.id]) {
            this.index[node.id].addParam(param, port);
        }
        else {
            this.cache.push(pair);
            this.index[node.id] = pair;
        }
    }

    shift() {
        let pair = this.cache.shift();
        if (!pair) {
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

    // 把所有属于当前flow的node的context设置为属于当前flow
    // 用defineProperty是为了serialize的时候这个context属性不会被serialize
    flow.nodes.map(node => node.context.flow = flow.id);
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
    let nodes = new Fifo();

    function getNextNodes(node, returnValue) {
        // 从当前节点找到对应的端口所有的link
        let links = flow.links.filter(link => link.fromId === node.id && link.fromPort === returnValue.port);
        // 找到每个link对应的node
        return links.map(link =>  flow.nodes.find(node => node.id === link.toId));
    }

    async function walk(node, param) {
        nodes.push(new Pair(node, param));
        return new Promise(async (resolve, reject) => {
            try {
                let pair = null;
                let returnValue = null;
                while (pair = nodes.shift()) {
                    let {node, params} = pair;
                    returnValue = await node.exec.apply(node, params);
                    if (node.out > 0) {
                        // 还有下一步，则把下一步添加到堆栈中
                        let nextNodes = getNextNodes(node, returnValue);
                        let {data, port} = returnValue;
                        nodes.concat(nextNodes.map(node => new Pair(node, data, port)));
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
