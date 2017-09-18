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

export default class DomVisible extends Node {

    static type = 'domvisible';

    dep = ['chrome'];

    async exec(nodes=[], context) {
        super.exec(nodes, context);
        let chrome = context.getService('chrome');
        let styles = await Promise.all(nodes.map(async node => {
            let nodeId = node.nodeId;
            let ret = await chrome.CSS.getComputedStyleForNode({nodeId});
            let res = {};
            ret.computedStyle.map(styleProperty => {
                res[styleProperty.name] = styleProperty.value;
            });
            res.nodeId = nodeId
            return res;
        }));
        return new ReturnValue(0, styles, this);
    }
}
