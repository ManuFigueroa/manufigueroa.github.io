---
layout: post
title:  "Turning a prototype into a game"
date:   2016-04-03
---

<p class="intro"><span class="dropcap">S</span>o I finished the 5 prototypes for my class but I didn't update the blog as often as I would've liked. I've picked one of the prototypes to continue development, here I'll explain the reasons why and also I made some game design diagrams that explain a bit about the game I picked.</p>

First of all let's get that promo and link the games:

* <a href="http://gamejolt.com/games/dodge-me/133083">dodge.me</a>
	* Simple game about dodging enemies coming from the edges of the screen.
* <a href="http://gamejolt.com/games/cornered/133149">CORNERED</a>
	* Fast-paced game where you have to avoid the sides of the screen when they attack after a brief signal.
* <a href="http://gamejolt.com/games/simon-crushed/134126">simon crushed</a>
	* Similar to prototype 2 but combined with Simon Says, you have to learn the pattern of attack and dodge it.
* <a href="http://gamejolt.com/games/prototype-4/134541">Prototype 4</a>
	* Kill enemies using your shield, dodge when it's down and buy upgrades to survive.
* <a href="http://gamejolt.com/games/click-me/134826">click.me</a>
	* An action clicker, don't let the enemies leave the screen.


The ones with the most plays are click.me and Prototype 4, with 58 and 56 plays respectively at the moment I'm writing this. I've decided to expand upon Prototype 4 because, honestly, I like it more. I feel like there's a lot of room for expansion on this game and to me it feels like the most robust out of my 5 prototypes.

Here's a brief list of the first few features I plan to add to the game:

* Change enemies spawn to a wave system.
* Add different types of enemies
* Add shield duration and cooldown indicators
* Add some sound effects and background music

Now for the design diagrams. First up is game tokens, here we can take a look a the main elements in the game and how they interact with eachother.

<figure>
<img src="{{ '/assets/img/GTokens1.png' | prepend: site.baseurl }}" alt="">
<figcaption>Fig1. - Game Tokens</figcaption>
</figure>

<figure>
<img src="{{ '/assets/img/GTokens2.png' | prepend: site.baseurl }}" alt="">
<figcaption>Fig2. - Game Token Interactions</figcaption>
 </figure>

And the game layers diagram expands upon game tokens with lots of information, from the properties of the elements to the reaction the player should feel interacting with the token. You can learn about both of these diagrams on <a href="http://www.gamasutra.com/view/feature/187777/game_design_tools_for_collaboration.php?print=1">gamasutra</a>.

<figure>
<img src="{{ '/assets/img/Game Layers.png' | prepend: site.baseurl }}" alt="">
<figcaption>Fig3. - Game Layers Diagram</figcaption>
</figure>

That is it for today, I'll come back with an update on the game next week.