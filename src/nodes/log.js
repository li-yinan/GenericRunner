/**
 * @file log node 用于数据日志
 *
 * @author liyinan
 * @version 1.0
 * @date 2017-09-13
 */

import Node from './util/node';
import ReturnValue from './util/returnvalue';
import log4js from 'log4js';


export default class Log extends Node {

    static type = 'log';

    out = 0;

    async exec(param) {
        super.exec(param);

        let node = this;

        let {
            logType = 'file',
            level = 'info',
            layout = 'basic',
            fileName = 'genericrunner.log'
        } = this.options;

        log4js.configure({
              appenders: {
                  genericrunner: {
                      type: logType,
                      layout: {
                          type: layout
                      },
                      filename: fileName
                  }
              },
            categories: {
                default: {
                    appenders: ['genericrunner'],
                    level
                }
            }
        });

        const logger = log4js.getLogger('genericrunner');

        logger.info(JSON.stringify(param));

        return new ReturnValue(0, null, node);
    }
}
