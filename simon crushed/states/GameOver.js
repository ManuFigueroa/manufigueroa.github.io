var gameover = {
    create: function () {

        var mata_timers = setInterval('');
        for(var i = 0; i <mata_timers; i++){
            clearInterval(i);
        }

        var finalscore = game.add.text(400,100,'You dodged '+ score + ' times!',{ font: '25px Courier', fill: '#ffffff' })
        var namelabel = game.add.text(400, 200, 'Game Over', { font: '50px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        var pressStart = game.add.text(400, 300, 'Press R to play again', { font: '25px Courier', fill: '#ffffff' });
        var backToMenu = game.add.text(400, 350, 'Press X to go back to the main menu', { font: '25px Courier', fill: '#ffffff' });

        if(score == 21){
            finalscore.text = 'Your score is 21, old enough to drink.'
        }   
        else if (score < 5 && (Math.floor(Math.random()*20) < 2 )) {
            finalscore.text = 'Your score is ' + score + ', were you even trying?'
        }

        finalscore.anchor.setTo(0.5, 0.5);
        finalscore.align = "center";
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
