var TILE_WIDTH = 12;
var TILE_HEIGHT = 12;

var Sprite = React.createClass({
    render: function() {
        var node = this.props.tile.getDOMNode();
        var rect = node.getBoundingClientRect();
        var style = {
            left: .5 * (rect.left + rect.right - rect.height * 19 / 45.),
            top: rect.top - .4 * rect.height,
            height: rect.height
        };

        return (
            <div
                className="gameSprite "
                style={style}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
            >
                <img src="./img/sword.png" className="animated bounce"/>
            </div>
        );
    },
    componentDidMount: function() {
        window.addEventListener('resize', this._onWindowResize);
    },
    componentWillUnmount: function() {
        window.addEventListener('resize', this._onWindowResize);
    },
    _onWindowResize: function() {
        this.forceUpdate();
    },
});

var Tile = React.createClass({
    getInitialState: function() {
        return {hovered: false, spriteHovered: false};
    },
    render: function() {
        var className = 'gameTile';
        if (this.state.hovered || this.state.spriteHovered) {
            className += ' hover';
        }
        return (
            <span
                className={className}
                onMouseEnter={this.onMouseEnterHandler}
                onMouseLeave={this.onMouseLeaveHandler}
            ></span>
        );
    },
    componentDidMount: function() {
        var sprite = (
            <Sprite
                tile={this}
                onMouseEnter={this.onSpriteMouseEnterHandler}
                onMouseLeave={this.onSpriteMouseLeaveHandler}
            ></Sprite>
        );
        React.render(
            sprite,
            document.getElementById(this.props.spriteId)
        );
    },
    onMouseEnterHandler: function () {
        this.setState({
            hovered: true
        })
    },
    onMouseLeaveHandler: function () {
        this.setState({
            hovered: false
        })
    },
    onSpriteMouseEnterHandler: function () {
        this.setState({
            spriteHovered: true
        })
    },
    onSpriteMouseLeaveHandler: function () {
        this.setState({
            spriteHovered: false
        })
    },
});


var TileRow = React.createClass({
    render: function() {
        var tiles = {}
        for (var i = 0; i < TILE_WIDTH; i++) {
            tiles['tile' + i] = (
                <Tile spriteId={this.props.spriteRow['sprite' + i]} />
            );
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
        sprites = {}

        for (var i = 0; i < TILE_HEIGHT; i++) {
            var spriteRow = {}
            var spriteIdRow = {}
            for (var j = 0; j < TILE_WIDTH; j++) {
                var id = 'sprite-' + i + '-' + j;
                spriteRow['sprite' + j] = <div id={id}></div>;
                spriteIdRow['sprite' + j] = id;
            }
            sprites['row' + i] = spriteRow;
            rows['row' + i] = <TileRow spriteRow={spriteIdRow}/>;
        }

        var spriteContainer = (
            <div className="spriteContainer" ref="spriteContainer">
                {sprites}
            </div>
        )

        var gameContainer = (
            <div className="gameContainer" ref="gameContainer">
                {rows}
            </div>
        )

        return (
            <div>
                {gameContainer}
                {spriteContainer}
            </div>
        );
    }
});

React.render(
    <Container />,
    document.querySelector('#content')
);