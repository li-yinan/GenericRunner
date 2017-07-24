/**
 * @file shell node 用于执行shell命令的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './node';
import ReturnValue from './returnvalue';

export default class Console extends Node {
    name = 'console';

    type = 'console';

    out = 0;

    async exec(param) {
        super.exec(param);
        console.log(param);
        return new ReturnValue(0, null, this);
    }
}
