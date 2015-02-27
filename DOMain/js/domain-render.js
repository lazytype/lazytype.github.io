var TILE_WIDTH = 12;
var TILE_HEIGHT = 12;

var Sprite = React.createClass({
    getInitialState: function() {
        return {hidden: true}
    },
    render: function() {
        var data = this.props.data;
        // var parent = this.getDOMNode().parentNode;
        // var rect = parentNode.getBoundingClientRect();
        var style;

        var className = 'gameSprite';
        if (this.state.hidden) {
            className += ' hidden';
        }
        if (data.position === 'middle') {
            className += ' middle';
            className += ' shadow';
        }

        return (
            <span className={className} style={style}>
                <img src={data.image} className={data.className}/>
            </span>
        );
    },
});


var Tile = React.createClass({
    render: function() {
        var sprites = {};
        for (var key in SPRITES) {
            if (SPRITES.hasOwnProperty(key)) {
                sprites[key] = <Sprite data={SPRITES[key]} />
            }
        }

        return (
            <span className="gameTile">
                <div className="gameSprites">
                    {sprites}
                </div>
            </span>
        );
    },
});


var TileRow = React.createClass({
    render: function() {
        var tiles = {}
        for (var i = 0; i < TILE_WIDTH; i++) {
            tiles['tile' + i] = <Tile />;
        }
        return (
            <div className="gameTileRow">
                {tiles}
            </div>
        )
    }
});


var Container = React.createClass({
    render: function() {
        rows = {}

        for (var i = 0; i < TILE_HEIGHT; i++) {
            rows['row' + i] = <TileRow />;
        }

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
