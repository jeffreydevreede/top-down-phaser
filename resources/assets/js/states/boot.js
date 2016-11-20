import State from './../state.js';
export default class BootState extends State
{
    create()
    {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.game.state.start('load');
    }
}