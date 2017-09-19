/**
 * @file SignalReciever node 用于接收信号，保证流程用
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import ContinuousOutput from './util/continuousoutput';
import EventEmitter from 'events';

export default class RetryStart extends Node {

    static type = 'retrystart';

    static declaration = {
        namespace: {
            type: 'string'
        },
        times: {
            type: 'number'
        }
    };

    async exec(param, context) {
        super.exec(param, context);
        let {
            namespace,
            times
        } = this.options;
        let node = this;
        context.signal = context.signal || new EventEmitter();
        context[namespace] = context[namespace] || {};
        let continuousOutput = new ContinuousOutput();
        let emitter = context.signal;
        // 把count传递下去，让retryend知道什么时候结束
        context[namespace].count = 0;
        context[namespace].times = times;
        let callback = () => {
            if (context[namespace].count < times) {
                continuousOutput.output(new ReturnValue(0, param, node));
            }
            context[namespace].count++;
        };
        // 每次retryend发出信号的时候把计数器加一
        emitter.on(namespace, callback);
        setTimeout(function () {
            callback();
        }, 10)

        return continuousOutput;
    }
}
