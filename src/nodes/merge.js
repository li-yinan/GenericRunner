/**
 * @file ready node 用于执行初始任务的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './node';
import ReturnValue from './returnvalue';
import {zipObject} from 'lodash';

export default class Merge extends Node {
    name = 'merge';

    type = 'merge';

    async exec(...args) {
        super.exec(...args);
        let keys = this.options.keys;
        let ret = zipObject(keys, args)
        return new ReturnValue(0, ret, this);
    }
}
