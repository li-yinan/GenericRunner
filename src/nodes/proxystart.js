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

export default class ProxyStart extends Node {

    static type = 'proxystart';

    static declaration = {
        keys: {
            port: 'number'
        }
    };

    async exec(param, context) {
        super.exec(param, context);

        let {
            port = 8081;
        } = this.options;

        await exec('-setwebproxy', 'Wi-Fi', '127.0.0.1', port);
        return new ReturnValue(0, null, this);
    }
}
