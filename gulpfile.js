const elixir = require('laravel-elixir');

elixir.config.assetsPath = 'resources/assets';
elixir.config.publicPath = 'public';
elixir.config.css.outputFolder = 'css';
elixir.config.js.outputFolder = 'js';

require('laravel-elixir-vue-2');

elixir((mix) => {
    mix
        .rollup('game.js')
        .copy('node_modules/phaser/build/phaser.min.js', 'public/js/phaser.js')
        .copy('resources/assets/img', 'public/assets/img');
});