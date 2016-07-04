var game = new Phaser.Game(800, 800, Phaser.AUTO, 'Gamediv');

game.state.add('loader', loader);
game.state.add('gameover', gameover);
game.state.add('game', gamestate);
game.state.add('menu', mainmenu);

game.state.start('loader');
