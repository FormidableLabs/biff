"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");
var shallowEqual = require("fbjs/lib/shallowEqual");

module.exports = function FluxComponent(Component, stores, storeDidChange) {
  var FluxComponent = React.createClass({
    displayName: "FluxComponent",

    getState: function getState(props) {
      return storeDidChange(props);
    },

    getInitialState: function getInitialState() {
      return storeDidChange(this.props);
    },

    componentDidMount: function componentDidMount() {
      var _this = this;

      stores.forEach(function (store) {
        return store.addChangeListener(_this.handleStoreChange);
      });

      this.setState(this.getState(this.props));
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      if (!shallowEqual(nextProps, this.props)) {
        this.setState(this.getState(nextProps));
      }
    },

    componentWillUnmount: function componentWillUnmount() {
      var _this = this;

      stores.forEach(function (store) {
        return store.removeChangeListener(_this.handleStoreChange);
      });
    },

    handleStoreChange: function handleStoreChange() {
      if (this.isMounted()) {
        this.setState(this.getState(this.props));
      }
    },
    render: function render() {
      return React.createElement(Component, _extends({}, this.props, this.state));
    }
  });
  return FluxComponent;
};