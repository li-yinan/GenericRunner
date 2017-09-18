import Executable from './util/executable';
import {equal, asyncFlowRunner} from './util/util';

/**
 * 为什么Flow extends node呢？
 * 因为SubFlow需要继承Flow，而SubFlow需要可以被node调用，可以输出到node，从泛化上讲就是一个node
 * 从合理性上讲，应该是node和flow都实现一个executable的interface，但是这是nodejs，不是java，只好这样实现了
 *
 * 续：我终于忍不了，写了一个executable class 来为可执行的数据结构提供接口
 * 此事完结
 */
export default class Flow extends Executable {

    static type = 'flow';

    // 这里不对subflow进行展开，只包含当前flow的内容
    nodes = [];

    links = [];

    context = {
        service: {}
    };

    checkDep() {
    }

    async exec(param, context) {
        await super.exec(param, context);
        return asyncFlowRunner(this);
    }

    async dispose() {
        await super.dispose();
        return Promise.all(this.nodes.map(async node => node.dispose()));
    }

    /**
     * 添加一个新node
     *
     * @param {Node} newNode node
     */
    addNode(newNode) {
        let exist = nodes.find(node => equal(node, newNode));
        if (!exist) {
            nodes.push(newNode);
        }
    }

    /**
     * 移除一个node
     *
     * @param {Node} rmNode node
     */
    removeNode(rmNode) {
        let index = nodes.findIndex(node => equal(node, rmNode));
        let node = nodes[index];
        if (index !== -1) {
            nodes.splice(index, 1);
        }
    }

    removeLink(fromId, toId) {
        if (!fromId && !toId) {
            return;
        }
        let links = this.links;
        if (fromId) {
            // 使用原始数组筛选
            links = links.filter(link => link.fromId === fromId);
        }
        if (toId) {
            // 使用 筛选过的数组筛选
            links = links.filter(link => link.toId === toId);
        }
        if (links.length) {
            this.links = this.links.filter(link => link !== links[0]);
        }
    }

    addLink(newLink) {
        let link = this.links.find(link => link.fromId === newLink.fromId && link.toId === newLink.toId);
        if (link) {
            return;
        }
        this.links.push(link);
    }
}

