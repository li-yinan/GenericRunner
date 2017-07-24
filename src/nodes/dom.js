/**
 * @file dom node 用于在headless里查询某个特定的dom的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './node';
import ReturnValue from './returnvalue';

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
        return new ReturnValue(0, {
            chrome: chrome,
            nodeIds: doms.nodeIds
        }, this);
    }
}
