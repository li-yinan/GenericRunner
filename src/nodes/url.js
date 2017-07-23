import Node from './node';
import ReturnValue from './returnvalue';

export default class UrlNode extends Node{
    name = 'url';

    type = 'url';

    async exec(param) {
        super.exec(param);
        return new ReturnValue(0, 'hello world ' + +new Date(), this);
    }
}
