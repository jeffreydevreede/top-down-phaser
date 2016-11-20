export default class Player
{
    constructor(game, play)
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
    }

    create()
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
    }

    update()
    {
        this.updateMovement();

        // calculate sprite pointing direction, based on mouse location, camera location, and player location.
        this.updateRotation();

        // update players relative point on the map, this could be used to persist location to server.
        this.updateMapLocation();
        this.updateWorldLocation();
    }

    updateMovement()
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
    }

    updateRotation()
    {
        var rotation = Math.atan2(this.game.input.activePointer.y - this.sprite.y + this.game.camera.y, this.game.input.activePointer.x - this.sprite.x + this.game.camera.x);
        this.sprite.rotation = rotation;
    }

    updateMapLocation()
    {
        const x = this.sprite.x;
        const y = this.sprite.y;

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
    }

    updateWorldLocation()
    {
        this.worldX = Math.floor(this.sprite.x / window.config.mapWidth);
        this.worldY = Math.floor(this.sprite.y / window.config.mapHeight);
    }
}