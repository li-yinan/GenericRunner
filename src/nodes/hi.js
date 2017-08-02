/**
 * @file hi node 用于接收hi消息
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-08-02
 */

import Node from './node';
import ReturnValue from './returnvalue';
import ContinuousOutput from './continuousoutput';
import Router from 'koa-router';

let router = Router();

export default class Hi extends Node {
    name = 'hi';

    type = 'hi';

    static dep = ['koa'];

    async exec(param) {
        super.exec(param);

        let node = this;

        let output = new ContinuousOutput();

        let path = this.options.path;

        let koa = this.getService('koa');

        router.all(path, (ctx, next) => {
            output.add(new ReturnValue(0, 'hello', node));
            ctx.body = 'Hello Koa';
        });

        koa.use(router.routes(), router.allowedMethods());
        
        // return new ReturnValue(0, null, this);
        return output;
    }
}
