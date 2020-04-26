import * as assert from 'assert';
import { StateMachine, StateTransitionMethod, StateMachineConfig, StateTransition } from 'javascript-state-machine';

interface MyStateMachineMethods {
    warn: StateTransitionMethod;
    panic: StateTransitionMethod;
    calm: StateTransitionMethod;
    clear: StateTransitionMethod;
}

// we will assert this variable - basically
// a super basic way to spy
let spyLastMethodCalled = '';
const config: StateMachineConfig = {
    init: 'green',
    transitions: [
        { name: 'warn', from: 'green', to: 'yellow' },
        { name: 'panic', from: 'yellow', to: 'red' },
        { name: 'calm', from: 'red', to: 'yellow' },
        { name: 'clear', from: 'yellow', to: 'green' },
    ],
    methods: {
        onWarn(lifecycle: StateTransition, testArgument: string) {
            spyLastMethodCalled = `onWarn:${testArgument}`;
        },
        onPanic(lifecycle: StateTransition, testArgument: string) {
            spyLastMethodCalled = `onPanic:${testArgument}`;
        },
        onCalm(lifecycle: StateTransition, testArgument: string) {
            spyLastMethodCalled = `onCalm:${testArgument}`;
        },
        onClear(lifecycle: StateTransition, testArgument: string) {
            spyLastMethodCalled = `onClear:${testArgument}`;
        },
    },
};

const fsm = new StateMachine(config) as MyStateMachineMethods & StateMachine;
assert(fsm.state.includes('green'));
fsm.warn();
assert(fsm.state.includes('yellow'));
assert(spyLastMethodCalled.includes('onWarn'));

// Use factory without custom typing
const fsmFactoryUntyped = StateMachine.factory(config);
fsmFactoryUntyped.panic('oops');
assert(fsm.state.includes('red'));
assert(spyLastMethodCalled.includes('onPanic:oops'));
assert(fsmFactoryUntyped.notAMethod === undefined);

// Use factory with custom typing
const fsmFactoryTyped = StateMachine.factory<MyStateMachineMethods>(config);
assert(fsmFactoryTyped.state === 'green');
fsmFactoryTyped.calm('yay');
assert(fsm.state.includes('yellow'));
assert(spyLastMethodCalled.includes('onCalm:yay'));

interface MyObjectInterface {
    props: boolean;
}

const myObject: MyObjectInterface = {
    props: true,
};
const objectWithFsmUntyped = StateMachine.apply(myObject, config);
assert(objectWithFsmUntyped.state === 'green');
assert(objectWithFsmUntyped.props === true);
objectWithFsmUntyped.calm();
assert(spyLastMethodCalled.includes('onCalm'));
assert(fsm.state.includes('green'));

interface MyClass {
    _fsm(): void;
}
class MyClass {
    props: boolean;
    constructor() {
        this.props = true;
        this._fsm();
    }
}

const classInstanceWithFsmUntyped = StateMachine.factory(MyClass, config);
assert(classInstanceWithFsmUntyped.state === 'green');
assert(classInstanceWithFsmUntyped.props);
classInstanceWithFsmUntyped.panic();
assert(spyLastMethodCalled.includes('panic'));
assert(fsm.state.includes('red'));

const classInstanceWithFsmTyped = StateMachine.factory<MyClass, MyStateMachineMethods>(MyClass, config);
assert(classInstanceWithFsmTyped.state === 'green');
assert(classInstanceWithFsmTyped.props);
classInstanceWithFsmTyped.warn('be careful!');
assert(spyLastMethodCalled.includes('warn:be careful!'));
assert(fsm.state.includes('yellow'));

const transitions = fsm.transitions();
assert(transitions.length === 2);
