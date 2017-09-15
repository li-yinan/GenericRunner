/**
 * @file launch chrome node 用于启动headless chrome的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';

export default class SignalSender extends Node {

    static type = 'signalsender';

    static declaration = {
        name: {
            type: 'string'
        }
    };

    async exec(param) {
        super.exec(param);
        let {
            name
        } = this.options;
        let signal = this.context.flow.signal;
        if (signal) {
            signal.emit(name, param);
        }
        else {
            throw 'signal not found';
        }
        return new ReturnValue(0, param, this);
    }
}
