import {cloneDeep, assign, merge} from 'lodash';
let cnt = 1;
export default class Context {

    service = {};

    scope = 's';

    constructor() {
        this.id = +new Date();
    }

    newScope() {
        this.scope = this.scope + '_' + cnt++;
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
        return merge(this, context);
    }
}
