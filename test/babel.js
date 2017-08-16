import {
    Engine,
    deserialize,
    serialize,
    getNodes,
    postfix,
    buildFlowFromConfig
} from '../src/index';

import {flow} from './conf/getscript';
// import {flow} from './conf/switch';
// import {flow} from './conf/koa';
// import {flow} from './conf/subflow';
// import {flow} from './conf/interval';

async function main() {
    let flowInst = buildFlowFromConfig(flow);
    // console.log(flowInst);
    // flowInst = deserialize(flowStr);
    let engine = new Engine(flowInst);
    await engine.run();
    // console.log(serialize(flowInst));
    console.log('done');
}

// (async function () {
//     let nodeClasses = await getNodes();
//     console.log(nodeClasses);
// })();

// main();


console.log(postfix( {
    id: '14',
    type: 'merge',
    options: {
        keys: ['port1', 'port2']
    },
    name: 'merge a & b'
}));
