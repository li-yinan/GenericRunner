import {Engine, deserialize, serialize, buildFlowFromConfig} from '../src/index';

async function main() {
    let flow = {
        id: 'flow',
        type: 'flow',
        nodes: [
            //{
            //    id: '0',
            //    type: 'ready',
            //    name: 'ready'
            //},
            //{
            //    id: '1',
            //    type: 'launchchrome',
            //    options: {
            //        port: 9222
            //    },
            //    name: 'init chrome headless'
            //},
            //{
            //    id: '2',
            //    type: 'openpage',
            //    options: {
            //        url: 'http://qiao.baidu.com/home/'
            //    },
            //    name: 'open baidu'
            //},
            //{
            //    id: '3',
            //    type: 'transform',
            //    options: {
            //        code: 'return arguments[0].chrome;'
            //    },
            //    name: 'get chrome from {chrome, network}'
            //},
            //{
            //    id: '4',
            //    type: 'dom',
            //    options: {
            //        selector: 'script[src]'
            //    },
            //    name: 'get dom'
            //},
            //{
            //    id: '5',
            //    type: 'transform',
            //    options: {
            //        code: 'return arguments[0].nodes.find(function (item) {return /hm\\.baidu\\.com\\/hm\.js/.test(item.src)});'
            //    },
            //    name: 'find b.js'
            //},
            //{
            //    id: '6',
            //    type: 'console',
            //    name: 'console result'
            //},
            {
                id: '10',
                type: 'ready',
                name: 'ready a'
            },
            {
                id: '11',
                type: 'transform',
                options: {
                    code: 'return \'a\';'
                },
                name: 'return a'
            },
            {
                id: '12',
                type: 'ready',
                name: 'ready b'
            },
            {
                id: '13',
                type: 'transform',
                options: {
                    code: 'return \'b\';'
                },
                name: 'return b'
            },
            {
                id: '14',
                type: 'merge',
                in: 2,
                options: {
                    keys: ['port1', 'port2']
                },
                name: 'merge a & b'
            },
            {
                id: '15',
                type: 'console',
                name: 'console merge result'
            },
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
                toId: '5',
                toPort: 0
            },
            {
                type: 'link',
                fromId: '5',
                fromPort: 0,
                toId: '6',
                toPort: 0
            },
            {
                type: 'link',
                fromId: '6',
                fromPort: 0,
                toId: '7',
                toPort: 0
            },
            {
                type: 'link',
                fromId: '10',
                fromPort: 0,
                toId: '11',
                toPort: 0
            },
            {
                type: 'link',
                fromId: '12',
                fromPort: 0,
                toId: '13',
                toPort: 0
            },
            {
                type: 'link',
                fromId: '11',
                fromPort: 0,
                toId: '14',
                toPort: 0
            },
            {
                type: 'link',
                fromId: '13',
                fromPort: 0,
                toId: '14',
                toPort: 1
            },
            {
                type: 'link',
                fromId: '14',
                fromPort: 0,
                toId: '15',
                toPort: 0
            },
        ]
    };
    // let flow = {
    //     id: 'flow',
    //     type: 'flow',
    //     nodes: [
    //         {
    //             id: '0',
    //             type: 'ready',
    //             name: 'ready'
    //         },
    //         {
    //             id: '1',
    //             type: 'subflow',
    //             inMap: [{
    //                 type: 'portmap',
    //                 mapId: '5',
    //                 mapPort: 0
    //             }],
    //             outMap: [{
    //                 type: 'portmap',
    //                 mapId: '6',
    //                 mapPort: 1
    //             }, {
    //                 type: 'portmap',
    //                 mapId: '6',
    //                 mapPort: 0
    //             }],
    //             name: 'urlNode-hello1',
    //             nodes: [
    //                 {
    //                     id: '5',
    //                     type: 'shell',
    //                     options: {
    //                         cmd: 'echo hello'
    //                     },
    //                     name: 'shell'
    //                 },
    //                 {
    //                     id: '6',
    //                     type: 'url',
    //                     name: 'urlNode-hello6'
    //                 }
    //             ],
    //             links: [
    //                 {
    //                     type: 'link',
    //                     fromId: '5',
    //                     fromPort: 0,
    //                     toId: '6',
    //                     toPort: 0
    //                 }
    //             ]
    //         },
    //         {
    //             id: '2',
    //             type: 'url',
    //             name: 'urlNode-hello2'
    //         },
    //         {
    //             id: '3',
    //             type: 'url',
    //             name: 'urlNode-hello3'
    //         },
    //         {
    //             id: '4',
    //             type: 'url',
    //             name: 'urlNode-hello4'
    //         }
    //     ],
    //     links: [
    //         {
    //             type: 'link',
    //             fromId: '0',
    //             fromPort: 0,
    //             toId: '1',
    //             toPort: 0
    //         },
    //         {
    //             type: 'link',
    //             fromId: '1',
    //             fromPort: 1,
    //             toId: '2',
    //             toPort: 0
    //         },
    //         {
    //             type: 'link',
    //             fromId: '1',
    //             fromPort: 0,
    //             toId: '3',
    //             toPort: 0
    //         },
    //         {
    //             type: 'link',
    //             fromId: '2',
    //             fromPort: 0,
    //             toId: '4',
    //             toPort: 0
    //         },
    //         {
    //             type: 'link',
    //             fromId: '3',
    //             fromPort: 0,
    //             toId: '4',
    //             toPort: 0
    //         },
    //     ]
    // };
    let flowInst = buildFlowFromConfig(flow);
    // flowInst = deserialize(flowStr);
    let engine = new Engine(flowInst);
    await engine.run();
    // console.log(serialize(flowInst));
    console.log('done');
}

main();
