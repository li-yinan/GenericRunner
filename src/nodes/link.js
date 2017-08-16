export default class Link {

    // 当前连接的ID
    linkId = '';

    // 输入node 的 nodeId
    fromId = '';
    fromPort = 0;

    // 输出 node 的 nodeId
    toId = '';
    toPort = 0;

    static type = 'link';

    constructor() {
        // 把静态的type赋值给实例
        this.type = this.constructor.type;
    }
}
