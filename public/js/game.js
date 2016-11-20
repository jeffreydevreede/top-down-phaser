(function (exports) {
'use strict';

var State = function State(game)
{
    this.game = game;
};

var BootState = (function (State$$1) {
    function BootState () {
        State$$1.apply(this, arguments);
    }

    if ( State$$1 ) BootState.__proto__ = State$$1;
    BootState.prototype = Object.create( State$$1 && State$$1.prototype );
    BootState.prototype.constructor = BootState;

    BootState.prototype.create = function create ()
    {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.game.state.start('load');
    };

    return BootState;
}(State));

var LoadState = (function (State$$1) {
    function LoadState () {
        State$$1.apply(this, arguments);
    }

    if ( State$$1 ) LoadState.__proto__ = State$$1;
    LoadState.prototype = Object.create( State$$1 && State$$1.prototype );
    LoadState.prototype.constructor = LoadState;

    LoadState.prototype.preload = function preload ()
    {
        var style = {
            fill: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        };

        this.game.stage.backgroundColor = '#27ae60';

        this.loading = this.game.add.text(this.game.world.width, 344, 'Loading...', style);
        this.loading.style.font = '36px Arial';
        this.loading.anchor.set(0.5);

        this.percentage = this.game.add.text(this.game.world.width, 404, '0%', style);
        this.percentage.style.font = '26px Arial';
        this.percentage.anchor.set(0.5);
    };

    LoadState.prototype.create = function create ()
    {
        this.game.load.onLoadComplete.add(this.complete, this);
        this.game.load.onFileComplete.add(this.updatePercentage, this);

        this.game.load.image('menuBackground', '/assets/img/menu/background.png');
        this.game.load.image('player', '/assets/img/play/player.png');
        this.game.load.spritesheet('tiles', '/assets/img/play/tiles.png', 64, 64);

        this.game.load.start();
    };

    LoadState.prototype.updatePercentage = function updatePercentage (progress)
    {
        this.percentage.setText(progress + "%");
    };

    LoadState.prototype.complete = function complete ()
    {
        this.load.onLoadComplete.removeAll();
        this.load.onFileComplete.removeAll();
        this.game.state.start('menu');
    };

    return LoadState;
}(State));

var MenuState = (function (State$$1) {
    function MenuState () {
        State$$1.apply(this, arguments);
    }

    if ( State$$1 ) MenuState.__proto__ = State$$1;
    MenuState.prototype = Object.create( State$$1 && State$$1.prototype );
    MenuState.prototype.constructor = MenuState;

    MenuState.prototype.preload = function preload ()
    {
        console.log('menu preload');

        this.game.stage.backgroundColor = '#27ae60';

        var background = this.game.add.image(this.game.world.width * 0.5, this.game.world.height * 0.5, 'menuBackground');
        background.anchor.set(0.5);

        var text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.75, "Click to start", {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        });
        text.anchor.set(0.5);
    };

    MenuState.prototype.create = function create ()
    {
        console.log('menu create');

        this.game.input.onDown.addOnce(this.play, this);
    };

    MenuState.prototype.play = function play ()
    {
        console.log('menu play');

        this.game.state.start('play');
    };

    return MenuState;
}(State));

var Player = function Player(game, play)
{
    this.game = game;
    this.play = play;

    // find worldX, worldY, mapX, mapY, username
    this.worldX = 0;
    this.worldY = 0;
    this.mapX = 15;
    this.mapY = 11;
    this.username = 'Whinger';
    this.speed = 400;
};

Player.prototype.create = function create ()
{
    // render
    var left = window.config.mapWidth * this.worldX + this.mapX * window.config.tileWidth + window.config.tileWidth / 2;
    var top = window.config.mapHeight * this.worldY + this.mapY * window.config.tileHeight + window.config.tileHeight / 2;

    this.sprite = this.game.add.sprite(left, top, 'player');

    this.sprite.anchor.setTo(.5, .5);
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.game.camera.follow(this.sprite);

    this.wasd = {
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
};

Player.prototype.update = function update ()
{
    this.updateMovement();

    // calculate sprite pointing direction, based on mouse location, camera location, and player location.
    this.updateRotation();

    // update players relative point on the map, this could be used to persist location to server.
    this.updateMapLocation();
    this.updateWorldLocation();
};

Player.prototype.updateMovement = function updateMovement ()
{
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.angularVelocity = 0;

    if (this.wasd.left.isDown) {
        this.sprite.body.velocity.x = -1 * this.speed;
    }
    else if (this.wasd.right.isDown) {
        this.sprite.body.velocity.x = this.speed;
    }

    if (this.wasd.up.isDown) {
       this.sprite.body.velocity.y = -1 * this.speed;
    }
    else if (this.wasd.down.isDown) {
       this.sprite.body.velocity.y = this.speed;
    }
};

Player.prototype.updateRotation = function updateRotation ()
{
    var rotation = Math.atan2(this.game.input.activePointer.y - this.sprite.y + this.game.camera.y, this.game.input.activePointer.x - this.sprite.x + this.game.camera.x);
    this.sprite.rotation = rotation;
};

Player.prototype.updateMapLocation = function updateMapLocation ()
{
    var x = this.sprite.x;
    var y = this.sprite.y;

    if(x > 0) {
        this.mapX = Math.floor((x % window.config.mapWidth) / window.config.tileWidth);
    } else {
        this.mapX = window.config.mapTilesWidth - Math.ceil((Math.abs(x) % window.config.mapWidth) / window.config.tileWidth);
    }

    if(y > 0) {
        this.mapY = Math.floor((y % window.config.mapHeight) / window.config.tileHeight);
    } else {
        this.mapY = window.config.mapTilesHeight - Math.ceil((Math.abs(y) % window.config.mapHeight) / window.config.tileHeight);
    }
};

Player.prototype.updateWorldLocation = function updateWorldLocation ()
{
    this.worldX = Math.floor(this.sprite.x / window.config.mapWidth);
    this.worldY = Math.floor(this.sprite.y / window.config.mapHeight);
};

var Map = function Map(worldX, worldY, world, json)
{
    this.worldX = worldX;
    this.worldY = worldY;
    this.world = world;
    this.json = json;

    // update the maps position in pixels.
    this.top = this.worldY * window.config.mapHeight;
    this.right = this.worldX * window.config.mapWidth + window.config.mapWidth;
    this.bottom = this.worldY * window.config.mapHeight + window.config.mapHeight;
    this.left = this.worldX * window.config.mapWidth;
};

/**
 * Renders the map based on the json tilemap.
 * @param Phaser.Game phaser game object.
 */
Map.prototype.render = function render (game)
{
    if(!this.json) {
        // map doesn't exist
        return;
    }

    var map = this;

    map.tiles = game.add.group();

    var mapLeft = this.left;
    var mapTop = this.top;

    var collisionMap = this.json.collision;
    this.json.sprite.forEach(function (row, y) {
        row.forEach(function (frame, x) {
            // calculate left and top position in pixels for this tile.
            var left = mapLeft + (x * window.config.tileWidth);
            var top = mapTop + (y * window.config.tileHeight);

            // create the map background tiles based on the tiled sprite.
            var sprite = game.add.sprite(left, top, 'tiles', frame);
                
            // add sprite tiles group
            map.tiles.add(sprite);

            // in case the sprite should collide, we add it to the worlds collidables
            if(collisionMap[y][x]) {
                game.physics.enable(sprite, Phaser.Physics.ARCADE);
                sprite.body.immovable = true;
                map.world.addCollidable(sprite);
            }
        });
    });

    game.world.sendToBack(map.tiles);
};

Map.prototype.remove = function remove () {
    this.tiles.destroy(true);
};

var World = function World(game, play)
{
    this.game = game;
    this.play = play;

    this.maps = {};
    this.loadedMaps = {};

    this.top = null;
    this.right = null;
    this.bottom = null;
    this.left = null;

    this.collidables = this.game.add.physicsGroup();

    // load the initial map the player spawns on.
    this.loadMap(this.play.player.worldX, this.play.player.worldY);
};

World.prototype.create = function create ()
{
    this.setMapLoadingBoundries();

    this.debugText = this.game.add.text(20, 20, "", {
        font: '20px Arial',
        fill: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4
    });
    /*
    this.debugText.fixedToCamera = true;
    this.debugText.cameraOffset.setTo(100, 100);
    */
};

World.prototype.update = function update ()
{
    var maps = this.shouldLoadMap();

    // this.debugText.setText(this.play.player.mapY + ' ' + this.play.player.mapX);

    // is the player close enough to the next map that we should load it?
    if(maps.length > 0) {
        var world = this;

        // we take the players current position
        var playerX = this.play.player.worldX;
        var playerY = this.play.player.worldY;

        // loop the possible sides
        maps.forEach(function (side) {
            // setup initial position
            var x = playerX;
            var y = playerY;
            switch(side) {
                case 'top':
                    y = playerY - 1;
                    break;
                case 'right':
                    x = playerX + 1;
                    break;
                case 'bottom':
                    y = playerY + 1;
                    break;
                case 'left':
                    x = playerX - 1;
                    break;
            }
            // do the actual loading
            world.loadMap(x, y);
        });

        // are we in a corner? if so we should load the map attached to the corner
        if(maps.length == 2) {
            // setup initial position
            var x = playerX;
            var y = playerY;
            maps.forEach(function (side) {
                switch(side) {
                    case 'top':
                        y = playerY - 1;
                        break;
                    case 'right':
                        x = playerX + 1;
                        break;
                    case 'bottom':
                        y = playerY + 1;
                        break;
                    case 'left':
                        x = playerX - 1;
                        break;
                }
            });
            // load the corner map
            world.loadMap(x, y);
        }
    }

    this.game.physics.arcade.collide(this.play.player.sprite, this.collidables);
};

World.prototype.setMapLoadingBoundries = function setMapLoadingBoundries ()
{
    this.topLoadingBoundry = Math.floor(window.config.mapTilesHeight * 0.4);
    this.rightLoadingBoundry = Math.ceil(window.config.mapTilesWidth * 0.6);
    this.bottomLoadingBoundry = Math.floor(window.config.mapTilesHeight * 0.6);
    this.leftLoadingBoundry = Math.ceil(window.config.mapTilesWidth * 0.4);
};

World.prototype.shouldLoadMap = function shouldLoadMap ()
{
    var result = [];
    // top
    if(this.play.player.mapY < this.topLoadingBoundry) {
        result.push('top');
    }
    // right
    if(this.play.player.mapX > this.rightLoadingBoundry) {
        result.push('right');
    }
    // bottom
    if(this.play.player.mapY > this.bottomLoadingBoundry) {
        result.push('bottom');
    }

    // left
    if(this.play.player.mapX < this.leftLoadingBoundry) {
        result.push('left');
    }

    return result;
};

World.prototype.loadMap = function loadMap (x, y)
{
    if(this.loadedMaps[x+'x'+y]) {
        return;
    }
    this.loadedMaps[x+'x'+y] = true;
    console.log('load map '+x+'x'+y);

    // load the maps json data @TODO Load through ajax call
    this.game.load.json('map'+x+'x'+y, '/maps/'+x+'.'+y+'.json');
    this.game.load.onLoadComplete.addOnce(function () {
        // get the json data.
        var json = this.game.cache.getJSON('map'+x+'x'+y);
        if(!json) {
            return;
        }

        // create new map object which handles the making of the sprites.
        this.maps[x+'x'+y] = new Map(x, y, this, json);

        var map = this.maps[x+'x'+y];
        map.render(this.game);

        // update world position information
        if(map.top < this.top) { this.top = map.top; }
        if(map.right > this.right) { this.right = map.right; }
        if(map.bottom > this.bottom) { this.bottom = map.bottom; }
        if(map.left < this.left) { this.left = map.left; }
    }, this);

    this.game.load.start();
};

World.prototype.addCollidable = function addCollidable (sprite)
{
    this.collidables.add(sprite);
};

World.prototype.collectGarbage = function collectGarbage ()
{
        var this$1 = this;

    var world = this;

    for (var position in this.maps)
    {
        var x = position.split('x')[0];
        var y = position.split('x')[1];

        // remove maps that are further away than 2 full map loads
        if(
            this$1.play.player.worldX - 2 >= x || this$1.play.player.worldX + 2 <= x
            ||
            this$1.play.player.worldY - 2 >= y || this$1.play.player.worldY + 2 <= y
        ) {
            this$1.maps[position].remove();
            delete this$1.maps[position];
            delete this$1.loadedMaps[position];
        }
    }
};

var UserInterface = function UserInterface(stage)
{
    this.stage = stage;
};

UserInterface.prototype.create = function create ()
{

};

UserInterface.prototype.update = function update ()
{
        
};

var PlayState = (function (State$$1) {
    function PlayState () {
        State$$1.apply(this, arguments);
    }

    if ( State$$1 ) PlayState.__proto__ = State$$1;
    PlayState.prototype = Object.create( State$$1 && State$$1.prototype );
    PlayState.prototype.constructor = PlayState;

    PlayState.prototype.preload = function preload ()
    {
        console.log('play preload');
        
        this.game.stage.backgroundColor = '#27ae60';

        // required to show fps
        this.game.time.advancedTiming = true;

        this.game.camera.bounds = null;

        // create player object
        this.player = new Player(this.game, this);

        // create world object
        this.world = new World(this.game, this);

        // create user interface object
        this.userInterface = new UserInterface(this);

        // some garbage collection settings
        this.collectGarbageInterval = 10 * 1000; // run once every 10 seconds
        this.collectedGarbageTime = null; // last time the garbage was collected
    };

    PlayState.prototype.create = function create ()
    {
        console.log('play create');
        
        this.player.create();
        this.world.create();
        this.userInterface.create();
        
    };

    PlayState.prototype.update = function update ()
    {
        // show fps
        this.game.debug.text(this.game.time.fps, 50, 50);

        this.player.update();
        this.world.update();
        this.userInterface.update();

        this.collectGarbage();
    };

    PlayState.prototype.collectGarbage = function collectGarbage ()
    {
        // should we collect garbage?
        if(this.game.time.now - this.collectedGarbageTime < this.collectGarbageInterval) {
            // nothing to do yet.
            return;
        }
        this.collectedGarbageTime = this.game.time.now;

        console.log('play collect garbage');

        // currently we only collect the worlds garbage :)
        this.world.collectGarbage();
    };

    return PlayState;
}(State));

window.config = {
    'tileWidth': 64, // pixels
    'tileHeight': 64, // pixels
    'mapTilesWidth': 32, // tiles
    'mapTilesHeight': 24, // tiles
    'mapWidth': 32 * 64, // tiles * pixels
    'mapHeight': 24 * 64, // tiles * pixels
};

var game = new Phaser.Game(1440, 900, Phaser.AUTO, '');

game.state.add('boot', new BootState(game));
game.state.add('load', new LoadState(game));
game.state.add('menu', new MenuState(game));
game.state.add('play', new PlayState(game));

game.state.start('boot');

}((this.LaravelElixirBundle = this.LaravelElixirBundle || {})));

//# sourceMappingURL=game.js.map
