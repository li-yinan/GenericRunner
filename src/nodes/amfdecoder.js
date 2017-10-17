/**
 * @file transform node 用于对数据进行转换的node
 *
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import {packet} from 'amf/node-amf/amf';

export default class Transform extends Node{

    static type = 'transform';

    async exec(param, context) {
        super.exec(param, context);
        return new ReturnValue(0, packet(param), this);
    }
}
