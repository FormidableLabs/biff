'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

function withErrorLogging(f) {
  return function() {
    try {
      f.apply(this, arguments);
    } catch(e) {
      con.error(e.stack);
    }
  };
};

/**
 * Store class
 */
class Store {

  /**
   * Constructs a Store object, extends it with EventEmitter and supplied
   * methods parameter,  and creates a mixin property for use in components.
   *
   * @param {object} methods - Public methods for Store instance
   * @param {function} callback - Callback method for Dispatcher dispatches
   * @constructor
   */
  constructor(methods, callback) {
    var self = this;
    this.callback = withErrorLogging(callback).bind(this);
    this._pending = false;
    this._errors = [];
    if (process.env.NODE_ENV !== 'production' && methods.callback) {
      throw new Error('Invariant Violation: "callback" is a reserved name and cannot be used as a method name.');
    }
    if (process.env.NODE_ENV !== 'production' && methods.mixin) {
      throw new Error('Invariant Violation: "mixin" is a reserved name and cannot be used as a method name.');
    }
    assign(this, EventEmitter.prototype, methods);
    this.setMaxListeners(0);
    this.mixin = {
      componentDidMount: function () {
        this.listener = (data)=> { this.isMounted() && this.storeDidChange(data); }
        this.errorListener = (data)=> { this.isMounted() && this.storeError && this.storeError(data); }
        self.addChangeListener(this.listener);
        self.addErrorListener(this.errorListener);
      },
      componentWillUnmount: function () {
        this.listener && self.removeChangeListener(this.listener);
        this.errorListener && self.removeErrorListener(this.errorListener);
      }
    }
  }

  /**
   * Returns dispatch token
   */
  getDispatchToken() {
    return this.dispatcherID;
  }

  /**
   * Returns a Store's "pending" state
   */
  getPending() {
    return this._pending;
  }

  /**
   * Sets a Store's "pending" state
   */
  _setPending(pending) {
    this._pending = pending;
  }

  /**
   * Returns a Store's "errors" array
   */
  getErrors() {
    return this._errors;
  }

  /**
   * Adds an error to a Store's "errors" array
   */
  _setError(error) {
    this._errors.push(error);
  }

  /**
   * Clears a Store's "errors" array
   */
  _clearErrors(error) {
    this._errors.splice(0, this._errors.length);
  }

  /**
   * Emits change event
   */
  emitChange() {
    this.emit('change', arguments[0]);
  }

  /**
   * Emits an error event
   */
  emitError() {
    this.emit('error', arguments[0]);
  }

  /**
   * Adds a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  addChangeListener(callback) {
    this.on('change', callback);
  }

  /**
   * Removes a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }

  /**
   * Adds an error listener
   *
   * @param {function} callback - Callback method for error event
   */
  addErrorListener(callback) {
    this.on('error', callback);
  }

  /**
   * Removes an error listener
   *
   * @param {function} callback - Callback method for error event
   */
  removeErrorListener(callback) {
    this.removeListener('error', callback);
  }

}

module.exports = Store;
