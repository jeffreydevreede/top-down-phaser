import State from './../state.js';
export default class MenuState extends State
{
    preload()
    {
        console.log('menu preload');

        this.game.stage.backgroundColor = '#27ae60';

        const background = this.game.add.image(this.game.world.width * 0.5, this.game.world.height * 0.5, 'menuBackground');
        background.anchor.set(0.5);

        const text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.75, "Click to start", {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        });
        text.anchor.set(0.5);
    }

    create()
    {
        console.log('menu create');

        this.game.input.onDown.addOnce(this.play, this);
    }

    play()
    {
        console.log('menu play');

        this.game.state.start('play');
    }
}