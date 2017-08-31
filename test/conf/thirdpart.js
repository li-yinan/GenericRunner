export const flow = {
    id: 'flow',
    type: 'flow',
    nodes: [
        {
            id: '10',
            type: 'ready',
            name: 'ready a'
        },
        {
            id: '11',
            type: 'example',
            name: 'example'
        }
    ],
    links: [
        {
            type: 'link',
            fromId: '10',
            fromPort: 0,
            toId: '11',
            toPort: 0
        }
    ]
};
