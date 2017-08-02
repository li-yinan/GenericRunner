/**
 * @file interval node 用于定时触发，等同于setInterval
 *
 * @author liyinan
 * @version 1.0
 * @date 2017-08-02
 */

import Node from './node';
import ReturnValue from './returnvalue';
import ContinuousOutput from './continuousoutput';

export default class Interval extends Node {
    name = 'interval';

    type = 'interval';

    in = 0;

    async exec(param) {
        super.exec(param);

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
