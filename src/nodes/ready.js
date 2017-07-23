/**
 * @file ready node 用于执行初始任务的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './node';
import ReturnValue from './returnvalue';

export default class Ready extends Node{
    name = 'ready';

    type = 'ready';

    in = 0;

    async exec(param) {
        super.exec(param);
        return new ReturnValue(0, null, this);
    }
}
