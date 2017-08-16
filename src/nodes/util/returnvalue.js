/**
 * @file 为了让所有node和subflow执行时有统一的返回规范，特制定此类
 * 
 * @author liyinan
 * @version 1.0
 * @date 2017-07-20
 */

export default class ReturnValue {

    /**
     * 构造函数
     *
     * @param {number} port 输出的是node的那个port
     * @param {*} data 任意的返回值
     * @param {Node} node 当前node是哪个node
     */
    constructor(port, data, node) {
        this.port = port;
        this.data = data;
        this.node = node;
    }
}
