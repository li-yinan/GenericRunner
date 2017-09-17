/**
 * @file pager 用于从后台获取分页数据的node
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-23
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import ContinuousOutput from './util/continuousoutput';
import EventEmitter from 'events';
import reqwest from 'reqwest';

export default class Pager extends Node {

    static type = 'pager';

    static declaration = {
        name: {
            type: 'string'
        },
        url: {
            type: 'string'
        },
        page_size: {
            type: 'number'
        },
        page_num: {
            type: 'number'
        },
        data: {
            type: 'object'
        }
    };

    async exec(param) {
        super.exec(param);
        let list = [];
        let {
            url,
            name,
            page_num = 1, // 起始页码
            page_size = 20,
            data
        } = this.options;
        let flow = this.context.flow;

        let total = Infinity;

        async function request() {
            if (page_num * page_size < total) {
                page_num++;
                try {
                    let ret = await reqwest({
                        url,
                        data: {
                            ...data,
                            page_num,
                            page_size
                        }
                    });
                    if (!ret.status) {
                        total = ret.total;
                        list = list.concat(ret.list);
                    }
                }
                catch (e) {
                }
            }
        }

        async function getOne() {
            if (list.length) {
                return list.shift();
            }
            else {
                await request();
                return list.shift();
            }
        }

        flow.signal = flow.signal || new EventEmitter();
        let continuousOutput = new ContinuousOutput();
        let emitter = this.context.flow.signal;

        emitter.on(name, async () => {
            continuousOutput.output(new ReturnValue(0, await getOne(), this));
        });

        return continuousOutput;
    }
}
