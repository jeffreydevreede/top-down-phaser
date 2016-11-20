import Map from './map.js';

export default class World
{
    constructor(game, play)
    {
        this.game = game;
        this.play = play;

        this.maps = {};
        this.loadedMaps = {};

        this.tileWidth = 64;
        this.tileHeight = 64;
        this.mapWidth = 32*64;
        this.mapHeight = 24*64;

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
    }

    update()
    {
        var loadMap = this.shouldLoadMap();

        // is the player close enough to the next map that we should load it?
        if(loadMap) {
            // we take the players current position
            var x = this.play.player.worldX;
            var y = this.play.player.worldY;

            // we calculate the world x and y for the new map
            switch(loadMap)
            {
                case 'top':
                    y = this.play.player.worldY - 1;
                    break;
                case 'right':
                    x = this.play.player.worldX + 1;
                    break;
                case 'bottom':
                    y = this.play.player.worldY + 1;
                    break;
                case 'left':
                    x = this.play.player.worldX - 1;
                    break;
            }

            // do the actual loading
            this.loadMap(x, y);
        }

        this.game.physics.arcade.collide(this.play.player.sprite, this.collidables);
    }

    setMapLoadingBoundries()
    {
        this.topLoadingBoundry = Math.floor((this.mapHeight / this.tileHeight) * 0.4);
        this.rightLoadingBoundry = Math.ceil((this.mapWidth / this.tileWidth) * 0.6);
        this.bottomLoadingBoundry = Math.floor((this.mapHeight / this.tileHeight) * 0.6);
        this.leftLoadingBoundry = Math.ceil((this.mapWidth / this.tileWidth) * 0.4);
    }

    shouldLoadMap()
    {
        // top
        if(this.play.player.mapY < this.topLoadingBoundry) {
            return 'top';
        }
        // right
        if(this.play.player.mapX > this.rightLoadingBoundry) {
            return 'right';
        }
        // bottom
        if(this.play.player.mapY > this.bottomLoadingBoundry) {
            return 'bottom';
        }

        // left
        if(this.play.player.mapX < this.leftLoadingBoundry) {
            return 'left';
        }

        return false;
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