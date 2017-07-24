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

export default class Dom extends Node {
    name = 'dom';

    type = 'dom';

    async exec(chrome) {
        super.exec(chrome);
        let selector = this.options.selector;
        let doc = await chrome.DOM.getDocument();
        let doms = await chrome.DOM.querySelectorAll({
            nodeId: doc.root.nodeId,
            selector
        });
        let nodes = await Promise.all(doms.nodeIds.map(async nodeId => {
            let ret = await chrome.DOM.getAttributes({nodeId});
            // headless给的格式很奇葩
            // 这里把['src', 'http://xxx', 'async', '']的格式转为
            // {src: 'http://xxx', async: ''} 的格式
            ret = zipObject.apply(this, zip.apply(this, chunk(ret.attributes, 2)));
            ret.nodeId = nodeId;
            return ret;
        }));
        return new ReturnValue(0, {
            chrome,
            nodes
        }, this);
    }
}
