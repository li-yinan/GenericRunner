/**
 * @file timeout node 用于定时触发
 *
 * @author liyinan
 * @version 1.0
 * @date 2017-09-12
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import ContinuousOutput from './util/continuousoutput';

export default class Interval extends Node {

    static type = 'timeout';

    async exec(param) {
        super.exec(param);

        let node = this;

        let {
            time = 3000
        } = this.options;

        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(new ReturnValue(0, null, node));
            }, time);
        });
    }
}
