import { bindActionCreators } from 'redux';

export default function wrapMapDispatchToProps(mapDispatchToProps, actions) {
    const dispatchActions = mapDispatchToProps(actions);
    if (typeof dispatchActions === 'object') {
        return function(dispatch) {
            return Object.keys(actions).reduce(function(dispatchedActions, action) {
                console.log(dispatchActions, actions, action)
                return Object.assign({}, dispatchedActions, { ...bindActionCreators(actions[action], dispatch) });
            }, {});
        };
    };
    return null;
};