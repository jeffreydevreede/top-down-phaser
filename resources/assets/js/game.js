import BootState from './states/boot.js';
import LoadState from './states/load.js';
import MenuState from './states/menu.js';
import PlayState from './states/play.js';

window.config = {
    'tileWidth': 64, // pixels
    'tileHeight': 64, // pixels
    'mapTilesWidth': 32, // tiles
    'mapTilesHeight': 24, // tiles
    'mapWidth': 32 * 64, // tiles * pixels
    'mapHeight': 24 * 64, // tiles * pixels
};

const game = new Phaser.Game(1440, 900, Phaser.AUTO, '');

game.state.add('boot', new BootState(game));
game.state.add('load', new LoadState(game));
game.state.add('menu', new MenuState(game));
game.state.add('play', new PlayState(game));

game.state.start('boot');
