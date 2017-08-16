/**
 * @file shell node 用于执行shell命令的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';

export default class Console extends Node {

    static type = 'console';

    out = 0;

    async exec(param) {
        super.exec(param);
        console.log(param);
        return new ReturnValue(0, null, this);
    }
}
