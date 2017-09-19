/**
 * @file openpage node 用于在headless里打开页面的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import cri from 'chrome-remote-interface';
import EventEmitter from 'events';

export default class OpenPage extends Node {

    static type = 'openpage';

    // 注册chrome的service
    static services = ['chrome'];

    static declaration = {
        port: {
            type: 'number'
        },
        signalname: {
            type: 'string'
        }
    }

    async exec(param, context) {
        super.exec(param, context);
        let url = param;
        let {
            signalname,
            port = 9222
        } = this.options;
        let client = await cri({
            port
        });
        let flow = this.context.flow;
        flow.signal = flow.signal || new EventEmitter();
        let signal = flow.signal;
        this.client = client;
        context.registerService('chrome', client);
        let {Page, Network, DOM, CSS} = client;
        if (signalname) {
            // 监听网络请求
            Network.requestWillBeSent(params => {
                signal.emit(signalname, params);
            });
        }
        await Promise.all([DOM.enable(), Page.enable(), Network.enable(), CSS.enable()]);
        await Page.navigate({url});
        await Page.loadEventFired();
        return new ReturnValue(0, null, this);
    }

    async dispose() {
        await super.dispose();
        return this.client && this.client.close();
    }
}
