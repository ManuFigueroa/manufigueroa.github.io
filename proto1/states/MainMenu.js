var mainmenu = {
    preload: preload,
    create: create,
    start: start
};

function preload() {
    game.load.spritesheet('cubito', 'assets/cubito.png', 32, 32, 4);
    game.load.image('malo', 'assets/malero.png');

}

function create() {
    var namelabel = game.add.text(400, 200, 'Proto 1', { font: '50px Arial', fill: '#ffffff', boundsAlignH: 'center' });
    var pressStart = game.add.text(400, 300, 'Press x to start', { font: '25px Arial', fill: '#ffffff' });
    
    namelabel.anchor.setTo(0.5, 0.5);
    namelabel.align = "center";

    pressStart.anchor.setTo(0.5, 0.5);
    pressStart.align = "center";

    var xkey = game.input.keyboard.addKey(Phaser.Keyboard.X);

    xkey.onDown.addOnce(this.start, this);
}

function start(){
    game.state.start('game')
}