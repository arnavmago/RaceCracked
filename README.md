# README for RaceCracked

## Commands

In the home directory (i.e. the main directory after downloading and unzipping the code files, should have the textures folder along with ll other files within in) run `npm install; npm run dev` or run them as the following one after the other `npm i or npm install`, `npm run dev`, this will run the application and print the link on your terminal which you can ctrl + click to be redirected to or you can go to <localhost:5173> to play the game

## Game mechanics

### The game calculates score based on number of laps completed, the game measures score, car health (that decreases on collision with other cars or the track boundaries) and car fuel (which resets to full on collecting a fuel can), as your score increases more opponent cars spawn in making it more likey for you to collide and tougher for you to collect fuel

### Movement -

W to start the game, normal WASD controls ( W - forward, A - left, S - backward, D - right)

The car speed increase and descrease is not constant, it simulates acceleration and decelration based on friction with the track.

### Fuel collection -

Fuel cans will spawn anywhere on the track (there will always only be 1 at any point) and you must collect them to keep going as once your fuel gets over its game over

### Collisions -

3 opponent cars spawn at the beginning of the game, as your score goes up so do the number of other cars, thus increasing the difficulty of the game as it goes on

As the collisions had to be coded from scratch and werent simulated using a physics engine they are not perfect.
