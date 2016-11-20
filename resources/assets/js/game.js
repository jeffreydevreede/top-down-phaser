import BootState from './states/boot.js';
import LoadState from './states/load.js';
import MenuState from './states/menu.js';
import PlayState from './states/play.js';

const game = new Phaser.Game(1440, 900, Phaser.AUTO, '');

game.state.add('boot', new BootState(game));
game.state.add('load', new LoadState(game));
game.state.add('menu', new MenuState(game));
game.state.add('play', new PlayState(game));

game.state.start('boot');
