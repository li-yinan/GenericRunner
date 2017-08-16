import {
    Engine,
    deserialize,
    serialize,
    getNodes,
    buildFlowFromConfig
} from '../src/index';

import {flow} from './conf/getscript';
// import {flow} from './conf/switch';
// import {flow} from './conf/koa';
// import {flow} from './conf/subflow';
// import {flow} from './conf/interval';

async function main() {
    let flowInst = buildFlowFromConfig(flow);
    // flowInst = deserialize(flowStr);
    let engine = new Engine(flowInst);
    await engine.run();
    // console.log(serialize(flowInst));
    console.log('done');
}

(async function () {
    let nodeClasses = await getNodes();
    console.log(nodeClasses);
})();

// main();
