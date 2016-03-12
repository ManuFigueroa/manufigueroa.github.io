var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Gamediv');

game.state.add('gameover', gameover);
game.state.add('game', gamestate);
game.state.add('menu', mainmenu);

game.state.start('menu');
