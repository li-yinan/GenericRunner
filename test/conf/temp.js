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
            type: 'subflow',
            options: {
                inMap: [
                    {
                        type: 'link',
                        toId: '5',
                        toPort: 0
                    }
                ],
                outMap: [
                ]
            },
            nodes: [
                {
                    id: '5',
                    type: 'transform',
                    options: {
                        code: `return 'hello'`
                    },
                    name: 'hello'
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
                    fromId: '5',
                    fromPort: 0,
                    toId: '6',
                    toPort: 0
                }
            ]
        }
    ],
    links: [
        {
            type: 'link',
            fromId: '0',
            fromPort: 0,
            toId: '1',
            toPort: 0
        }
    ]
};
