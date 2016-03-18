var mainmenu = {
    preload: preload,
    create: create,
    start: start
};

function preload() {
    game.load.spritesheet('cubito', 'assets/cubito.png', 32, 32, 4);
    game.load.image('malo', 'assets/malero200x200.png');
    game.load.image('aviso', 'assets/aviso.png');
    game.load.image('circulo', 'assets/circulo.png');

}

function create() {
    var namelabel = game.add.text(400, 200, 'simon  crushed', { font: '50px Courier', fill: '#ffffff', boundsAlignH: 'center' });
    var pressStart = game.add.text(400, 300, 'Press x to start', { font: '25px Courier', fill: '#ffffff' });
    var instructions = game.add.text(400,500, 'Use your arrow keys to move',{ font: '25px Courier', fill: '#ffffff' } )
    
    namelabel.anchor.setTo(0.5, 0.5);
    namelabel.align = "center";

    pressStart.anchor.setTo(0.5, 0.5);
    pressStart.align = "center";

    instructions.anchor.setTo(0.5, 0.5);
    instructions.align = "center";

    var xkey = game.input.keyboard.addKey(Phaser.Keyboard.X);

    xkey.onDown.addOnce(this.start, this);
}

function start(){
    game.state.start('game')
}