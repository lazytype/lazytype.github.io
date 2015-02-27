var Sprite = React.createClass({
    render: function() {
        var data = this.props.data;
        var className = 'gameSprite ' + data.className;
        return (
            <span className={className}>
                <img src={data.image} className={data.imageClassName}/>
            </span>
        );
    },
});


var Tile = React.createClass({
    render: function() {
        var spriteSet = this.props.game.board.at(this.props.location).sprites;
        var sprites = [];
        for (var key in spriteSet) {
          if (spriteSet[key] && spriteSet.hasOwnProperty(key)) {
            sprites.push(
              <Sprite
                key={key}
                data={SPRITES[key]}
                game={this.props.game}
              />
            );
          }
        }
        if (this.props.game.player.isAt(this.props.location)) {
          sprites.push(
            <Sprite
              key="swordsman"
              data={SPRITES.swordsman}
              game={this.props.game}
            />
          );
        }

        var className = 'gameTile';
        if (canPlayerMoveTo(this.props.game, this.props.location)) {
          className += ' canMoveTo';
        }

        return (
            <span className={className} onClick={this._onClick}>
                <div className="gameSprites">
                    {sprites}
                </div>
            </span>
        );
    },

    _onClick: function() {
      Action.move(this.props.location);
    },
});


var TileRow = React.createClass({
    render: function() {
        var tiles = this.props.game.board.rows[this.props.row].cols.map(
          (function(_, i) {
            return (
              <Tile
                key={'tile' + i}
                location={{row: this.props.row, col: i}}
                game={this.props.game}
              />
            );
          }).bind(this)
        );
        return (
            <div className="gameTileRow">
                {tiles}
            </div>
        )
    }
});


var Container = React.createClass({
    getInitialState: function() {
      return {
        game: GameStore.getState(),
      };
    },

    componentDidMount: function() {
      GameStore.addListener(this._onGameStateChange);
    },

    componentWillUnmount: function() {
      GameStore.removeListener(this._onGameStateChange);
    },

    _onGameStateChange: function() {
      this.setState({
        game: GameStore.getState(),
      });
    },

    render: function() {
        var rows = this.state.game.board.rows.map(
          (function(_, i) {
            return (
              <TileRow
                key={'row' + i}
                row={i}
                game={this.state.game}
              />
            );
          }).bind(this)
        );

        return (
            <div className="gameContainer">
                {rows}
            </div>
        );
    }
});

React.render(
    <Container />,
    document.querySelector('#content')
);
