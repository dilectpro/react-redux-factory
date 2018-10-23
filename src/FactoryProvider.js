import Provider from 'react-redux/lib/components/Provider';

class FactoryProvider extends Provider {
    static childContextTypes = {
        store: () => {},
        storeSubscription: () => {},
        factoriesActions: () => {}
    } 
    getChildContext() {
        return {
            store: this.store,
            storeSubscription: null,
            factoryActions: this.props.factoryActions
        };
    }
};

FactoryProvider.defaultProps = {
    factoryActions: {}
};

export default FactoryProvider;