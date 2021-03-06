/**
 * @file ready node 用于执行初始任务的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';

export default class Ready extends Node {

    static type = 'ready';

    in = 0;

    async exec(param, context) {
        super.exec(param, context);
        return new ReturnValue(0, null, this);
    }
}
