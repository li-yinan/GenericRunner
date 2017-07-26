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
            type: 'transform',
            options: {
                params: [],
                code: 'return \'a\';'
            },
            name: 'return a'
        },
        {
            id: '12',
            type: 'ready',
            name: 'ready b'
        },
        {
            id: '13',
            type: 'transform',
            options: {
                params: [],
                code: 'return \'b\';'
            },
            name: 'return b'
        },
        {
            id: '14',
            type: 'merge',
            options: {
                keys: ['port1', 'port2']
            },
            name: 'merge a & b'
        },
        {
            id: '15',
            type: 'switch',
            options: {
                // 可以通过params字段指定传入数据的参数名
                params: ['param'],
                conditions: [
                    // 这里的条件会从上到下执行，执行到一个结果为true就停止
                    // 这个条件的index就是switch的输出端口号
                    'param.port1 === "c"',
                    'param.port2 === "c"',
                    // 如果想要有一个兜底，就直接写true，写1也行，一个非空字符串也行，看你心情
                    'true'
                ]
            },
            name: 'switch a & b'
        },
        {
            id: '16',
            type: 'console',
            name: 'switch a'
        },
        {
            id: '17',
            type: 'console',
            name: 'switch b'
        },
        {
            id: '18',
            type: 'console',
            name: 'switch default'
        }
    ],
    links: [
        {
            type: 'link',
            fromId: '10',
            fromPort: 0,
            toId: '11',
            toPort: 0
        },
        {
            type: 'link',
            fromId: '12',
            fromPort: 0,
            toId: '13',
            toPort: 0
        },
        {
            type: 'link',
            fromId: '11',
            fromPort: 0,
            toId: '14',
            toPort: 0
        },
        {
            type: 'link',
            fromId: '13',
            fromPort: 0,
            toId: '14',
            toPort: 1
        },
        {
            type: 'link',
            fromId: '14',
            fromPort: 0,
            toId: '15',
            toPort: 0
        },
        {
            type: 'link',
            fromId: '15',
            fromPort: 0,
            toId: '16',
            toPort: 0
        },
        {
            type: 'link',
            fromId: '15',
            fromPort: 1,
            toId: '17',
            toPort: 0
        },
        {
            type: 'link',
            fromId: '15',
            fromPort: 2,
            toId: '18',
            toPort: 0
        }
    ]
};
