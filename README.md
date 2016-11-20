# Top down game basics using phaser library.

This example is mostly about dynamic loading of tile map.
The way it works is like this:

The world consists of maps, maps have a position on the world (x, y).
Maps consists of tiles/sprites, sprites have a position within the map (x, y);

A player can spawns on map (2, 2), tile (12, 10).
In this example a map is 32 * 24 tiles. Each tile is 64px * 64px.

World map:

|Maps |     |     |     |     |
|-----|-----|-----|-----|-----|
| 0,0 | 1,0 | 2,0 | 3,0 | 4,0 |
| 0,1 | 1,1 | 2,1 | 3,1 | 4,1 |
| 0,2 | 1,2 | **2,2** | 3,2 | 4,2 |
| 0,3 | 1,3 | 2,3 | 3,3 | 4,3 |
| 0,4 | 1,4 | 2,4 | 3,4 | 4,4 |

When the player moves close to the edge it will automatically load the map (see world.js / setMapLoadingBoundries and shouldLoadMap).

|Maps |     |     |     |     |
|-----|-----|-----|-----|-----|
| 0,0 | 1,0 | 2,0 | 3,0 | 4,0 |
| 0,1 | 1,1 | **2,1** | 3,1 | 4,1 |
| 0,2 | 1,2 | 2,2 | 3,2 | 4,2 |
| 0,3 | 1,3 | *2,3* | 3,3 | 4,3 |
| 0,4 | 1,4 | 2,4 | 3,4 | 4,4 |

In case the user moves up and it came from the bottom of map (2,2) the garbage collector will automatically remove map (2,3).
Basically maps that are 2 maps away are automatically removed from memory.

Installing:

clone it, `npm install` or `yarn install`.
To publish assets to the public folder run `gulp`.
