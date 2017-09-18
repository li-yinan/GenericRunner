/**
 * @file interval node 用于定时触发，等同于setInterval
 *
 * @author liyinan
 * @version 1.0
 * @date 2017-08-02
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import ContinuousOutput from './util/continuousoutput';

export default class Interval extends Node {

    static type = 'interval';

    async exec(param, context) {
        super.exec(param, context);

        let node = this;

        let continuousOutput = new ContinuousOutput();

        let {
            duration = 3000,
            times = Infinity
        } = this.options;

        let cnt = 0;
        let ptr = setInterval(function () {
            cnt++;
            if (cnt > times) {
                clearInterval(ptr);
                return;
            }
            continuousOutput.output(new ReturnValue(0, null, node));
        }, duration);

        return continuousOutput;
    }
}
