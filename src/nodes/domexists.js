/**
 * @file dom node 用于在headless里查询某个特定的dom的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';

export default class DomExists extends Node {

    static type = 'domexists';

    dep = ['chrome'];

    static declaration = {
        selector: {
            type: 'string'
        }
    }

    async exec() {
        super.exec();
        let chrome = this.getService('chrome');
        let selector = this.options.selector;
        let doc = await chrome.DOM.getDocument();
        let {nodeId} = await chrome.DOM.querySelector({
            nodeId: doc.root.nodeId,
            selector
        });
        return new ReturnValue(0, !!nodeId, this);
    }
}
