import React from 'react';
import { createStore } from 'redux';
import FactoryProvider from './FactoryProvider';
import wrapConnectWithContext from './wrapConnectWithContext';

function composeEnhancers(middleware) {
    const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    return composer(middleware);
}; 

function createFactoryStore(reducers, middleware = []) {
    return createStore(
        combineReducers(reducers),
        composeEnhancers(
            applyMiddleware(...middleware)
        )
    );
};

function iterateFactories(factories, iterate) {
    return Object.keys(factories).reduce(function(prev, curr) {
        if (typeof factories[curr] !== 'object') {
            throw new Error(`the passed factory \`${curr}\` is invalid type`);
        };            
        return iterate(prev, curr, factories[curr]);
    }, {});
};

function compactActionProps(initialState, action) {
    return Object.keys(initialState).reduce((prev, curr) => {
        if (action[curr]) {
            return Object.assign({}, prev, { [curr]: action[curr] });
        };
        return prev;
    }, {});
};

function createFactoryActions(actions, factory, factoryName, actionKey) {
    if (typeof factory[actionKey] === 'function') {
        return Object.assign({}, actions, {
            [factoryName]: Object.assign({}, actions[actionKey], {
                [actionKey]: factory[actionKey]
            })
        });
    };
    return actions;
};

function createFactoryReducer(factory) {
    return (state = factory.initialState, action) => {
        if (factory[action.type]) {
            return Object.assign({}, state, compactActionProps(factory.initialState, action));
        };
        return state;
    };
};

export function createFactory(factories) {

    // let factoryActions = {}, factoryReducers = {};

    if (typeof factories !== 'object') {
        throw new Error(`the passed factories is invalid type`);
    };

    const factoryActions = iterateFactories(factories, function(prev, factoryName, factory) {
        return Object.keys(factory).reduce(function(actions, actionKey) {
            return createFactoryActions(actions, factory, factoryName, actionKey);
        }, prev);
    });

    const factoryReducers = iterateFactories(factories, function(prev, curr, factory) {
        return Object.assign({}, prev, { 
            [curr]: createFactoryReducer(factory) 
        });
    });

    const factoryStore = createFactoryStore(factoryReducers);

    return function(Component) {
        return <FactoryProvider store={factoryStore} factoryActions={factoryActions}>
            <Component />
        </FactoryProvider>
    };

};

export function factoryConnect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options
) {
    return function(Component) {
        return wrapConnectWithContext(
            mapStateToProps,
            mapDispatchToProps,
            mergeProps,
            options,
            FactoryProvider.childContextTypes,
            Component
        );
    };
};