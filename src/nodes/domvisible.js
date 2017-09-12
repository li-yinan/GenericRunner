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

    async exec(nodes) {
        super.exec(nodes);
        let chrome = this.getService('chrome');
        let boxModels = nodes.map(node => {
            let boxModel = await chrome.DOM.getBoxModel(node.nodeId);
            return {
                nodeId: node.nodeId,
                boxModel
            };
        });
        return new ReturnValue(0, boxModels, this);
    }
}
