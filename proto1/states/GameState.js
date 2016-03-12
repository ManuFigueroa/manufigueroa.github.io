var gamestate = {
    create: create,
    update: update,
    render: render
};

var cubo;   
var malo;
var still;
var result = '0';
var flag = 'base';

var cursors;
var speed = 400;

var score = 0;
var i = 0;
var W = 0;
var N = 0;
var E = 0;
var S = 0;


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

    cursors = game.input.keyboard.createCursorKeys();

    timer = game.time.events.loop(1500, attackH, this);
    scortimer = game.time.events.loop(1000, scoreUP, this);

    game.time.events.add(5000, dificulty1, this);
    game.time.events.add(12000, dificulty2, this);
    game.time.events.add(18000, dificulty3, this);
    
}

function dificulty1() {
    timer2 = game.time.events.loop(1600, attackV, this);
}
function dificulty2() {
    timer3 = game.time.events.loop(1400, attackH2, this);
}
function dificulty3() {
    timer4 = game.time.events.loop(1300, attackV2, this);
}


function update() {
    game.physics.arcade.collide(cubo, malos, die, null, this);
    /*
    game.physics.arcade.collide(cubo, maloN, die, null, this);
    game.physics.arcade.collide(cubo, maloS, die, null, this);
    game.physics.arcade.collide(cubo, maloE, die, null, this);
    */

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

    flag = 'W: ' + W + ' N: ' + N + ' E: '+ E + ' S: '+S + ' Score: ' + score ;
}

function scoreUP() {
    score++;
}

function attackH() {
    W++;
    var malo = malos.getFirstDead();

    malo.reset(-160, Math.floor(Math.random() * 500));
    malo.body.velocity.x = Math.floor(Math.random()*200)+300;
    malo.body.immovable = true;

    malo.checkWorldBounds = true;
    malo.outOfBoundsKill = true;

}

function attackH2() {
    E++;
    var malo = malos.getFirstDead();

    malo.reset(810, Math.floor(Math.random() * 500));
    malo.body.velocity.x = -Math.floor(Math.random() * 200) - 300;
    malo.body.immovable = true;

    malo.checkWorldBounds = true;
    malo.outOfBoundsKill = true;
}

function attackV() {
    N++;
    var malo = malos.getFirstDead();

    malo.reset(Math.floor(Math.random()*700), -160);
    malo.body.velocity.y = -Math.floor(Math.random() * 200) + 300;
    malo.body.immovable = true; 

    malo.checkWorldBounds = true;
    malo.outOfBoundsKill = true;
}

function attackV2() {
    S++;
    var malo = malos.getFirstDead();

    malo.reset(Math.floor(Math.random() * 700), 610);
    malo.body.velocity.y = Math.floor(Math.random() * 200) - 300;
    malo.body.immovable = true;

    malo.checkWorldBounds = true;
    malo.outOfBoundsKill = true;

}

function die(cubo, malo) {
    i++;
    result = i;

    if (i > 50) {
        i = 0;
        game.state.start('gameover');
        result = '';
    }
}


function render() {

    game.debug.text(result, 32, 32);
    game.debug.text(flag, 32, 50);

}






