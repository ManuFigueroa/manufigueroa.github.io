var loader = {
    preload: preload,
    create: create
};

var loading_label;

function preload() {
    loading_label  = game.add.text(400, 350, 'LOADING . . .', { font: '50px Courier', fill: '#ffffff', boundsAlignH: 'center' });
    loading_label.anchor.setTo(0.5, 0.5);
    loading_label.align = "center";

    game.load.spritesheet('cubito', 'assets/cubito.png', 32, 32, 4);
    game.load.spritesheet('hp_bar', 'assets/hp_spritesheet.png',25,25,2);
    game.load.image('spike', 'assets/spike.png');
    game.load.image('sh_sp', 'assets/shop_spike.png');
    game.load.image('m_3', 'assets/m3.png');
    game.load.image('m_4', 'assets/m4.png');
    game.load.image('m_5', 'assets/m5.png');
    game.load.image('m_6', 'assets/m6.png');
    game.load.image('m_7', 'assets/m7.png');
    game.load.image('circulo', 'assets/circulo.png');
    game.load.image('fondo_pausa', 'assets/menupausa.png');
    game.load.image('CD_bar', 'assets/CDbar.png');
    game.load.image('token', 'assets/token.png');
    game.load.image('instrucciones', 'assets/instructions.png');
    game.load.image('titulo', 'assets/titulo.png');

    game.load.spritesheet('mute', 'assets/speaker.png', 32, 32, 2);
    game.load.spritesheet('keys', 'assets/keys_sheet.png', 528, 320, 4);
    game.load.image('menos', 'assets/minus.png');
    game.load.image('mas', 'assets/plus.png');
    game.load.audio('bgm1', 'assets/sounds/inercia_bgm.mp3');

    game.load.physics('physicsData', 'assets/polygons.json');    
}

function create(){
	game.state.start('menu');
}