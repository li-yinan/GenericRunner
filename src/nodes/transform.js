/**
 * @file transform node 用于对数据进行转换的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';

export default class Transform extends Node{

    static type = 'transform';

    static declaration = {
        params: {
            type: 'array.string'
        },
        code: {
            type: 'code'
        }
    };

    async exec(param) {
        let code = this.options.code;
        let params = this.options.params;
        super.exec(param);
        let ret;
        try {
            if (params && params.length) {
                // 把用户指定的参数名从arguments里解构出来
                code = 'let [' + params.join(',') + '] = arguments;' + code;
            }
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
