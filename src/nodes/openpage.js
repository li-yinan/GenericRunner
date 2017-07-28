/**
 * @file openpage node 用于在headless里打开页面的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './node';
import ReturnValue from './returnvalue';
import cri from 'chrome-remote-interface';

export default class OpenPage extends Node {
    name = 'openpage';

    type = 'openpage';

    static declaration = {
        url: {
            type: 'string'
        }
    }

    async exec(param) {
        super.exec(param);
        let url = this.options.url;
        let client = await cri();
        let {Page, Network, DOM} = client;
        // 记录请求，由于请求是事件的方式，每次新的事件到来都会给这个数组增加一项
        // 传递给下一个node的是这个数组的引用，直接读取就可以获取到已经产生的所有请求
        let networkCollection = [];
        // 监听网络请求
        Network.requestWillBeSent(params => {
            networkCollection.push(params);
        });
        await Promise.all([DOM.enable(), Page.enable(), Network.enable()]);
        await Page.navigate({url});
        await Page.loadEventFired();
        return new ReturnValue(0, {
            chrome: client,
            network: networkCollection
        }, this);
    }
}
