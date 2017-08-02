import {Engine, deserialize, serialize, buildFlowFromConfig} from '../src/index';

// import {flow} from './conf/getscript';
// import {flow} from './conf/switch';
import {flow} from './conf/koa';

async function main() {
    let flowInst = buildFlowFromConfig(flow);
    // flowInst = deserialize(flowStr);
    let engine = new Engine(flowInst);
    await engine.run();
    // console.log(serialize(flowInst));
    console.log('done');
}

main();
