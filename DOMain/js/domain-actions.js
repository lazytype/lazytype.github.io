//------------------------------------------------------------------------------
// Actions - Used by views (React Components) to perform conceptual actions on the state
//------------------------------------------------------------------------------
var ActionType = keyMap({
  GRAB_SWORD: true,
  MOVE: true,
});

var Action = {
  grabSword: function(location /*{row:0, col:0}*/) {
    Dispatcher.dispatch({
      type: ActionType.GRAB_SWORD,
      location: location
    });
  },

  move: function(location) {
    Dispatcher.dispatch({
      type: ActionType.MOVE,
      location: location
    });
  },
};

