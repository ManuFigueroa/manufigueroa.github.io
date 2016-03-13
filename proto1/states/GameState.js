var gamestate = {
    create: create,
    update: update,
    render: render
};

var cubo;   
var malo;
var still;
var result = '';

var cursors;
var speed = 400;

var score = 0;
var diff = 1;
var velocidad_malos = 1;
var i = 0;



function create() {
    cubo = game.add.sprite(500, 200, 'cubito');
    cubo.anchor.set(0.5);
    still = cubo.animations.add('still');
    cubo.animations.play('still', 8, true);

    malos = game.add.group();
    malos.enableBody = true;

    malos.createMultiple(50, 'malo');
        
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(cubo);
    cubo.body.collideWorldBounds = true;

    //Score keeping
    scoreLabel = game.add.text(400,35, '0',{font: "50px Arial",fill: '#ffffff', boundsAlignH: 'center'});
    scoreLabel.anchor.setTo(0.5,0.5);
    scoreLabel.align = "center";

    cursors = game.input.keyboard.createCursorKeys();

    score = 0;
    velocidad_malos = 1;
    diff = 1;

    timer = game.time.events.loop((Math.floor(1000/(2*velocidad_malos))+1), attackH, this);
    //scortimer = game.time.events.loop(1000, scoreUP, this);
    game.time.events.loop(4000, mas_speed,this);

    game.time.events.add(5000, dificulty1, this);
    game.time.events.add(12000, dificulty2, this);
    game.time.events.add(18000, dificulty3, this);
    
}

function dificulty1() {
    diff++;
}
function dificulty2() {
    diff++;
}
function dificulty3() {
    diff++;
}
function mas_speed(){
	velocidad_malos = velocidad_malos*2;
}


function update() {
    game.physics.arcade.collide(cubo, malos, die, null, this);

    //movimiento
    cubo.body.velocity.x = 0;
    cubo.body.velocity.y = 0;
    if (cursors.left.isDown) {
        cubo.body.velocity.x = -speed;
    }
    else if (cursors.right.isDown) {
        cubo.body.velocity.x = speed;
    }
    else {
        cubo.body.velocity.x = 0;
    }

    if (cursors.up.isDown) {
        cubo.body.velocity.y = -speed;
    }
    else if (cursors.down.isDown) {
        cubo.body.velocity.y = speed;
    }
    else {
        cubo.body.velocity.y = 0;
    }

    //flag = 'W: ' + W + ' N: ' + N + ' E: '+ E + ' S: '+S + ' Score: ' + score ;
    scoreLabel.text = score;
}


function scoreUP() {
    score++;
}


function attackH() {
    var malo = malos.getFirstDead();
    malo.body.immovable = true;
    malo.checkWorldBounds = true;
    malo.outOfBoundsKill = true;

    malo.events.onKilled.add(scoreUP,this);

    direccion = Math.floor(Math.random()*diff)+1;
    
	if (direccion == 1){
	    malo.reset(-149, Math.floor(Math.random() * 500));
	    malo.body.velocity.x = Math.floor(Math.random()*200)+300;
    }
    else if (direccion == 2){
    	attackV();
    }
    else if (direccion == 3){
    	attackH2();
    }
    else{
    	attackV2();
    }

}

function attackH2() {
    var malo = malos.getFirstDead();

    malo.reset(799, Math.floor(Math.random() * 500));
    malo.body.velocity.x = -Math.floor(Math.random() * 200) - 300;
    malo.body.immovable = true;

    malo.checkWorldBounds = true;
    malo.outOfBoundsKill = true;
}

function attackV() {
    var malo = malos.getFirstDead();

    malo.reset(Math.floor(Math.random()*700), -149);
    malo.body.velocity.y = -Math.floor(Math.random() * 200) + 300;
    malo.body.immovable = true; 

    malo.checkWorldBounds = true;
    malo.outOfBoundsKill = true;
}

function attackV2() {
    var malo = malos.getFirstDead();

    malo.reset(Math.floor(Math.random() * 700), 599);
    malo.body.velocity.y = Math.floor(Math.random() * 200) - 300;
    malo.body.immovable = true;

    malo.checkWorldBounds = true;
    malo.outOfBoundsKill = true;

}

function die(cubo, malo) {
    i++;
    //result = i;

    if (i > 5) {
        i = 0;
        game.state.start('gameover');
        result = '';
    }
}


function render() {

    game.debug.text(result, 32, 32);

}






