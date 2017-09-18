/**
 * @file openpage node 用于在headless里打开页面的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';

export default class ClosePage extends Node {

    static type = 'closepage';

    dep = ['chrome'];

    async exec(param, context) {
        super.exec(param, context);
        let chrome = context.getService('chrome');
        await chrome.close();
        return new ReturnValue(0, param, this);
    }
}
