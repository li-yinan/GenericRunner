export default class Link {

    // 当前连接的ID
    linkId = '';

    // 输入node 的 nodeId
    fromId = '';
    fromPort = 0;

    // 输出 node 的 nodeId
    toId = '';
    toPort = 0;

    // 展现名称，也用于执行路径记录
    // 需子类override
    name = 'default';

    type = 'link';
}
