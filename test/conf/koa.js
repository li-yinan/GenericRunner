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
            type: 'launchkoa',
            options: {
                port: 9222
            },
            name: 'init koa'
        },
        {
            id: '2',
            type: 'hi',
            options: {
                path: '/hiapi'
            },
            name: 'init hi api'
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
            toId: '6',
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
