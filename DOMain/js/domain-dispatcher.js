//------------------------------------------------------------------------------
// Dispatcher - Used to send actions to the GameStore to update the state accordingly
//------------------------------------------------------------------------------
var Dispatcher = {
  _isDispatching: false,
  _callbacks: [],

  register: function(callback) {
    this._callbacks.push(callback);
  },

  dispatch: function(action) {
    if (this._isDispatching) {
      // Prevent nested dispatches.
      // One action should not trigger other actions.
      throw new Error('Can\'t nest dispatches');
    }
    this._isDispatching = true;
    this._callbacks.forEach(function(callback) {
      callback(action);
    });
    this._isDispatching = false;
  },
};

