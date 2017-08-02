/**
 * @file hi node 用于接收hi消息
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-08-02
 */

import Node from './node';
import ReturnValue from './returnvalue';
import Router from 'koa-router';

let router = Router();

export default class OpenPage extends Node {
    name = 'hi';

    type = 'hi';

    static dep = ['koa'];

    async exec(param) {
        super.exec(param);

        let path = this.options.path;

        let koa = this.getService('koa');

        router.all(path, (ctx, next) => {
            ctx.body = 'Hello Koa';
        });

        koa.use(router.routes(), router.allowedMethods());
        
        return new ReturnValue(0, null, this);
    }
}
