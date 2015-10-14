'use strict';

var React = require('react');
var shallowEqual = require('fbjs/lib/shallowEqual');

module.exports = function FluxComponent(Component, stores, storeDidChange) {
  const FluxReactComponent = React.createClass({
    getState(props) {
      return storeDidChange(props);
    },

    getInitialState() {
      return storeDidChange(this.props);
    },

    componentDidMount() {
      stores.forEach(store =>
        store.addChangeListener(this.handleStoreChange)
      );

      this.setState(this.getState(this.props));
    },

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(nextProps, this.props)) {
        this.setState(this.getState(nextProps));
      }
    },

    componentWillUnmount() {
      stores.forEach(store =>
        store.removeChangeListener(this.handleStoreChange)
      );
    },

    handleStoreChange() {
      if (this.isMounted()) {
        this.setState(this.getState(this.props));
      }
    },
    render() {
      return <Component {...this.props} {...this.state} />;
    }
  });
  
  return FluxReactComponent;
};
