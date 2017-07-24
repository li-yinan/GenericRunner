/**
 * @file dom node 用于在headless里查询某个特定的dom的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './node';
import ReturnValue from './returnvalue';
import {chunk, zipObject, zip} from 'lodash';

export default class Attribute extends Node {
    name = 'attribute';

    type = 'attribute';

    async exec(param) {
        super.exec(param);
        let {chrome, nodeIds} = param;
        let attributes = await Promise.all(nodeIds.map(async nodeId => {
            return await chrome.DOM.getAttributes({nodeId})
        }));
        let ret = attributes.map(attribute => {
            // headless给的格式很奇葩
            // 这里把['src', 'http://xxx']的格式转为
            // {src: 'http://xxx'} 的格式
            return zipObject.apply(this, zip.apply(this, chunk(attribute.attributes, 2)));
        });
        return new ReturnValue(0, ret, this);
    }
}
