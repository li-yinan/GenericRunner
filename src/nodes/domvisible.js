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
        let boxModels = await Promise.all(nodes.map(async node => {
            let nodeId = node.nodeId;
            try {
                // 能获得dom的boxmodel的是现实出来的元素，获得不到的是display：none的元素
                let boxModel = await chrome.DOM.getBoxModel({nodeId});
                return {
                    nodeId,
                    visible: true
                };
            }
            catch (e) {
                return {
                    nodeId,
                    visible: false
                };
            }
        }));
        return new ReturnValue(0, boxModels, this);
    }
}
