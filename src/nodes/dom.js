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

export default class Dom extends Node {

    static type = 'dom';

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
        let nodes = await chrome.evaluate((selector) => {
            var nodes = [].slice.call(document.querySelectorAll(selector));
            return nodes.map(node => node.src);
        }, selector);
        // let nodes = await chrome.$$(selector);
        // nodes.map(async node => await node.attribute('src'));
        console.log('>>>1', nodes);
        return new ReturnValue(0, nodes, this);
    }
}
