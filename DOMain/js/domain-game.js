RUN_COUNT = 0;

initialize();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getIndex(position) {
    return position.y * TILE_WIDTH + position.x;
}

function getPosition(index) {
    return {
        x: index % TILE_WIDTH,
        y: index / TILE_WIDTH | 0
    };
}

function initialize(callback) {
    RUN_COUNT += 1
    TILE_WIDTH = 12;
    TILE_HEIGHT = 12;
    TOTAL_ENEMIES = (TILE_WIDTH * TILE_HEIGHT / 4) | 0;

    PLAYER = {
        health: 10,
        sword: {
            health: 4,
            range: 2
        },
        flipped: false,
        position: getPosition(TILE_HEIGHT * TILE_WIDTH / 2 | 0),
        ready: false,
        defeated: 0
    }

    SPRITES =  {
        sword: {
            image: './img/sword.png',
            imageClassName: 'bounce',
            className: 'middle shadow high',
            width: 19,
            height: 45,
            zIndex: 1
        },
        player: {
            image: './img/swordsman.png',
            imageClassName: '',
            className: 'left',
            width: 14,
            height: 20,
            zIndex: 2
        },
        enemy: {
            image: './img/swordsman-right.png',
            imageClassName: '',
            className: 'right',
            width: 14,
            height: 20,
            zIndex: 2
        }
    };

    OMIT = [getIndex(PLAYER.position)];

    SWORDS = []
    var i = 0;
    while (i < TILE_WIDTH * TILE_HEIGHT / 5) {
        var x = getRandomInt(0, TILE_WIDTH);
        var y = getRandomInt(0, TILE_HEIGHT);
        var index = getIndex({x: x, y: y});

        if (SWORDS.indexOf(index) === -1 && OMIT.indexOf(index) === -1) {
            SWORDS.push(index);
            OMIT.push(getIndex({x: x - 1, y: y}));
            OMIT.push(getIndex({x: x + 1, y: y}));
            OMIT.push(getIndex({x: x, y: y - 1}));
            OMIT.push(getIndex({x: x, y: y + 1}));
            i++;
        }
    }

    PLACEMENTS = {
        'sword': SWORDS,
        'player': [getIndex(PLAYER.position)],
        'enemy': []
    }

    ATTACKED = [];
    ENEMY_ATTACKED = [];
    ENEMY_QUEUE = [];

    React.render(
        <Parent key={RUN_COUNT}/>,
        document.querySelector('#content')
    );
}

function playerMoveLeft() {
    if (PLAYER.position.x === 0) {
        return;
    }
    PLAYER.position.x -= 1;

    playerUpdate();
}

function playerMoveRight() {
    if (PLAYER.position.x === TILE_WIDTH - 1) {
        return;
    }
    PLAYER.position.x += 1;

    playerUpdate();
}

function playerMoveUp() {
    if (PLAYER.position.y === 0) {
        return;
    }
    PLAYER.position.y -= 1;

    playerUpdate();
}

function playerMoveDown() {
    if (PLAYER.position.y === TILE_HEIGHT - 1) {
        return;
    }
    PLAYER.position.y += 1;

    playerUpdate();
}

function playerAttackLeft() {
    if (PLAYER.sword.health <= 0) {
        playNoSlash();
        return;
    }

    var range = PLAYER.sword.range;
    var x = PLAYER.position.x;
    var y = PLAYER.position.y;
    for (var i = 0; i <= range && x - i >= 0; i++) {
        var index = getIndex({x: x - i, y: y});
        ATTACKED.push(index);
    }

    PLAYER.sword.health--;
    playSlash();
    dealDamage();
}

function playerAttackRight() {
    if (PLAYER.sword.health <= 0) {
        playNoSlash();
        return;
    }

    var range = PLAYER.sword.range;
    var x = PLAYER.position.x;
    var y = PLAYER.position.y;
    for (var i = 0; i <= range && x + i < TILE_WIDTH; i++) {
        var index = getIndex({x: x + i, y: y});
        ATTACKED.push(index);
    }

    PLAYER.sword.health--;
    playSlash();
    dealDamage();
}

function playerAttackUp() {
    if (PLAYER.sword.health <= 0) {
        playNoSlash();
        return;
    }

    var range = PLAYER.sword.range;
    var x = PLAYER.position.x;
    var y = PLAYER.position.y;
    for (var i = 0; i <= range && y - i >= 0; i++) {
        var index = getIndex({x: x, y: y - i});
        ATTACKED.push(index);
    }

    PLAYER.sword.health--;
    playSlash();
    dealDamage();
}

function playerAttackDown() {
    if (PLAYER.sword.health <= 0) {
        playNoSlash();
        return;
    }

    var range = PLAYER.sword.range;
    var x = PLAYER.position.x;
    var y = PLAYER.position.y;
    for (var i = 0; i <= range && y + i < TILE_HEIGHT; i++) {
        var index = getIndex({x: x, y: y + i});
        ATTACKED.push(index);
    }

    PLAYER.sword.health--;
    playSlash();
    dealDamage();
}

function playerUpdate() {
    var swordIndex = getIndex(PLAYER.position);
    PLACEMENTS['player'] = [swordIndex];

    var index = SWORDS.indexOf(swordIndex);
    if (index !== -1) {
        PLAYER.sword.health = 4;
        SWORDS.splice(index, 1);
        playPickup();
    }
}

function playNoSlash() {
    var sound = './audio/error.wav';
    var audio = new Audio(sound);
    audio.play();
}

function playSlash() {
    var sound = './audio/slash1.wav';
    if (Math.random() < .25) {
        sound = './audio/slash2.wav';
    }

    var audio = new Audio(sound);
    audio.play();
}

function playPickup() {
    var sound = './audio/sheath.wav';
    var audio = new Audio(sound);
    audio.defaultPlaybackRate = 3;
    audio.load();
    audio.play();
}

function dealDamage() {
    for (var i = 0; i < ATTACKED.length; i++) {
        var index = PLACEMENTS.enemy.indexOf(ATTACKED[i]);
        if (index !== -1) {
            PLAYER.defeated++;
            PLACEMENTS.enemy.splice(index, 1);
            var otherIndex = ENEMY_QUEUE.indexOf(ATTACKED[i]);
            ENEMY_QUEUE.splice(otherIndex, 1);

            var audio = new Audio('./audio/splat.mp3');
            audio.play();
        }
    }

    if (PLAYER.defeated === TOTAL_ENEMIES) {
        PLAYER.ready = false;
        var audio = new Audio('./audio/success.wav');
        audio.play();
    }
}

function beginGame(callback) {
    var CURRENT_RUN = RUN_COUNT;
    if (PLAYER.ready) {
        return;
    }

    PLAYER.ready = true;
    for (var i = 0; i < TOTAL_ENEMIES; i++) {
        setTimeout(function() {
            if (PLAYER.health === 0) {
                return;
            }
            while (true) {
                if (CURRENT_RUN !== RUN_COUNT) {
                    return;
                }
                var x = getRandomInt(0, TILE_WIDTH);
                var y = getRandomInt(0, TILE_HEIGHT);
                var index = getIndex({x: x, y: y});

                if (PLACEMENTS.enemy.indexOf(index) !== -1 || getIndex(PLAYER.position) === index) {
                    continue;
                }

                PLACEMENTS.enemy.push(index);
                ENEMY_QUEUE.push(index);
                callback()
                return;
            }
        }, 2*900*(i+1)*(TILE_WIDTH * TILE_HEIGHT - i) / (TILE_WIDTH * TILE_HEIGHT))
    }
}

function enemyMoveLeft(position) {
    if (position.x === 0) {
        return;
    }
    position.x -= 1;;
}

function enemyMoveRight(position) {
    if (position.x === TILE_WIDTH - 1) {
        return;
    }
    position.x += 1;;
}

function enemyMoveUp(position) {
    if (position.y === 0) {
        return;
    }
    position.y -= 1;
}

function enemyMoveDown(position) {
    if (position.y === TILE_HEIGHT - 1) {
        return;
    }
    position.y += 1;
}

function enemyMoveRandom(enemy) {
    var position = getPosition(enemy);
    if (
        (position.x == PLAYER.position.x && Math.abs(position.y - PLAYER.position.y) < 2) ||
        (position.y == PLAYER.position.y && Math.abs(position.x - PLAYER.position.x) < 2)
    ) {
        playerDeath();
        ENEMY_ATTACKED.push(getIndex(PLAYER.position));
        return enemy;
    }

    var enemyAction = [
        enemyMoveUp,
        enemyMoveDown,
        enemyMoveLeft,
        enemyMoveRight
    ][getRandomInt(0, 4)];

    enemyAction(position);
    var index = getIndex(position);
    if (PLACEMENTS.enemy.indexOf(index) === -1) {
        return index;
    } else {
        return enemy;
    }
}

function enemyLoop(callback) {
    var CURRENT_RUN = RUN_COUNT;
    var intervalId = setInterval(function() {
        var newQueue = [];
        var removeEnemies = [];
        while (ENEMY_QUEUE.length > 0) {
            if (PLAYER.health === 0) {
                clearInterval(intervalId);
                return;
            }
            var enemy = ENEMY_QUEUE.shift();

            var newIndex = enemyMoveRandom(enemy);
            newQueue.push(newIndex);

            if (newIndex !== enemy) {
                removeEnemies.push(enemy);
            }
        }

        for (var i = 0; i < removeEnemies.length; i++) {
            var index = PLACEMENTS.enemy.indexOf(removeEnemies[i]);
            PLACEMENTS.enemy.splice(index, 1);
        }

        for (var i = 0; i < newQueue.length; i++) {
            if (PLACEMENTS.enemy.indexOf(newQueue[i]) === -1) {
                PLACEMENTS.enemy.push(newQueue[i]);
            }
        }
        ENEMY_QUEUE = newQueue;

        if (CURRENT_RUN !== RUN_COUNT) {
            clearInterval(intervalId);
            return;
        }
        callback();
    }, 1000);
}

function playerDeath() {
    PLAYER.health = 0;
    var sound = './audio/death1.wav';
    if (Math.random() < .5) {
        sound = './audio/death2.mp3';
    }

    var audio = new Audio(sound);
    audio.play();
}