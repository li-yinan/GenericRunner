'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var main = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var flowInst, engine;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        flowInst = (0, _index.buildFlowFromConfig)(_switch.flow);
                        // flowInst = deserialize(flowStr);

                        engine = new _index.Engine(flowInst);
                        _context.next = 4;
                        return engine.run();

                    case 4:
                        // console.log(serialize(flowInst));
                        console.log('done');

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function main() {
        return _ref.apply(this, arguments);
    };
}();

// import {flow} from './conf/getscript';


var _index = require('../src/index');

var _switch = require('./conf/switch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

main();
