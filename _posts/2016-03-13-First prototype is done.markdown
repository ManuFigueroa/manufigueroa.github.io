---
layout: post
title:  "First prototype is done"
date:   2016-03-13
---


<span class="dropcap">I</span>n my previous post I talked about picking the engine to make my prototypes, now I can show off <a href="http://gamejolt.com/games/dodge-me/133083">my first prototype done using Phaser</a>.

The development was easier than expected, my previous prototypes had been made using Construct 2 and the last time I actually programmed something was so long ago I was feeling rusty. After the initial barrier, and after doing the Phaser basics tutorial I started getting the hang of it.

I would like to recommend the following tutorials to those who want to make a game prototype using Phaser:

* <a href="http://phaser.io/tutorials/making-your-first-phaser-game">Making your first Phaser game</a>
* <a href="http://perplexingtech.weebly.com/game-dev-blog/using-states-in-phaserjs-javascript-game-developement">Using states in Phaser.JS</a>
* <a href="http://www.joshmorony.com/how-to-create-an-infinite-climbing-game-in-phaser/">Creating an infinite climbing game in Phaser </a>

My main problem was with time-loops. In the game I originally assigned 4 time loops: basically each one had so every x seconds a new enemy would pop up from one side of the screen. Each loop represented one of the four sides of the screen and the loops had 5 second delays so enemies would start from the left and then every 5 seconds enemies would start coming from the top, right and finally from the bottom of the screen.

The issue with this was that, after the 3rd loop started, the second one would just stop. This meant that the enemies would stop coming from the top of the screen, it also had another side effect: enemies would appear in pairs from the newest loop. So it would pop 2 enemies at a time from the right until the 4th loop started, then it would pop one from the right but 2 from the bottom.

In the end what I did was keeping all the enemy spawns in just one time-loop, where the frequency of the spawn changed with a "difficulty" variable. Nothing a bunch of if and elses couldn't fix.

All in all the overall experience was good, I'm brainstorming for ideas for the rest of the prototypes for now, and I'll come back with a new post once the next prototype is done.