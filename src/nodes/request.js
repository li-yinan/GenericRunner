/**
 * @file pager 用于从后台获取分页数据的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import reqwest from 'reqwest';

export default class Request extends Node {

    static type = 'request';

    static declaration = {
        url: {
            type: 'string'
        }
    };

    async exec(param, context) {
        super.exec(param, context);

        let {
            url
        } = this.options;

        let ret = await reqwest({
            url,
            data: param
        });

        return new ReturnValue(0, ret, this);
    }
}
