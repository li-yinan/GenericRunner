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
            type: 'timeout',
            options: {
                time: 1000
            },
            name: 'timeout'
        },
        {
            id: '2',
            type: 'signalsender',
            options: {
                name: 'test' 
            },
            name: 'signalsender'
        },
        {
            id: '3',
            type: 'signalreciever',
            options: {
                name: 'test' 
            },
            name: 'signalreciever'
        },
        {
            id: '4',
            type: 'timeout',
            options: {
                time: 1000
            },
            name: 'timeout'
        },
        {
            id: '5',
            type: 'signalsender',
            options: {
                name: 'test' 
            },
            name: 'signalsender'
        },
        {
            id: '6',
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
            fromId: '0',
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
        }
    ]
};
