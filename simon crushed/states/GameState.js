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
var speed = 0;
var lista = [];
var largo = 0;
var vivo = 1;

var score = 0;
var i = 0;
var velocidad_malo = 0;
var velocidad_salida = 0;
var velocidad_todos = 400;
var en_pantalla = 0;
var tiempo_aviso = 700;
var tiempo_ataque = 0;

var dist = 90;
var dist_todosH = 500;
var dist_todosV = 400;

var puedo_atacar = 1;
var anterior = 1;

function create() {
    score = 0;
    lista = [];
    largo = 0;
    puedo_atacar = 1;

    velocidad_malo = 800;
    velocidad_maloH = 900;
    velocidad_salida = 900;
    en_pantalla = 250;
    speed = 600;

    tiempo_ataque = (1.4)*(velocidad_maloH+en_pantalla);


    var matar_inters = setInterval('');

    for(var i = 0; i<matar_inters;i++){
        clearInterval(i);
    }

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


    malos.createMultiple(35, 'malo');
    avisos.createMultiple(20,'aviso');
    circulos.createMultiple(10,'circulo');
        
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(cubo);
    cubo.body.collideWorldBounds = true;

    //Score keeping
    scoreLabel = game.add.text(400,35, '0',{font: "50px Courier",fill: '#ffffff', boundsAlignH: 'center'});
    scoreLabel.anchor.setTo(0.5,0.5);
    scoreLabel.align = "center";
    scoreLabel.setShadow(3,3,'rgba(0,0,0,0.5)',5);

    cursors = game.input.keyboard.createCursorKeys();

    console.log('ver 0.79');
    setTimeout(function(){
        vivo = 1;
        comenzar();
    },500);
    
    
}

function comenzar(){
    var lado = 1;
    var i = 0;

    if (puedo_atacar == 1){
        lado = Math.floor(Math.random()*8) + 1;
        if (lado >= 5){
            lado = 5;
        }

        if( lado == anterior ){
            if (lado == 5){
                lado = Math.floor(Math.random()*4) + 1;
            }
            else{
                lado = lado+1;
            }            

        }

        anterior = lado;
        lista.push(lado);
        largo ++;

        if(vivo == 1){
            intervalo = setInterval(function(){
                i++;
                avisar(i);
            }, tiempo_aviso);
        }

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

    //console.log(lista);
    if(vivo == 1){
        int_ataque = setInterval(function(){
                i++;
                //console.log(lista[i-1]);
                ataque(i);
            }, tiempo_ataque);
    }


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
            tween.to({x: -dist}, velocidad_maloH, 'Linear', true, 0);            
            setTimeout(function (){malo.body.velocity.x = -velocidad_salida;}, en_pantalla+velocidad_maloH);
            break;

        case 2:

            malo.reset(0, -580);
            tween.to({y: -dist}, velocidad_malo, 'Linear', true, 0);
            setTimeout(function (){malo.body.velocity.y = -velocidad_salida;}, en_pantalla+velocidad_malo);
            break;

        case 3:

            malo.reset(780, 0);
            tween.to({x: dist}, velocidad_maloH, 'Linear', true, 0);
            setTimeout(function (){malo.body.velocity.x = velocidad_salida;}, en_pantalla+velocidad_maloH);

            break;

        case 4: 
        
            malo.reset(0, 580);
            tween.to({y: dist}, velocidad_malo, 'Linear', true, 0);
            setTimeout(function (){malo.body.velocity.y = velocidad_salida;}, en_pantalla+velocidad_malo);

            break;
        default:

            malo.reset(-780, 0);
            tween.to({x: -dist_todosH}, velocidad_todos, 'Linear', true, 0);            
            setTimeout(function (){malo.body.velocity.x = -velocidad_salida;}, (1.4*(en_pantalla+velocidad_todos)));

            var maloN = malos.getFirstDead();
            var tweenN = game.add.tween(maloN);
            maloN.reset(0, -580);
            tweenN.to({y: -dist_todosV}, velocidad_todos, 'Linear', true);
            setTimeout(function (){maloN.body.velocity.y = -velocidad_salida;}, (1.4*(en_pantalla+velocidad_todos)));

            var maloE = malos.getFirstDead();
            var tweenE = game.add.tween(maloE);
            maloE.reset(780, 0);
            tweenE.to({x: dist_todosH}, velocidad_todos, 'Linear', true, 0);
            setTimeout(function (){maloE.body.velocity.x = velocidad_salida;}, (1.4*(en_pantalla+velocidad_todos)));

            var maloSur = malos.getFirstDead();
            var tweenS = game.add.tween(maloSur);
            maloSur.reset(0, 580);
            tweenS.to({y: dist_todosV}, velocidad_todos, 'Linear', true, 0);
            setTimeout(function (){maloSur.body.velocity.y = velocidad_salida;}, (1.4*(en_pantalla+velocidad_todos)));

            maloN.outOfBoundsKill = true;
            maloE.outOfBoundsKill = true;
            maloSur.outOfBoundsKill = true;
         


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
    //result = lista;
    scoreLabel.text = score;
}


function scoreUP() {
    score++;
}


function die(cubo, malo) {   
    game.stage.backgroundColor= 'rgba(255,151,151,50)'; 
    game.paused = true;   
    vivo = 0;

    var matar_inters = setInterval('');

    for(var i = 0; i<matar_inters;i++){
        clearInterval(i);
    }
    //clearInterval(intervalo);
    //clearInterval(int_ataque);

    puedo_atacar = 0;
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






