var runner = require('../');
var Engine = runner.Engine;
var deserialize = runner.deserialize;
var serialize = runner.serialize;
var buildFlowFromConfig = runner.buildFlowFromConfig;

function main() {
    var flow = {
        id: 'flow',
        type: 'flow',
        nodes: [
            {
                id: '0',
                type: 'ready',
                name: 'ready'
            },
            {
                id: '1',
                type: 'launchchrome',
                options: {
                    port: 9222
                },
                name: 'init chrome headless'
            },
            {
                id: '2',
                type: 'openpage',
                options: {
                    url: 'http://www.baidu.com'
                },
                name: 'open baidu'
            },
            {
                id: '3',
                type: 'transform',
                options: {
                    code: 'return arguments[0].chrome;'
                },
                name: 'get chrome from {chrome, network}'
            },
            {
                id: '4',
                type: 'dom',
                options: {
                    selector: 'input'
                },
                name: 'get dom'
            },
            {
                id: '5',
                type: 'transform',
                options: {
                    code: 'return arguments[0].network;'
                },
                name: 'get network from {chrome, network}'
            },
            {
                id: '6',
                type: 'url',
                name: 'urlNode-hello4'
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
            },
            {
                type: 'link',
                fromId: '4',
                fromPort: 0,
                toId: '6',
                toPort: 0
            },
            {
                type: 'link',
                fromId: '2',
                fromPort: 0,
                toId: '5',
                toPort: 0
            },
            {
                type: 'link',
                fromId: '5',
                fromPort: 0,
                toId: '6',
                toPort: 0
            }
        ]
    };
    var flowInst = buildFlowFromConfig(flow);
    var engine = new Engine(flowInst);
    engine.run().then(function () {
        console.log('done');
    });
}

main();
