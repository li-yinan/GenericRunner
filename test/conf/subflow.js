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
            type: 'transform',
            options: {
                code: `return 'http://www.baidu.com'`
            },
            name: 'url'
        },
        {
            id: '3',
            type: 'openpage',
            name: 'open baidu'
        },
        {
            id: '7',
            type: 'subflow',
            options: {
                inMap: [
                    {
                        type: 'link',
                        toId: '4',
                        toPort: 0
                    }
                ],
                outMap: [
                    {
                        type: 'link',
                        fromId: '5',
                        fromPort: 0
                    }
                ]
            },
            nodes: [
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
                        params: ['scripts'],
                        // code: 'return scripts.find(function (item) {return /hm\\.baidu\\.com\\/hm\.js/.test(item.src)});'
                        code: 'return scripts.find(function (item) {return /jquery/.test(item.src)});'
                    },
                    name: 'find b.js'
                },
            ],
            links: [
                {
                    type: 'link',
                    fromId: '4',
                    fromPort: 0,
                    toId: '5',
                    toPort: 0
                }
            ]
        },
        {
            id: '10',
            type: 'subflow',
            options: {
                inMap: [
                    {
                        type: 'link',
                        toId: '14',
                        toPort: 0
                    }
                ]
            },
            nodes: [
                {
                    id: '14',
                    type: 'console',
                    name: 'console result'
                },
            ],
            links: []
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
            fromPort:0, 
            toId: '3',
            toPort: 0
        },
        {
            type: 'link',
            fromId: '3',
            fromPort: 0,
            toId: '7',
            toPort: 0
        },
        {
            type: 'link',
            fromId: '7',
            fromPort: 0,
            toId: '10',
            toPort: 0
        }
    ]
};
