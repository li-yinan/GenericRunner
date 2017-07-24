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
        let code = this.options.code;
        super.exec(param);
        let ret;
        try {
            let func = new Function(code);
            ret = func(param);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        return new ReturnValue(0, ret, this);
    }
}
