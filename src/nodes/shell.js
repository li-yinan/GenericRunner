/**
 * @file shell node 用于执行shell命令的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import shell from 'shelljs';
import ReturnValue from './util/returnvalue';

export default class Shell extends Node {

    static type = 'shell';

    static declaration = {
        cmd: 'string'
    };

    async exec(param) {
        super.exec(param);
        let {cmd} = this.options;
        let ret = shell.exec(cmd);
        return new ReturnValue(0, ret, this);
    }
}
