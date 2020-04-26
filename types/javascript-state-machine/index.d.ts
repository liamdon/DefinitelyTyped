// Type definitions for Finite State Machine 3.0
// Project: https://github.com/jakesgordon/javascript-state-machine
// Definitions by: Boris Yankov <https://github.com/borisyankov>,
// 					Maarten Docter <https://github.com/mdocter>,
// 					William Sears <https://github.com/MrBigDog2U>,
// 					samael <https://github.com/samael65535>,
// 					taoqf <https://github.com/taoqf>,
// 					Liam Don <https://github.com/liamdon>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export interface StateMachineTransitionsConfigItem {
    name: string;
    from: string | string[];
    to: string;
}

export type StateMachineTransitionsConfig = StateMachineTransitionsConfigItem[];

// This is passed to lifecycle transition events
// added in initial config or via fsm.observe(...)
export interface StateTransition {
    transition: string;
    from: string;
    to: string;
}

export type StateTransitionMethod = (...args: any[]) => any;

// tslint:disable-next-line void-return
export type StateTransitionCallback = (lifecycle: StateTransition, ...args: any[]) => void | boolean | Promise<boolean | void>;

export interface StateMethodsConfig {
    [s: string]: StateTransitionCallback;
}

export interface StateMachineConfig {
    init?: string;
    transitions?: StateMachineTransitionsConfig;
    methods?: StateMethodsConfig;
}

export interface StateMachineFactoryTarget {
    _fsm(): void;
}

export type StateMachineIs = (state: string) => boolean;
export type StateMachineCan = (transition: string) => boolean;
export type StateMachineCannot = (transition: string) => boolean;
export type StateMachineTransitions = () => string[];
export type StateMachineStates = () => string[];

export type ObserveMethod = (transitionName: string, callback: StateTransitionCallback) => void;
export type MultipleObserveMethod = (transitionName: string, callback: StateTransitionCallback) => void;

export interface StateMachine {
    state: string;
    data: Record<string, any>;
    is: StateMachineIs;
    can: StateMachineCan;
    cannot: StateMachineCannot;
    transitions: StateMachineTransitions;
    allTransitions: StateMachineTransitions;
    allStates: StateMachineStates;
    observe: ObserveMethod | MultipleObserveMethod;
}

// tslint:disable-next-line no-unnecessary-class
export class StateMachine {
    constructor(config: StateMachineConfig);
}

// tslint:disable:no-unnecessary-generics
export namespace StateMachine {
	function StateMachine<CustomMethodsInterface = any>(config: StateMachineConfig): StateMachine & CustomMethodsInterface;
    function factory<CustomMethodsInterface = any>(config: StateMachineConfig): StateMachine & CustomMethodsInterface;
	function factory<T, CustomMethodsInterface = any>(
        target: new (config: StateMachineConfig) => T,
        config: StateMachineConfig,
	): StateMachine & T & CustomMethodsInterface;
    function apply<T, CustomMethodsInterface = any>(
        target: T,
        config: StateMachineConfig,
    ): StateMachine & T & CustomMethodsInterface;
}
export as namespace StateMachine;
