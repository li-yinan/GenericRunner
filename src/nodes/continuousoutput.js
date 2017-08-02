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

class VirtualNode extends Node {

    name = 'virtualnode';

    type = 'virtualnode';

    returnValue;

    constructor(returnValue) {
        super();
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

    add(returnValue) {
        this.cache.push(returnValue);
        this.doOutput();
    }

    onoutput(callback) {
        this.callbacks.push(callback);
    }

    doOutput() {
        let ret;
        while(ret = this.cache.shift()) {
            this.callbacks.map(callback => callback(new VirtualNode(ret)));
        }
    }

}
