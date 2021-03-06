/**
 * @file launch Koa2 node 用于启动koa2 server的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-08-2
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import http from 'http';

export default class LaunchKoa extends Node {

    static type = 'launchkoa';

    static services = ['koa'];

    static declaration = {
        port: {
            type: 'string'
        }
    };

    constructor(...args) {
        super(...args);
        // chromeInstance是为了运行时的，serialize的时候自然不需要被枚举
        Object.defineProperty(this, 'koa', {
            emunerable: false,
            writable: true
        });
    }

    async exec(param, context) {
        super.exec(param, context);

        let {
            port = 3000
        } = this.options;

        let app = new Koa();
        app.use(bodyParser());


        this.server = http.createServer(app.callback());
        this.server.listen(port - 0);

        context.registerService('koa', app);

        return new ReturnValue(0, null, this);
    }

    /**
     * koa是个服务，不要销毁，不然其他node运行完就退出了
     *
     * @return {Promise}
     */
    async dispose() {
        await super.dispose();
        let server = this.server;
        return new Promise((resolve, reject) => {
            if (server) {
                server.close(function () {
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
}
