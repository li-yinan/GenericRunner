export const flow = {
    id: 'flow',
    name: 'test request',
    type: 'flow',
    nodes: [
        {
            id: '0',
            type: 'ready',
            name: 'ready'
        },
        {
            id: '1',
            type: 'transform',
            options: {
                code: 'return {hello:1}'
            },
            name: 'find b.js'
        },
        {
            id: '2',
            type: 'request',
            options: {
                url: 'http://www.baidu.com'
            },
            name: 'request'
        },
        {
            id: '3',
            type: 'console',
            name: 'console'
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
            fromPort:0,
            toId: '3',
            toPort: 0
        }
    ]
};
