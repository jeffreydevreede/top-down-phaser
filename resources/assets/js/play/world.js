import Map from './map.js';

export default class World
{
    constructor(game, play)
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
    }

    create()
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
    }

    update()
    {
        var maps = this.shouldLoadMap();

        // this.debugText.setText(this.play.player.mapY + ' ' + this.play.player.mapX);

        // is the player close enough to the next map that we should load it?
        if(maps.length > 0) {
            var world = this;

            // we take the players current position
            const playerX = this.play.player.worldX;
            const playerY = this.play.player.worldY;

            // loop the possible sides
            maps.forEach(function (side) {
                // setup initial position
                let x = playerX;
                let y = playerY;
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
                let x = playerX;
                let y = playerY;
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
    }

    setMapLoadingBoundries()
    {
        this.topLoadingBoundry = Math.floor(window.config.mapTilesHeight * 0.4);
        this.rightLoadingBoundry = Math.ceil(window.config.mapTilesWidth * 0.6);
        this.bottomLoadingBoundry = Math.floor(window.config.mapTilesHeight * 0.6);
        this.leftLoadingBoundry = Math.ceil(window.config.mapTilesWidth * 0.4);
    }

    shouldLoadMap()
    {
        const result = [];
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
    }

    loadMap(x, y)
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
            const json = this.game.cache.getJSON('map'+x+'x'+y);
            if(!json) {
                return;
            }

            // create new map object which handles the making of the sprites.
            this.maps[x+'x'+y] = new Map(x, y, this, json);

            const map = this.maps[x+'x'+y];
            map.render(this.game);

            // update world position information
            if(map.top < this.top) { this.top = map.top; }
            if(map.right > this.right) { this.right = map.right; }
            if(map.bottom > this.bottom) { this.bottom = map.bottom; }
            if(map.left < this.left) { this.left = map.left; }
        }, this);

        this.game.load.start();
    }

    addCollidable(sprite)
    {
        this.collidables.add(sprite);
    }

    collectGarbage()
    {
        var world = this;

        for (var position in this.maps)
        {
            var x = position.split('x')[0];
            var y = position.split('x')[1];

            // remove maps that are further away than 2 full map loads
            if(
                this.play.player.worldX - 2 >= x || this.play.player.worldX + 2 <= x
                ||
                this.play.player.worldY - 2 >= y || this.play.player.worldY + 2 <= y
            ) {
                this.maps[position].remove();
                delete this.maps[position];
                delete this.loadedMaps[position];
            }
        };
    }
}