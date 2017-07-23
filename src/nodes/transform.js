/**
 * @file transform node 用于对数据进行转换的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './node';
import ReturnValue from './returnvalue';

export default class Transform extends Node{
    name = 'transform';

    type = 'transform';

    async exec(param) {
        let transformCodeStr = this.options.code;
        let transformFunction = new Function(transformCodeStr);
        super.exec(param);
        let ret = transformFunction(param);
        return new ReturnValue(0, ret, this);
    }
}
