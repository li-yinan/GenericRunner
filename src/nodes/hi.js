/**
 * @file hi node 用于接收hi消息
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-08-02
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import ContinuousOutput from './util/continuousoutput';
import Router from 'koa-router';

let router = Router();

export default class Hi extends Node {

    static type = 'hi';

    dep = ['koa'];

    async exec(param) {
        super.exec(param);

        let node = this;

        let continuousOutput = new ContinuousOutput();

        let path = this.options.path;

        let koa = this.getService('koa');

        router.all(path, (ctx, next) => {
            continuousOutput.output(new ReturnValue(0, 'hello', node));
            ctx.body = 'Hello Koa';
        });

        koa.use(router.routes(), router.allowedMethods());

        // return new ReturnValue(0, null, this);
        return continuousOutput;
    }
}
