import React from 'react';
import connect from 'react-redux/lib/connect/connect';
import wrapMapStateToProps from './lib/wrapMapStateToProps';
import wrapMapDispatchToProps from './wrapMapDispatchToProps';

export default function wrapConnectWithContext(
    mapStateToProps, 
    mapDispatchToProps, 
    mergeProps, 
    options, 
    contextTypes, 
    Component
) {
    return class ConnectedComponent extends React.Component {       
        static contextTypes = contextTypes
        constructor(props, context) {
            super(props, context);
            this.component = connect(
                wrapMapStateToProps(mapStateToProps), 
                wrapMapDispatchToProps(mapDispatchToProps, this.context.factoryActions),
                mergeProps, 
                options
            )(Component);
            this.shouldComponentUpdate = this.component.shouldComponentUpdate;
        }
        render() {
            return React.cloneElement(this.component, this.props);
        }
    };
};