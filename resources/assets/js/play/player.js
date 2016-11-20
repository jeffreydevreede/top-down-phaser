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
    }

    create()
    {
        // render
        var left = this.play.world.mapWidth * this.worldX + this.mapX * this.play.world.tileWidth + this.play.world.tileWidth / 2;
        var top = this.play.world.mapHeight * this.worldY + this.mapY * this.play.world.tileHeight + this.play.world.tileHeight / 2;

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
            this.sprite.body.velocity.x = -200;
        }
        else if (this.wasd.right.isDown) {
            this.sprite.body.velocity.x = 200;
        }

        if (this.wasd.up.isDown) {
           this.sprite.body.velocity.y = -200;
        }
        else if (this.wasd.down.isDown) {
           this.sprite.body.velocity.y = 200;
        }
    }

    updateRotation()
    {
        var rotation = Math.atan2(this.game.input.activePointer.y - this.sprite.y + this.game.camera.y, this.game.input.activePointer.x - this.sprite.x + this.game.camera.x);
        this.sprite.rotation = rotation;
    }

    updateMapLocation()
    {
        this.mapX = Math.floor((this.sprite.x % this.play.world.mapWidth) / this.play.world.tileWidth);
        this.mapY = Math.floor((this.sprite.y % this.play.world.mapHeight) / this.play.world.tileHeight);
    }

    updateWorldLocation()
    {
        this.worldX = Math.floor(this.sprite.x / this.play.world.mapWidth);
        this.worldY = Math.floor(this.sprite.y / this.play.world.mapHeight);
    }
}