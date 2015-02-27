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

        if (true || data.position === 'middle') {
            style = {
                // left: .5 * (rect.left + rect.right - rect.height * this.props.width / this.props.height),
                // top: rect.top - .4 * rect.height,
                // height: rect.height
                //top: '5px',
                zIndex: data.zIndex,

                //height: '100%',
                //width: //rect.height * data.width / data.height
            }
        } else {

        }

        var className = 'gameSprite';
        if (this.state.hidden) {
            className += ' hidden';
        }

        return (
            <div className="gameSpriteWrapper">
                <div className={className} style={style}>
                    <img src={data.image} className={data.className}/>
                </div>
            </div>
        );
    },
    componentDidMount: function() {
        window.addEventListener('resize', this.onWindowResizeHandler);
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.onWindowResizeHandler);
    },
    onWindowResizeHandler: function() {
        this.forceUpdate();
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
                {sprites}
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