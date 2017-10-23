import {cloneDeep, assign, merge} from 'lodash';
let cnt = 1;
export default class Context {

    service = {};

    scope = 's_';

    constructor() {
        this.id = +new Date();
    }

    newScope() {
        this.scope = this.scope + (cnt++) + '_';
    }

    registerService(key, value) {
        this.service[key] = value;
    }

    getService(key) {
        let service = this.service[key];
        if (service) {
            return service;
        }
        throw `you have to specific declare service '${key}'`;
    }

    clone() {
        let instance = new Context();
        instance = assign(instance, this);
        instance.service = assign({}, instance.service);
        return instance;
    }

    merge(context) {
        merge(this, context);
        // 用scope层级最深的那个
        if (context.scope.length > this.scope.length) {
            this.scope = context.scope;
        }
        return this;
    }
}
