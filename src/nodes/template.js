/**
 * @file template node 用于生成页面的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';

export default class Console extends Node {

    static type = 'template';

    static declaration = {
        type: {
            type: 'string'
        },
        template: {
            type: 'string'
        }
    };

    async exec(param, context) {
        super.exec(param, context);
        console.log(param);
        return new ReturnValue(0, null, this);
    }
}
