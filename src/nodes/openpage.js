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

export default class OpenPage extends Node {

    static type = 'openpage';

    // 注册chrome的service
    static services = ['chrome'];

    static declaration = {
        port: {
            type: 'number'
        }
    }

    async exec(param, context) {
        super.exec(param, context);
        let url = param;
        let {
            port = 9222
        } = this.options;
        let client = await cri({
            port
        });
        this.client = client;
        context.registerService('chrome', client);
        let {Page, Network, DOM, CSS} = client;
        // 记录请求，由于请求是事件的方式，每次新的事件到来都会给这个数组增加一项
        // 传递给下一个node的是这个数组的引用，直接读取就可以获取到已经产生的所有请求
        let networkCollection = [];
        // 监听网络请求
        Network.requestWillBeSent(params => {
            networkCollection.push(params);
        });
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
