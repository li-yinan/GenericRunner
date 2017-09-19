/**
 * @file launch chrome node 用于启动headless chrome的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';

export default class RetryEnd extends Node {

    static type = 'retryend';

    static declaration = {
        namespace: {
            type: 'string'
        }
    };

    async exec(param, context) {
        super.exec(param, context);
        let {
            namespace
        } = this.options;

        let signal = context.signal;

        let {
            count,
            times
        } = context[namespace];

        if (signal && count < times) {
            signal.emit(namespace, param);
            return new ReturnValue(-1, param, this);
        }

        return new ReturnValue(0, param, this);
    }
}
