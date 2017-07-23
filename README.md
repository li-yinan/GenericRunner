# genericrunner 
A generic task runner
## Usage:
This is a example to get all `input` in the page by using the genericrunner
```javascript
import {Engine, buildFlowFromConfig} from 'genericrunner';
let flowConfig = {
    id: 'flow', // id is a unique string
    type: 'flow', // means this is a flow node
    nodes: [
        // start node
        {
            id: '0',
            type: 'ready',
            name: 'ready'
        },
        // we initial the chrome headless mode
        {
            id: '1',
            type: 'launchchrome',
            options: {
                port: 9222
            },
            name: 'init chrome headless'
        },
        // open a page
        {
            id: '2',
            type: 'openpage',
            options: {
                url: 'http://www.baidu.com'
            },
            name: 'open baidu'
        },
        // transform node is for data transform
        // we get chrome instance from prev node result
        {
            id: '3',
            type: 'transform',
            options: {
                code: 'return arguments[0].chrome;'
            },
            name: 'get chrome from {chrome, network}'
        },
        // get all input from the page
        {
            id: '4',
            type: 'dom',
            options: {
                selector: 'input'
            },
            name: 'get dom'
        }
    ],
    links: [
        {
            type: 'link',
            fromId: '0',
            fromPort: 0,
            toId: '1',
            toPort: 0
        },
        {
            type: 'link',
            fromId: '1',
            fromPort:0, 
            toId: '2',
            toPort: 0
        },
        {
            type: 'link',
            fromId: '2',
            fromPort: 0,
            toId: '3',
            toPort: 0
        },
        {
            type: 'link',
            fromId: '3',
            fromPort: 0,
            toId: '4',
            toPort: 0
        }
    ]
}
let flow = buildFlowFromConfig(flowConfig);
let engine = new Engine(flow);
await engine.run();
console.log('done');
```
## nodes:
```
ready: start node
dom: get dom from page
launchchrome: initial a headless chrome with a blank page
openpage: open a page in headless chrome, return network & dom modules
shell: execute a shell command, hold the process util command executed
transform: when the input & output requires diffrent struct of data, please use transform to adapt
There will be more~
```


## How can I extends more kind of node?
### very easy:
```javascript
import {
    addCustomNodeSeachPath,
    Node,
    ReturnValue
} from 'genericrunner';

// the path where you node placed; 
addCustomNodeSeachPath('xxx');
export default class MyNode extends Node {
    name = 'myNode';

    // The type is exactly the same with your filename,
    // genericrunner find your node by filename, so don't make it diffrent 
    type = 'myNode';

    async exec(param) {
        super.exec(param);
        // custom options
        let {xxx, yyy} = this.options;
        // do what you want
        let ret = 'ret';
        // and return a ReturnValue instance
        return new ReturnValue(0, ret, this);
    }
}

```
