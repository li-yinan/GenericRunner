import Executable from './executable';
export default class Node extends Executable {

    // 存储可配置的选项
    options = {};

    // 当前node的类型
    static type = 'node';

    // 展现名称，也用于执行路径记录
    // 需子类override
    name = 'node';
}
