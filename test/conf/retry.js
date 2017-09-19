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
            type: 'retrystart',
            options: {
                namespace: 'retry',
                times: 3
            },
            name: 'retry'
        },
        {
            id: '2',
            type: 'retryend',
            options: {
                namespace: 'retry'
            },
            name: 'retry'
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
            fromPort: 0,
            toId: '3',
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
