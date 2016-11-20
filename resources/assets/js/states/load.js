import State from './../state.js';
export default class LoadState extends State
{
    preload()
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
    }

    create()
    {
        this.game.load.onLoadComplete.add(this.complete, this);
        this.game.load.onFileComplete.add(this.updatePercentage, this);

        this.game.load.image('menuBackground', '/assets/img/menu/background.png');
        this.game.load.image('player', '/assets/img/play/player.png');
        this.game.load.spritesheet('tiles', '/assets/img/play/tiles.png', 64, 64);

        this.game.load.start();
    }

    updatePercentage(progress)
    {
        this.percentage.setText(progress + "%");
    }

    complete()
    {
        this.load.onLoadComplete.removeAll();
        this.load.onFileComplete.removeAll();
        this.game.state.start('menu');
    }
}