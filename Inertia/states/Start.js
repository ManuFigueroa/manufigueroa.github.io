var game = new Phaser.Game(800, 800, Phaser.AUTO, 'Gamediv');

BasicGame = {
    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null
};

game.state.add('loader', loader);
game.state.add('gameover', gameover);
game.state.add('game', gamestate);
game.state.add('menu', mainmenu);

game.state.start('loader');
