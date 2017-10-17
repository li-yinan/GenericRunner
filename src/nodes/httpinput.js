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

export default class HttpInput extends Node {

    static type = 'httpinput';

    static services = ['httpinput'];

    dep = ['koa'];

    async exec(param, context) {
        super.exec(param, context);

        let node = this;

        let continuousOutput = new ContinuousOutput();

        let path = this.options.path;

        let koa = context.getService('koa');

        router.all(path, async (ctx, next) => {
            return new Promise(resolve => {
                // 注册一个function
                // 在后续http 的response响应后回到这里resolve
                context.registerService('httpinput', async (body) =>{
                    // 把http的response赋值给ctx
                    ctx.body = body;
                    // 返回http请求
                    await next();
                    // 当前节点执行完毕
                    resolve();
                });
                continuousOutput.output(new ReturnValue(0, ctx, node));
            });
        });

        koa.use(router.routes(), router.allowedMethods());

        // return new ReturnValue(0, null, this);
        return continuousOutput;
    }
}
