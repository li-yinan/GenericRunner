export const flow = {
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
                url: 'http://qiao.baidu.com/home/'
            },
            name: 'open baidu'
        },
        {
            id: '4',
            type: 'dom',
            options: {
                selector: 'script[src]'
            },
            name: 'get dom'
        },
        {
            id: '5',
            type: 'transform',
            options: {
                code: 'return arguments[0].nodes.find(function (item) {return /hm\\.baidu\\.com\\/hm\.js/.test(item.src)});'
            },
            name: 'find b.js'
        },
        {
            id: '6',
            type: 'console',
            name: 'console result'
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
        }
    ]
};
