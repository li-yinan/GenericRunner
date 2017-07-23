export class Engine {
    flow = null;
    constructor(flow) {
        this.flow = flow;
    }

    run() {
        return this.flow.exec();
    }
}
