/**
 * @file switch node 用于对数据进行条件判断的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-26
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';

export default class Transform extends Node{
    name = 'switch';

    type = 'switch';

    static declaration = {
        params: {
            type: 'array.string'
        },
        conditions: {
            type: 'array.string'
        }
    }

    async exec(param) {
        let conditions = this.options.conditions || [];
        let params = this.options.params || [];
        let code = '';
        super.exec(param);
        let toPort;
        try {
            if (params.length) {
                // 把用户指定的参数名从arguments里解构出来
                code = 'let [' + params.join(',') + '] = arguments;' + code;
            }
            // 生成每个条件的判断代码
            let codes = conditions.map((cond, index) => `
                if (${cond}) {
                    return ${index};
                }
            `);
            code += codes.join('');
            // 所有条件都没match会抛一个错误
            code += `throw 'no matched switch, param: ' + JSON.stringify(arguments)`;
            let func = new Function(code);
            toPort = func(param);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        return new ReturnValue(toPort, param, this);
    }
}
