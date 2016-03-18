var gamestate = {
    create: create,
    update: update,
    render: render
};

var cubo;   
var malo;
var still;
var result = '';
var result2 = '';

var cursors;
var speed = 600;
var lista = [];
var largo = 0;
var vivo = 1;

var score = 0;
var i = 0;
var velocidad_malo = 650;
var velocidad_salida = 700;
var en_pantalla = 1000;
var tiempo_aviso = 700;
var tiempo_ataque = (1.5)*(velocidad_malo+en_pantalla);

var dist = 85;
var dist_todosH = 500;
var dist_todosV = 400;

var puedo_atacar = 1;
var anterior = 1;

function create() {
    score = 0;
    lista = [];
    largo = 0;
    vivo = 1;
    puedo_atacar = 1;

    velocidad_malo = 800;
    velocidad_salida = 900;
    en_pantalla = 1200;
    speed = 650;

    cubo = game.add.sprite(500, 200, 'cubito');
    cubo.anchor.set(0.5);
    still = cubo.animations.add('still');
    cubo.animations.play('still', 8, true);

    malos = game.add.group();
    malos.enableBody = true;

    avisos = game.add.group();
    avisos.enableBody = true;

    circulos = game.add.group();
    circulos.enableBody = true;


    malos.createMultiple(25, 'malo');
    avisos.createMultiple(10,'aviso');
    circulos.createMultiple(5,'circulo');
        
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(cubo);
    cubo.body.collideWorldBounds = true;

    //Score keeping
    scoreLabel = game.add.text(400,35, '0',{font: "50px Courier",fill: '#ffffff', boundsAlignH: 'center'});
    scoreLabel.anchor.setTo(0.5,0.5);
    scoreLabel.align = "center";
    scoreLabel.setShadow(3,3,'rgba(0,0,0,0.5)',5);

    cursors = game.input.keyboard.createCursorKeys();

    console.log('ver 0.55');
    comenzar();
    
}

function comenzar(){
    var lado = 1;
    var i = 0;

    if (puedo_atacar == 1){
        lado = Math.floor(Math.random()*5) + 1;

        if( lado == anterior){
            if (lado == 5){
                lado = 1;
            }
            else{
                lado = lado+1;
            }            

        }
        anterior = lado;
        lista.push(lado);
        largo ++;

        intervalo = setInterval(function(){
            i++;
            avisar(i);
        }, tiempo_aviso);

    }
 

   // setTimeout(function(){ 
     //   console.log('llamo a comenzar de nuevo');
        //yo creo que este llamado se tiene que hacer cuando terminen de atacar las paredes
        //comenzar();}, largo*tiempo_aviso+2000);

}

function avisar(i){
    if(i>(largo-1)){
        clearInterval(intervalo);
        comenzar_ataque();
    }
    switch(lista[i-1]){
        case 1:
            var aviso = avisos.getFirstDead();
            aviso.anchor.setTo(0.5,0.5);
            aviso.reset(400,300);
            aviso.angle= 0;
            aviso.alpha = 0.5;
            setTimeout(function(){aviso.kill();}, tiempo_aviso);
            break;

        case 2:
            var aviso = avisos.getFirstDead();
            aviso.anchor.setTo(0.5,0.5);
            aviso.reset(400,300);
            aviso.angle = 90;
            aviso.alpha = 0.5;
            setTimeout(function(){aviso.kill();}, tiempo_aviso);
            break;

        case 3:
            var aviso = avisos.getFirstDead();
            aviso.anchor.setTo(0.5,0.5);
            aviso.reset(400,300);
            aviso.angle = 180;
            aviso.alpha = 0.5;
            setTimeout(function(){aviso.kill();}, tiempo_aviso);
            break;

        case 4:       
            var aviso = avisos.getFirstDead();
            aviso.anchor.setTo(0.5,0.5);
            aviso.reset(400,300);
            aviso.angle = 270;
            aviso.alpha = 0.5;
            setTimeout(function(){aviso.kill();}, tiempo_aviso);
            break;

        default:
            var circulo = circulos.getFirstDead();
            circulo.anchor.setTo(0.5,0.5);
            circulo.reset(400,300);
            circulo.alpha = 0.5;
            setTimeout(function(){circulo.kill();}, tiempo_aviso);
            break;

    }
}


function comenzar_ataque(){
    var i = 0;
    
    int_ataque = setInterval(function(){
            i++;
            ataque(i);
        }, tiempo_ataque);


}


function ataque(donde){
    puedo_atacar = 0;
    var malo = malos.getFirstDead();
    
    //malo.body.immovable = true;   

    malo.events.onKilled.add(scoreUP,this);    

    //result = 'lado :' + lado;
    var tween = game.add.tween(malo);  
    

    if(donde>(largo-1)){        
        clearInterval(int_ataque);        
        setTimeout(function(){
            puedo_atacar = 1;
            comenzar();
        }, (2*tiempo_ataque));
        
    }  

    switch(lista[donde-1]) {
        case 1:
            
            malo.reset(-780, 0);
            tween.to({x: -dist}, velocidad_malo, 'Linear', true, 0);            
            setTimeout(function (){malo.body.velocity.x = -velocidad_salida;}, en_pantalla+velocidad_malo);
            break;

        case 2:

            malo.reset(0, -580);
            tween.to({y: -dist}, velocidad_malo, 'Linear', true, 0);
            setTimeout(function (){malo.body.velocity.y = -velocidad_salida;}, en_pantalla+velocidad_malo);
            break;

        case 3:

            malo.reset(780, 0);
            tween.to({x: dist}, velocidad_malo, 'Linear', true, 0);
            setTimeout(function (){malo.body.velocity.x = velocidad_salida;}, en_pantalla+velocidad_malo);

            break;

        case 4: 
        
            malo.reset(0, 580);
            tween.to({y: dist}, velocidad_malo, 'Linear', true, 0);
            setTimeout(function (){malo.body.velocity.y = velocidad_salida;}, en_pantalla+velocidad_malo);

            break;
        default:
            var maloN = malos.getFirstDead();
            var tweenN = game.add.tween(maloN);

            var maloE = malos.getFirstDead();
            var tweenE = game.add.tween(maloE);

            var maloSur = malos.getFirstDead();
            var tweenS = game.add.tween(maloSur);

            malo.reset(-780, 0);
            tweenN.to({x: -dist_todosH}, velocidad_malo, 'Linear', true, 0);            
            setTimeout(function (){malo.body.velocity.x = -velocidad_salida;}, en_pantalla+velocidad_malo);

            maloN.reset(0, -580);
            tweenE.to({y: -dist_todosV}, velocidad_malo, 'Linear', true);
            setTimeout(function (){maloN.body.velocity.y = -velocidad_salida;}, en_pantalla+velocidad_malo);

            maloE.reset(780, 0);
            tween.to({x: dist_todosH}, velocidad_malo, 'Linear', true, 0);
            setTimeout(function (){maloE.body.velocity.x = velocidad_salida;}, en_pantalla+velocidad_malo);

            maloSur.reset(0, 580);
            tweenS.to({y: dist_todosV}, velocidad_malo, 'Linear', true, 0);
            setTimeout(function (){maloSur.body.velocity.y = velocidad_salida;}, en_pantalla+velocidad_malo);


            break;
    }

    malo.checkWorldBounds = true;
    malo.outOfBoundsKill = true;
    
}

function update() {
    game.physics.arcade.overlap(cubo, malos, die, null, this);

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
    result = lista;
    scoreLabel.text = score;
}


function scoreUP() {
    score++;
}


function die(cubo, malo) {   
    game.stage.backgroundColor= 'rgba(255,151,151,50)'; 
    game.paused = true;
    clearInterval(int_ataque);
    vivo = 0;
    setTimeout(function(){
        game.paused = false;
        game.stage.backgroundColor = 'rgb(0,0,0)';
        game.state.start('gameover');         
    },2500);
           
}


function render() {

    game.debug.text(result, 32, 32);
    game.debug.text(result2, 32, 50);

}






