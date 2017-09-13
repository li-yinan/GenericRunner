import {
    Engine,
    deserialize,
    serialize,
    getNodes,
    postfix,
    buildFlowFromConfig
} from '../src/index';

// import {flow} from './conf/getscript';
// import {flow} from './conf/switch';
// import {flow} from './conf/koa';
import {flow} from './conf/subflow';
// import {flow} from './conf/interval';
// import {flow} from './conf/thirdpart';
// import {flow} from './conf/visible';
// import {flow} from './conf/exists';
// import {flow} from './conf/temp';
// import {flow} from './conf/timeout';
import {flow} from './conf/log';

async function main() {
    let flowInst = buildFlowFromConfig(flow);
    // console.log(JSON.stringify(flowInst, null, 4));
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

// import * as example from 'generic-runner-plugin-example';
// console.log('>>>><<<<<');
// console.log(example);
main();


// console.log(postfix( {
//     id: '14',
//     type: 'merge',
//     options: {
//         keys: ['port1', 'port2']
//     },
//     name: 'merge a & b'
// }));
