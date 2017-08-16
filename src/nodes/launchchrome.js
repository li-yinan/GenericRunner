/**
 * @file launch chrome node 用于启动headless chrome的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
// import {chromeLauncher} from 'chrome-launcher';
// import chromeLauncher from 'chrome-launcher';
// 奇怪的是chrome-launcher这个模块import不好使。。。
let chromeLauncher = require('chrome-launcher');

export default class LaunchChrome extends Node {
    name = 'launchchrome';

    type = 'launchchrome';

    static declaration = {
        port: {
            type: 'number'
        }
    };

    constructor(...args) {
        super(...args);
        // chromeInstance是为了运行时的，serialize的时候自然不需要被枚举
        Object.defineProperty(this, 'chromeInstance', {
            emunerable: false,
            writable: true
        })
    }

    async exec(param) {
        super.exec(param);
        let {
            // mac下的默认地址
            // chromePath = '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome',
            port = 9222
        } = this.options;

        this.chromeInstance = await chromeLauncher.launch({
            chromeFlags: ['--headless', '--disable-gpu'],
            port
        });

        return new ReturnValue(0, null, this);
    }

    /**
     * headless必须要销毁，不然有子进程存在，当前进程不退出的
     *
     * @return {Promise}
     */
    async dispose() {
        await super.dispose()
        return this.chromeInstance.kill();
    }
}
