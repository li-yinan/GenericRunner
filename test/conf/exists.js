export const flow = {
    id: 'flow',
    name: 'get script flow',
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
            type: 'transform',
            options: {
                code: `return 'http://localhost:8848'`
            },
            name: 'test page'
        },
        {
            id: '3',
            type: 'openpage',
            name: 'open baidu'
        },
        {
            id: '4',
            options: {
                selector: 'div'
            },
            type: 'domexists',
            name: 'dom exists'
        },
        {
            id: '5',
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
        }
    ]
};
