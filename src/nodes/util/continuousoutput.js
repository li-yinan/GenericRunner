/**
 * @file 有些node并非只有一次输出，而是需要不断地产生结果
 * 例如定时器、koa的router
 * 这个类作为一个包装，可以返回一个不断产生结果的击发器
 * 在产生新的结果时可以像普通node一样继续执行后续步骤
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-08-02
 */

import Node from './node';
import {merge} from 'lodash';

class VirtualNode extends Node {

    name = 'virtualnode';

    type = 'virtualnode';

    returnValue;

    constructor(returnValue) {
        super();
        let originNode = returnValue.node;
        // 把virtual node 伪装成原始node
        let exec = this.exec;
        merge(this, originNode);
        // 还原exec方法
        this.exec = exec;
        // 改改名字吧，不然都分不清是真的node还是virtual node
        this.name = 'virtual node ' + this.name;
        this.returnValue = returnValue;
    }

    async exec(...args) {
        super.exec(...args);
        return this.returnValue;
    }
}

export default class ContinuousOutput {
    cache = [];
    callbacks = [];

    output(returnValue) {
        this.cache.push(returnValue);
        this.doOutput();
    }

    onoutput(callback) {
        this.callbacks.push(callback);
    }

    doOutput() {
        if (!this.callbacks.length) {
            return;
        }
        let ret;
        while(ret = this.cache.shift()) {
            // 回调传入一个伪装成原始node 的virtual node
            // 这样可以顺着这个virtual node继续执行原始node的后续node
            this.callbacks.map(callback => callback(new VirtualNode(ret)));
        }
    }

}
