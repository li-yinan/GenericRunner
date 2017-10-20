export const flow = {
    id: 'flow',
    name: 'get script flow',
    type: 'flow',
    nodes: [
        {
            id: 'ready',
            type: 'ready',
            name: 'ready'
        },
        {
            id: 'launchkoa',
            type: 'launchkoa',
            options: {
                port: 8858
            },
            name: 'launch koa'
        },
        {
            id: 'httpinput',
            type: 'httpinput',
            options: {
                path: '/graniteamf/amf'
            },
            name: 'http input'
        },
        {
            id: 'getbody',
            type: 'transform',
            options: {
                params: ['ctx'],
                code: 'return ctx.request;'
            },
            name: 'http input'
        },
        {
            id: 'console',
            type: 'console',
            name: 'console'
        },
        {
            id: 'timeout',
            type: 'timeout',
            name: 'timeout',
            options: {
                time: 10000
            }
        },
        {
            id: 'httpoutput',
            type: 'httpoutput',
            options: {
                template: `
                    <div>
                        template test
                    </div>
                `
            },
            name: 'http output'
        }
    ],
    links: [
        {
            type: 'link',
            fromId: 'ready',
            fromPort: 0,
            toId: 'launchkoa',
            toPort: 0
        },
        {
            type: 'link',
            fromId: 'launchkoa',
            fromPort:0, 
            toId: 'httpinput',
            toPort: 0
        },
        {
            type: 'link',
            fromId: 'httpinput',
            fromPort: 0,
            toId: 'getbody',
            toPort: 0
        },
        {
            type: 'link',
            fromId: 'getbody',
            fromPort: 0,
            toId: 'timeout',
            toPort: 0
        },
        {
            type: 'link',
            fromId: 'timeout',
            fromPort: 0,
            toId: 'httpoutput',
            toPort: 0
        },
        {
            type: 'link',
            fromId: 'getbody',
            fromPort: 0,
            toId: 'console',
            toPort: 0
        }
    ]
};
