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

export default class SignalReciever extends Node {

    static type = 'signalreciever';

    static declaration = {
        name: {
            type: 'string'
        }
    };

    async exec(param, context) {
        super.exec(param, context);
        let {
            name
        } = this.options;
        let flow = this.context.flow;
        let node = this;
        flow.signal = flow.signal || new EventEmitter();
        let continuousOutput = new ContinuousOutput();
        let emitter = this.context.flow.signal;
        emitter.on(name, data => {
            continuousOutput.output(new ReturnValue(0, data, node));
        });

        return continuousOutput;
    }
}
