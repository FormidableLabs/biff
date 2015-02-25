'use strict';

var Dispatcher = require('./Dispatcher');
var Store = require('./Store');
var ActionsFactory = require('./ActionsFactory');
var assign = require('object-assign');

/**
 * Main Biff Class
 */


  /**
   * Instatiates Biff along with actions object, stores array and sets
   * dispatcher to Dispatcher.
   *
   * @constructor
   */
  function Biff(){
    this.actions = {};
    this.stores = [];
    this.dispatcher = Dispatcher;
  }

  /**
   * Creates an instance of a Store, registers the supplied callback with the
   * dispatcher, and pushes it into the global list of stores
   *
   * @param {object} methods - Public methods for Store instance
   * @param {function} callback - Callback method for Dispatcher dispatches
   * @return {object} - Returns instance of Store
   */
  Biff.prototype.createStore=function(methods,callback){
    var store = new Store(methods,callback);
    store.dispatcherID = this.dispatcher.register(store.callback);
    this.stores.push(store);
    return store;
  };

  /**
   * Creates an instance of an ActionsFactory and adds the supplied actions
   * to the global list of actions
   *
   * @param {object} actions - Action methods
   * @return {object} - Returns instance of ActionsFactory
   */
  Biff.prototype.createActions=function(actions) {
    var actionFactory = new ActionsFactory(actions);
    assign(this.actions,actionFactory);
    return actionFactory;
  };



module.exports = Biff;
