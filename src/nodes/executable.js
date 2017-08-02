import ReturnValue from './returnvalue';

export default class Executable {

    id = 'defaultId';
    // 当前node的类型
    type = 'executable';

    // 展现名称，也用于执行路径记录
    // 需子类override
    name = 'executable';

    context = {};

    // TODO
    // 用于描述options里字段的验证信息
    // 比如这个node需要在配置的时候添加一个url，类型是字符串，就需要在这里声明：
    // declaration = {
    //      url: {
    //          required: true,
    //          type: string,
    //          regexp: /^https?:\/\//
    //      }
    // }
    // 用于界面生成options需要的表单
    // 对于options每一项的声明、展现类型、校验
    static declaration = {};
    
    // 声明要注册到context里的服务
    // 不声明的服务不会被传递到各个node
    // 使用static是因为可以在非实例化的场景下直接读取
    static services = [];

    // 所有前级节点拥有的service，方便计算依赖的service是否都有
    // 初始化就是个空的，会在node实例化的时候赋值
    parentServices = [];

    // 描述当前node依赖哪些node
    // 目前只能依赖某种特定type的node，而不能依赖于某个id的node
    static dep = [];

    // node在配置的时候填入的参数
    options = {};
    
    // 描述有多少个输入，通常是一个，merge之类的是多个
    in = 1;

    // 描述有多少个输出，通常是一个，switch之类的是多个
    out = 1;

    constructor() {
        Object.defineProperty(this, 'context', {
            enumerable: false,
            writable: true,
            value: this.context
        });
        Object.defineProperty(this, 'parentServices', {
            enumerable: false,
            writable: true,
            value: this.context
        });
    }

    registerService(key, value) {
        let services = this.constructor.services;
        // 验证要注册的key是否是声明过的
        if (services.indexOf(key) !== -1) {
            // 调用flow的注册，把服务记录到flow上
            // 然后在运行时再从flow复制回node
            // 这样可以防止未被注册的服务到处传递引起混乱
            this.context.flow.registerService(key, value);
        }
    }

    getService(name) {
        let service = this.context.service[name];
        if (service) {
            return service;
        }
        throw `you have to specific declare service '${name}'`;
    }

    /**
     * 执行node，默认实现只trace当前执行，子类需调用父类方法，然后实现子类操作
     *
     * @param param
     */
    async exec(...args) {
        this.trace('exec: ', ...args);
    }

    /**
     * 如果一个node创建了一些资源，需要手动销毁，那么要override这个函数，比如你启动了一个headless，所有程序执行完需要销毁他
     * 这个函数会在flow 或者subflow 执行完毕后执行
     * 请仔细理解这句话，subflow会在执行完销毁当前subflow的资源，所以请不要在subflow内创建可被外界调用的资源、服务等
     */
    async dispose(...args) {
        // this.trace('dispose: ', ...args);
    }

    trace(name, ...args) {
        try {
            console.log(name, `ID: ${this.id}; Name: ${this.name}; param: ${JSON.stringify(args)}; options: ${JSON.stringify(this.options)};`);
        }
        catch (e) {
            console.log(name, `ID: ${this.id}; Name: ${this.name}; param: circular json, can't be stringified; options: ${JSON.stringify(this.options)};`);
            // 这个try catch是因为有些arg和options是有循环引用的，JSON.stringify()会报错，但是并无大碍，只是调试而已
        }
    }
}
