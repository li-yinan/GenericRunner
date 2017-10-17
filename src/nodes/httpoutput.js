/**
 * @file dom node 用于在headless里查询某个特定的dom的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import {chunk, zipObject, zip} from 'lodash';
import ejs from 'ejs';

export default class httpoutput extends Node {

    static type = 'httpoutput';

    dep = ['httpinput'];
    
    out = 0;

    static declaration = {
        template: {
            type: 'code'
        }
    }

    async exec(param, context) {
        super.exec(param, context);
        let callback = context.getService('httpinput');
        let template = this.options.template || '';
        callback(ejs.render(template, param));
        return new ReturnValue(0, null, this);
    }
}
