/**
 * @file subflow，subflow理应只有一个输出和多个输出
 * 如果业务存在多个输入的情况也应使用merge、wait等node合并为一个再输入
 * 多个输出应保持互斥，不会出现有两个输出的情况，这会导致无法计算subflow是否执行完毕
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Flow from './flow';
import ReturnValue from './util/returnvalue';
import {asyncFlowRunner, Pair} from './util/util';
import {uniq} from 'lodash';

export default class SubFlow extends Flow {

    static type = 'subflow';


    options = {
        // 用于把subFlow的输入映射到某个node的输入
        // inMap的第一项为subflow的input的port 0，以此类推
        inMap: [],

        // 用于把subFlow的输出映射到某个node的输出
        // outMap的第一项为subflow的output的port 0，以此类推
        // example:
        // outMap = [{type: 'portmap', mapId: 'xxx', mapPort: '1'}]
        // 代表当id为xxx的node执行完，并且在这个node的port 1输出，则把这个结果映射到subflow的port 0(因为这个对象在outMap的第0个位置)
        // 不懂的问liyinan
       outMap: []
    }

    buildDep() {
        this.dep = uniq(this.nodes.reduce((all, node) => {
            return all.concat(node.dep);
        }, []));
    }

    getNodeById(id) {
        return this.nodes.find(node => node.id === id);
    }

    async exec(...args) {
        this.trace('exec', ...args);

        let {
            inMap,
            outMap
        } = this.options;

        // 找到subflow的输入应该映射到内部的哪个node的哪个port，以此来确定subflow初始执行的节点
        let pairs = inMap.map((portMap, index) => new Pair(this.getNodeById(portMap.toId), args[index], portMap.toPort));
        // 执行subflow
        let {port, data, node} = await asyncFlowRunner(this, pairs);
        // 找到当前执行结果应该映射到subflow 输出的哪个端口
        let outPort = outMap.findIndex(portMap => portMap.fromId === node.id && portMap.fromPort === port);
        return new ReturnValue(outPort, data, this);
    }
}
