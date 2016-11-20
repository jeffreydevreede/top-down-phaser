export default class Map {
    constructor(worldX, worldY, world, json)
    {
        this.worldX = worldX;
        this.worldY = worldY;
        this.world = world;
        this.json = json;

        // update the maps position in pixels.
        this.top = this.worldY * this.world.mapHeight;
        this.right = this.worldX * this.world.mapWidth + this.world.mapWidth;
        this.bottom = this.worldY * this.world.mapHeight + this.world.mapHeight;
        this.left = this.worldX * this.world.mapWidth;
    }

    /**
     * Renders the map based on the json tilemap.
     * @param Phaser.Game phaser game object.
     */
    render(game)
    {
        if(!this.json) {
            // map doesn't exist
            return;
        }

        const map = this;

        map.tiles = game.add.group();

        const mapLeft = this.left;
        const mapTop = this.top;

        const tileWidth = this.world.tileWidth;
        const tileHeight = this.world.tileHeight;

        const collisionMap = this.json.collision;
        this.json.sprite.forEach(function (row, y) {
            row.forEach(function (frame, x) {
                // calculate left and top position in pixels for this tile.
                var left = mapLeft + (x * tileWidth);
                var top = mapTop + (y * tileHeight);

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
    }

    remove() {
        this.tiles.destroy(true);
    }
}