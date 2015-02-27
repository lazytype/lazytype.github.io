var TILE_WIDTH = 12;
var TILE_HEIGHT = 12;

//------------------------------------------------------------------------------
// Game Store - manages state of game
//------------------------------------------------------------------------------
var initialPlayerLocation = {row: 0, col: 0};
var gameState = {
  player: {
    location: initialPlayerLocation,
    swords: 0,
    isAt: function(location) {
      return location.row === this.location.row && location.col === this.location.col;
    },
  },
  board: {
    rows: range(TILE_WIDTH).map(function(row) { 
      return {
        cols: range(TILE_HEIGHT).map(function(col) {
          return {
            sprites: initialSprites(row, col)
          };
        })
      };
    }),
    locationExists: function(location) {
      return location.row in gameState.board.rows
        && location.col in gameState.board.rows[location.row].cols;
    },
    at: function(location) {
      return this.rows[location.row].cols[location.col];
    },
    update: function(location, newProperties) {
      this.rows[location.row].cols[location.col] = merge(this.at(location), newProperties);
    },
  },
};

function initialSprites(row, col) {
  if (row !== initialPlayerLocation.row || col !== initialPlayerLocation.col) {
    return {sword: true};
  }
}

var GameStore = {
  // Treat this return value as immutable
  // (only onAction should be able to change it)
  getState: function() {
    return gameState;
  },

  onAction: function(action) {
    switch (action.type) {
      case ActionType.MOVE:
        if (canPlayerMoveTo(gameState, action.location)) {
          // (Can only step one tile away)
          gameState.player.location = clone(action.location);
        }
        break;
      case ActionType.GRAB_SWORD:
        if (distance(gameState.player.location, action.location) <= 1
            && gameState.board.locationExists(action.location)
            && gameState.board.at(action.location).sprites.sword) {
          // (Can only grab swords one tile away)
          gameState.board.update(
            action.location,
            {
              sprites: merge(
                gameState.board.at(action.location).sprites,
                {sword: false}
              ),
            }
          );
          gameState.player.swords++;
        }
        break;
    }
    // Update the root component to rerender
    this._notifyChange();
  },

  _callbacks: [],
  addListener: function(callback) {
    this._callbacks.push(callback);
  },
  removeListener: function(callback) {
    this._callbacks = this._callbacks.filter(function(c) {
      return c !== callback;
    });
  },
  _notifyChange: function() {
    this._callbacks.forEach(function(callback) {
      callback();
    });
  }
};
Dispatcher.register(GameStore.onAction.bind(GameStore));

//------------------------------------------------------------------------------------------
// Game Helper functions
//------------------------------------------------------------------------------------------

function distance(locA, locB) {
  return Math.abs(locA.row - locB.row) + Math.abs(locA.col - locB.col);
}

function canPlayerMoveTo(game, location) {
  return game.board.locationExists(location)
    && distance(game.player.location, location) === 1;
}


//------------------------------------------------------------------------------------------
// General helper functions
//------------------------------------------------------------------------------------------

/**
 * merge({a:true, b:true}, {b:false}) = {a:true, b:false}
 * merge({a:true}) = {a:true} // new object with same properties
 */
function merge(oldObject, moreProperties) {
  var newObject = {};
  Object.getOwnPropertyNames(oldObject).forEach(function(k) {
    newObject[k] = oldObject[k];
  });
  if (moreProperties) {
    Object.getOwnPropertyNames(moreProperties).forEach(function(k) {
      newObject[k] = moreProperties[k];
    });
  }
  return newObject;
}
function clone(object) {
  return merge(object);
}

function range(n) {
  var list = [];
  for (var i = 0; i < n; i++) {
    list.push(i);
  }
  return list;
}

/**
 * Creates a enum with the keys of the given object.
 * keyMap({
 *   A: true,
 *   B: true
 * }) = {
 *   A: 'A',
 *   B: 'B'
 * }
 */
function keyMap(map) {
  var Enum = {};
  Object.getOwnPropertyNames(map).forEach(function(k) {
    Enum[k] = k;
  });
  return Enum;
}
