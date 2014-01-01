
var Sprite = React.createClass({
    render: function() {
        var data = this.props.data;

        var className = 'gameSprite ' + data.className;
        if (PLACEMENTS[this.props.sprite].indexOf(this.props.index) === -1) {
            className += ' hidden';
        }

        if (PLAYER.flipped) {
            className += ' flipped';
        }

        return (
            <span className={className}>
                <img src={data.image} className={data.imageClassName}/>
            </span>
        );
    },
});


var Tile = React.createClass({
    render: function() {
        var sprites = {};
        for (var key in SPRITES) {
            if (SPRITES.hasOwnProperty(key)) {
                sprites[key] = (
                    <Sprite
                        data={SPRITES[key]}
                        index={this.props.index}
                        sprite={key}
                    ></Sprite>
                )
            }
        }

        var className = 'gameTile';
        if (ATTACKED.indexOf(this.props.index) !== -1) {
            className += ' blue';
        }
        if (ENEMY_ATTACKED.indexOf(this.props.index) !== -1) {
            className += ' red';
        }

        return (
            <span className={className}>
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
            tiles['tile' + i] = <Tile index={this.props.rowIndex * TILE_WIDTH + i}/>;
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
            rows['row' + i] = <TileRow rowIndex={i}/>;
        }

        var style = {
            zoom: window.innerHeight / 1100
        }
        return (
            <div className="gameContainer" style={style}>
                {rows}
            </div>
        );
    },
    componentDidMount: function() {

    },
    componentWillUnmount: function() {

    }
});

var Header = React.createClass({
    render: function() {
        var enemies = TOTAL_ENEMIES - PLAYER.defeated;
        var attacks = PLAYER.sword.health;
        return (
            <div className="gameHeader">
                <span className="info">Enemies Remaining: {enemies}</span>
                <span className="info">Attacks: {attacks}</span>
            </div>
        );
    }
});


var Parent = React.createClass({
    render: function() {
        return (
            <div key={this.props.key}>
                <Header />
                <Container />
            </div>
        );
    },
    componentDidMount: function() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        beginGame(this.forceUpdate.bind(this));
        enemyLoop(this.forceUpdate.bind(this));
    },
    componentWillUnmount: function() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    },
    handleKeyDown: function(event) {
        var keyPress = (event.keyCode || event.which) + '';
        if (keyPress === '32') {
            event.preventDefault()
            initialize();
            return;
        }

        if (!PLAYER.ready || PLAYER.health === 0) {
            return;
        }

        var arrowMap = {
            UP: 38,
            LEFT: 37,
            DOWN: 40,
            RIGHT: 39
        };
        var keyMap = {
            UP: 87,
            LEFT: 65,
            DOWN: 83,
            RIGHT: 68
        };

        if (window.location.hash === '#dvorak') {
            keyMap = {
                UP: 188,
                LEFT: 65,
                DOWN: 79,
                RIGHT: 69
            };
        }

        var actionMap = {}
        actionMap[keyMap.UP] = playerMoveUp;
        actionMap[keyMap.LEFT] = playerMoveLeft;
        actionMap[keyMap.DOWN] = playerMoveDown;
        actionMap[keyMap.RIGHT] = playerMoveRight;
        actionMap[arrowMap.UP] = playerAttackUp;
        actionMap[arrowMap.LEFT] = playerAttackLeft;
        actionMap[arrowMap.DOWN] = playerAttackDown;
        actionMap[arrowMap.RIGHT] = playerAttackRight;

        if (actionMap.hasOwnProperty(keyPress)) {
            event.preventDefault();
            actionMap[keyPress]();
            this.forceUpdate();
        }
    },
    handleKeyUp: function() {
        ATTACKED = [];
        this.forceUpdate();
    }
});
