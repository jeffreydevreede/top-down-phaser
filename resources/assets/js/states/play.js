import State from './../state.js';
import Player from './../play/player.js';
import World from './../play/world.js';
import UserInterface from './../play/user-interface.js';

export default class PlayState extends State
{
    preload()
    {
        console.log('play preload');
        
        this.game.stage.backgroundColor = '#27ae60';

        // required to show fps
        this.game.time.advancedTiming = true;

        this.game.camera.bounds = null;

        // create player object
        this.player = new Player(this.game, this);

        // create world object
        this.world = new World(this.game, this);

        // create user interface object
        this.userInterface = new UserInterface(this);

        // some garbage collection settings
        this.collectGarbageInterval = 10 * 1000; // run once every 10 seconds
        this.collectedGarbageTime = null; // last time the garbage was collected
    }

    create()
    {
        console.log('play create');
        
        this.player.create();
        this.world.create();
        this.userInterface.create();
        
    }

    update()
    {
        // show fps
        this.game.debug.text(this.game.time.fps, 50, 50);

        this.player.update();
        this.world.update();
        this.userInterface.update();

        this.collectGarbage();
    }

    collectGarbage()
    {
        // should we collect garbage?
        if(this.game.time.now - this.collectedGarbageTime < this.collectGarbageInterval) {
            // nothing to do yet.
            return;
        }
        this.collectedGarbageTime = this.game.time.now;

        console.log('play collect garbage');

        // currently we only collect the worlds garbage :)
        this.world.collectGarbage();
    }
}