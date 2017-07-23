/**
 * @file shell node 用于执行shell命令的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './node';
import shell from 'shelljs';
import ReturnValue from './returnvalue';

export default class Shell extends Node {
    name = 'shell';

    type = 'shell';

    async exec(param) {
        super.exec(param);
        let {cmd, waitUntilDone} = this.options;
        let ret = shell.exec(cmd);
        return new ReturnValue(0, ret, this);
    }
}
