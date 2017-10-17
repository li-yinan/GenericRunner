/**
 * @file proxy start node 用于设置mac下的全局代理
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import {exec} from 'grant-setproxy';

export default class ProxyEnd extends Node {

    static type = 'proxyend';

    async exec(param, context) {
        super.exec(param, context);
        await exec('-setwebproxystate', 'Wi-Fi', 'off');
        return new ReturnValue(0, null, this);
    }
}
