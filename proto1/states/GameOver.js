var gameover = {
    create: function () {
        var namelabel = game.add.text(400, 200, 'Game Over', { font: '50px Arial', fill: '#ffffff', boundsAlignH: 'center' });
        var pressStart = game.add.text(400, 300, 'Press R to play again', { font: '25px Arial', fill: '#ffffff' });
        var backToMenu = game.add.text(400, 350, 'Press X to go back to the main menu', { font: '25px Arial', fill: '#ffffff' });

        namelabel.anchor.setTo(0.5, 0.5);
        namelabel.align = "center";
        pressStart.anchor.setTo(0.5, 0.5);
        pressStart.align = "center";
        backToMenu.anchor.setTo(0.5, 0.5);
        backToMenu.align = "center";

        var rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);
        var xkey = game.input.keyboard.addKey(Phaser.Keyboard.X);

        rkey.onDown.addOnce(this.start, this);
        xkey.onDown.addOnce(this.menu, this);
    },

    start: function () {
        game.state.start('game');
    },

    menu: function () {
        game.state.start('menu');
    }
};
