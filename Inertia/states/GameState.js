var gamestate = {
    create: create,
    update: update,
    render: render
};

var cubo; 
var shield; 

var spikes;
var spikes_hp;
var spike_timeout;

var cursors;
var spacebar;
var xkey;
var tkey;
var comprando = 0;
var hay_token = 1;

var speed = 0;
var hp = 3;
var hp_bar = [];
var max_hp = 3;
var shield_scale = 2;
var shield_duration = 1000;
var shield_cooldown = 0;
var shield_price = 20;
var shield_price_CD = 20;
var shield_price_dur = 20;
var shield_scale_level = 1;
var shield_duration_level = 1;
var shield_cooldown_level = 1;

var shield_in_use = 1;
var spike_count_price = 20;
var spike_pierce_price = 20;
var max_hp_price = 500;
var spike_count_level = 1;
var spike_pierce_level = 1;
var max_hp_level = 1;
var vulnerable = 1;

var Cooldown_bar = null;

var ronda = 1;
var vivos = 0;
var ronda_lista = 0;

var result = '';

var ciclos_enemigos = 0;
var prox_dificultad = 10;
var frecuencia_enemigos = 2500;


//1 = <, 2 = ^, 3 = >, 4 = v
var direccion = 2;

var score = 0;
var final_score = 0;

function create() {
    console.log('ver 3.2');
    score = 0;
    final_score = 0;
    speed = 400;

    shield_in_use = 0;
    spike_timeout = 3000;
    hp_bar = [];    

    ciclos_enemigos = 0;    
    ronda = start_wave;
    prox_dificultad = 10;
    frecuencia_enemigos = 1500;

    for (var i = 1; i < ronda; i++) {
        frecuencia_enemigos = Math.ceil(frecuencia_enemigos/1.01);
        prox_dificultad = prox_dificultad*1.05;        
    }

    vulnerable = 1;
    vivos = 0;
    ronda_lista = 0;

    console.log("ronda: "+ronda+" Prox: "+prox_dificultad+" frec: "+frecuencia_enemigos);

    cubo = game.add.sprite(400, 400, 'cubito');
    cubo.anchor.set(0.5);
    still = cubo.animations.add('still');
    cubo.animations.play('still', 8, true);

    spikes = game.add.group();
    spikes.enableBody = true;
    spikes.physicsBodyType = Phaser.Physics.P2JS;
    
    shields = game.add.group();
    shields.enableBody = true;    
    shields.physicsBodyType = Phaser.Physics.P2JS;

    malos = game.add.group();
    malos.enableBody = true;    
    malos.physicsBodyType = Phaser.Physics.P2JS;

    tokens = game.add.group();
    tokens.enableBody = true;
    tokens.physicsBodyType = Phaser.Physics.P2JS;


    //Physics
    game.physics.startSystem(Phaser.Physics.P2JS); 
    game.physics.p2.setImpactEvents(true);   
    game.physics.p2.defaultRestitution = 0.8;
    PlayerColGroup = game.physics.p2.createCollisionGroup();
    EnemyColGroup = game.physics.p2.createCollisionGroup();
    ShieldColGroup = game.physics.p2.createCollisionGroup();
    SpikeColGroup = game.physics.p2.createCollisionGroup();
    TokensColGroup = game.physics.p2.createCollisionGroup();

    game.physics.p2.updateBoundsCollisionGroup();

    //physics on player
    game.physics.p2.enable(cubo);
    cubo.body.setZeroDamping();
    cubo.body.fixedRotation = true;
    cubo.body.setCollisionGroup(PlayerColGroup);
    cubo.body.collides(EnemyColGroup, pierdo_hp, this);
    cubo.body.collides(TokensColGroup, collect_token, this);
    
       
    //Score keeping
    scoreLabel = game.add.text(40,35, '$0',{font: "30px Courier",fill: '#ffffff'});
    scoreLabel.setTextBounds(10, 10, 700, 700);
    scoreLabel.align = "left";
    scoreLabel.boundsAlignH = "left";
    scoreLabel.boundsAlignV = "top";
    scoreLabel.setShadow(3,3,'rgba(0,0,0,0.5)',5);

    set_levels_base();
    
    //HP
    for (var i = 0; i < max_hp; i++){
        var hp1 = game.add.sprite(50+i*32, 80,'hp_bar');
        hp1.alpha = 0.8;
        hp1.frame = 0;
        hp_bar.push(hp1);
    }

    /*
    hpLabel = game.add.text(40,35, 'HP: ' + hp,{font: "30px Courier",fill: '#ffffff'});
    hpLabel.setTextBounds(10, 35, 700, 700);
    hpLabel.align = "left";
    hpLabel.boundsAlignH = "left";
    hpLabel.boundsAlignV = "top";
    hpLabel.setShadow(3,3,'rgba(0,0,0,0.5)',5);
    */

    if(localStorage.getItem("tokens") == null){
        current_tokens = 0;
    }
    else{
        current_tokens = parseInt(localStorage.getItem("tokens"));  
    }

    token_sym_1 = game.add.sprite(650,50, 'token');
    token_disp_label_2 = game.add.text(690, 55, "x"+current_tokens, { font: '25px Courier', fill: '#ffffff'});

    //Keyboard
    cursors = game.input.keyboard.createCursorKeys();  

    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.D);    
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.D);
    xkey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    tkey = game.input.keyboard.addKey(Phaser.Keyboard.T);

    xkey.onDown.add(sacar_pausa,this);
    //tkey.onDown.add(toggle_music,this);
    spacebar.onDown.add(create_shield, this);

    game.input.onDown.add(shop, self);

    //inicia ciclo enemigos
    timer_prueba = game.time.create(false);
    timer_prueba.loop(frecuencia_enemigos, function(){
        ciclos_enemigos++;
        comenzar_enemigos(Math.floor(Math.log(ronda)));
    }, this);

    timer_prueba.start();
	game.time.events.add(2000, generar_tokens, this);

    var wave_name = game.add.text(400, 400, 'Wave '+ ronda, { font: '25px Courier', fill: '#ffffff' });
    wave_name.anchor.setTo(0.5, 0.5);
    wave_name.align = "center";

    game.add.tween(wave_name).to( { alpha: 0 }, 2000, "Linear", true);
    setTimeout(function (){
        wave_name.destroy();
    },2000);
}

function set_levels_base(){

    if(localStorage.getItem("start_shield_scale_level") == null){
        shield_scale = 2; 
        shield_price = 20;
        shield_scale_level = 1;
        localStorage.setItem("start_shield_scale_level", "1");
    }
    else{
        shield_scale_level = parseInt(localStorage.getItem("start_shield_scale_level"));
        shield_scale = 2;
        shield_price = 20;
        for(var i = 1; i < shield_scale_level; i++){
            if(shield_scale < 4){
                shield_price = 2*shield_price;
            }
            else{
                shield_price = 4*shield_price;
            }
            shield_scale = shield_scale*1.13;            
        }        
    }

    if(localStorage.getItem("start_shield_duration_level") == null){
        shield_duration = 1000;
        shield_duration_level = 1;
        shield_price_dur = 20;
        localStorage.setItem("start_shield_duration_level", "1");
    }
    else{
        shield_duration_level = parseInt(localStorage.getItem("start_shield_duration_level"));
        shield_duration = 1000;
        shield_price_dur = 20;

        for(var i = 1; i < shield_duration_level; i++){
            if(shield_duration < 4000){
                shield_price_dur = 3*shield_price_dur;
            }
            else{
                shield_price_dur = 5*shield_price_dur;
            }
            shield_duration = shield_duration * 1.2;
        }
    }

    if(localStorage.getItem("start_shield_cooldown_level") == null){
        shield_cooldown = 3000;
        shield_cooldown_level = 1;
        shield_price_CD = 20;
        localStorage.setItem("start_shield_cooldown_level", "1");
    }
    else{
        shield_cooldown_level = parseInt(localStorage.getItem("start_shield_cooldown_level"));
        shield_cooldown = 3000;
        shield_price_CD = 20;

        for(var i = 1; i < shield_cooldown_level; i++){
            shield_price_CD = 2*shield_price_CD;
            shield_cooldown-= 300;
        }
    }

    if(localStorage.getItem("start_spike_pierce_level") == null){
        spikes_hp = 1;
        spike_pierce_price = 20;
        spike_pierce_level = 1;
        localStorage.setItem("start_spike_pierce_level", "1");
    }
    else{
        spike_pierce_level = parseInt(localStorage.getItem("start_spike_pierce_level"));
        spikes_hp = 1;
        spike_pierce_price = 20;

        for(var i = 1; i < spike_pierce_level; i++){            
            if(spikes_hp < 4){
                spike_pierce_price = 2*spike_pierce_price;
            }
            else{
                spike_pierce_price = 4*spike_pierce_price;
            }
            spikes_hp++;
        }
    }
       
    if(localStorage.getItem("start_spike_count_level") == null){
        create_spike();
        spike_count_price = 20;
        spike_count_level = 1;
        localStorage.setItem("start_spike_count_level", "1");
    }
    else{
        spike_count_level = parseInt(localStorage.getItem("start_spike_count_level"));
        spike_count_price = 20;
        create_spike();

        for(var i = 1; i < spike_count_level; i++){            
            if(spikes.total < 4){
                spike_count_price = 2*spike_count_price;
            }
            else{
                spike_count_price = 4*spike_count_price;
            }
            create_spike();
        }
    }

    if(localStorage.getItem("start_max_hp_level") == null){
        max_hp = 3;  
        hp = 3;        
        max_hp_price = 500;
        max_hp_level = 1;
        localStorage.setItem("start_max_hp_level", "1");
    }
    else{
        max_hp_level = parseInt(localStorage.getItem("start_max_hp_level"));
        max_hp = 3; 
        max_hp_price = 500;

        for(var i = 1; i < max_hp_level; i++){
            max_hp_price = 4*max_hp_price;            
            max_hp++;
        }

        hp = max_hp;
    }

}

function pierdo_hp(body1,body2){
    if(!body2.hasCollided)
    {        

        //console.log('en funcion pierdo hp');
        body2.hasCollided = true;

        //determinar que pasa con el malo
        switch(true){

            case(body2.hp == 5):

                body2.sprite.loadTexture('m_6');
                body2.clearShapes();
                body2.loadPolygon('physicsData', 'm6');
                body2.hp = 4;
                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 100);
                
                //accelerateToObject(body2, cubo, -5000);

                setTimeout(function(){
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                },50);

                break;

            case(body2.hp == 4):

                body2.sprite.loadTexture('m_5');
                body2.clearShapes();
                body2.loadPolygon('physicsData', 'm5');
                body2.hp = 3;
                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 100);
                
                //accelerateToObject(body2, cubo, -5000);

                setTimeout(function(){
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                },50);

                break;

            case(body2.hp == 3):
                body2.sprite.loadTexture('m_4');
                body2.clearShapes();
                body2.setRectangle(45,45);
                body2.hp = 2;
                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 100);
                
                //accelerateToObject(body2, cubo, -5000);

                setTimeout(function(){
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                },50);

                break;

            case(body2.hp == 2):

                body2.sprite.loadTexture('m_3');
                body2.clearShapes();
                body2.loadPolygon('physicsData', 'm3');
                body2.hp = 1;
                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 100);
                
                //accelerateToObject(body2, cubo, -5000);

                setTimeout(function(){
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                },50);

                break;

            default:
                body2.sprite.kill();
                vivos--;
                break;

        }
        
        if(vulnerable == 1){
            vulnerable = 0;
            hp-=1;
            update_hp(hp);

            cubo.tint = 0xff8f8f; 

            hurt_loop = game.time.create(false);
            hurt_loop.loop(150, function(){
                if(cubo.alpha == 0.5){
                    cubo.alpha = 1;
                }
                else{
                    cubo.alpha = 0.5;
                }
            }, this);
            hurt_loop.start();


            setTimeout(function(){
                hurt_loop.pause();
                hurt_loop.destroy();
                vulnerable = 1;
                cubo.alpha = 1;
                cubo.tint = 0xFFFFFF;
            },1000);
        }

        //hpLabel.text = "HP: " + hp;
        score+=5;
        final_score+=5;

        if(hp<=0){
            game.stage.backgroundColor= 'rgba(255,151,151,50)';
            cubo.tint = 0xFFFFFF; 
            game.paused = true;
            
            if(localStorage.getItem("max_wave") == null){
            	cur_max_wave = 1;
            }
            else{
            	cur_max_wave = parseInt(localStorage.getItem("max_wave"));
            }
            

            if(ronda > cur_max_wave){
            	localStorage.setItem("max_wave", (ronda-1).toString());
            	console.log("max_wave = " + localStorage.getItem("max_wave"));
            }
            

            setTimeout(function(){  
            game.paused = false;
            game.stage.backgroundColor = 'rgb(0,0,0)';
            game.state.start('gameover'); 
            timer_prueba.remove();        
            },3000); 
        }

    }
}

function update_hp(current_hp){
    for (var i = 0; i < (max_hp-current_hp); i++) {
        hp_bar[max_hp-1-i].frame = 1;
    }
}

function collect_token(body1, body2){

	if(!body2.hasCollided)
    {   
    	hay_token = 0;
        var txt_x = body2.sprite.position.x;
        var txt_y = body2.sprite.position.y;
    	body2.hasCollided = true;
		body2.sprite.kill();

        var txt_collected = game.add.text(txt_x, txt_y, '+1', { font: '25px Courier', fill: '#ffffff' });
        game.add.tween(txt_collected).to({y: txt_y-50, alpha: 0}, 2000, 'Linear', true, 0);

        setTimeout(function(){
            txt_collected.destroy();
        }, 2100);

	}

	if(localStorage.getItem("tokens") == null)
	{
		tok = 1;
	}
	else{
		tok = parseInt(localStorage.getItem("tokens"));
		console.log("tenia " + tok);
		tok+=1;
	}

	localStorage.setItem("tokens", tok.toString());
	console.log("guardados "+tok);

    token_disp_label_2.text = "x"+tok;	

}

function escudo_mata(body1, body2){
    if(!body2.hasCollided)
    {        
        //console.log('en funcion pierdo hp');
        body2.hasCollided = true;
        
        switch(true){

            case(body2.hp == 5):

                body2.sprite.loadTexture('m_6');
                body2.clearShapes();
                body2.loadPolygon('physicsData', 'm6');
                body2.hp = 4;
                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 50*shield_scale);
                
                //accelerateToObject(body2, cubo, -5000);

                setTimeout(function(){
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                },50);

                break;

            case(body2.hp == 4):

                body2.sprite.loadTexture('m_5');
                body2.clearShapes();
                body2.loadPolygon('physicsData', 'm5');
                body2.hp = 3;
                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 50*shield_scale);
                
                //accelerateToObject(body2, cubo, -5000);

                setTimeout(function(){
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                },50);

                break;

            case(body2.hp == 3):
                body2.sprite.loadTexture('m_4');
                body2.clearShapes();
                body2.setRectangle(45,45);
                body2.hp = 2;
                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 50*shield_scale);
                
                //accelerateToObject(body2, cubo, -5000);

                setTimeout(function(){
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                },50);

                break;

            case(body2.hp == 2):

                body2.sprite.loadTexture('m_3');
                body2.clearShapes();
                body2.loadPolygon('physicsData', 'm3');
                body2.hp = 1;
                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 50*shield_scale);
                
                //accelerateToObject(body2, cubo, -5000);

                setTimeout(function(){
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                },50);

                break;

            default:
                body2.sprite.kill();
                vivos--;
                break;

        }

        score+=5; 
        final_score+=5;      
    }

}

function spike_vs_malo(body1, body2){

    if(!body2.hasCollided && body1.sprite.alpha == 1)
    {        
        body1.hp--;
        if(body1.hp == 0){
            body1.sprite.alpha = 0.2;
            body1.clearShapes();
            setTimeout(function(){
                body1.sprite.alpha = 1;
                body1.hp = spikes_hp;

                body1.setCircle(13);
                body1.setCollisionGroup(SpikeColGroup);
                body1.collides(EnemyColGroup, spike_vs_malo, this);
            }
            ,spike_timeout);
        }
        body2.hasCollided = true;
        
        switch(true){

            case(body2.hp == 5):

                body2.sprite.loadTexture('m_6');
                body2.clearShapes();
                body2.loadPolygon('physicsData', 'm6');
                body2.hp = 4;

                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 220);
                
                //accelerateToObject(body2, cubo, -500);

                setTimeout(function(){
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                },50);

                break;

            case(body2.hp == 4):

                body2.sprite.loadTexture('m_5');
                body2.clearShapes();
                body2.loadPolygon('physicsData', 'm5');
                body2.hp = 3;

                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 220);
                
                //accelerateToObject(body2, cubo, -500);

                setTimeout(function(){
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                },50);

                break;

            case(body2.hp == 3):
                body2.sprite.loadTexture('m_4');
                body2.clearShapes();
                body2.setRectangle(45,45);
                body2.hp = 2;

                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 220);
                
                //accelerateToObject(body2, cubo, -500);

                setTimeout(function(){
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                },50);

                break;

            case(body2.hp == 2):

                body2.sprite.loadTexture('m_3');
                body2.clearShapes();
                body2.loadPolygon('physicsData', 'm3');
                body2.hp = 1;

                var bounce = game.physics.p2.createDistanceConstraint(cubo, body2.sprite, 220);
                
                //accelerateToObject(body2, cubo, -500);

                setTimeout(function(){
                    body2.setCollisionGroup(EnemyColGroup);
                    body2.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);
                    body2.hasCollided = false;
                    game.physics.p2.removeConstraint(bounce);
                    bounce = null;
                },50);

                break;

            default:
                body2.sprite.kill();
                vivos--;
                break;

        }

        score+=5; 
        final_score+=5;      
    }


}

function generar_tokens(){
	if(comprando == 0){
		var tok_x = game.rnd.integerInRange(40, 760);
		var tok_y = game.rnd.integerInRange(40, 760);

	    //para que no te aparezcan malos encima
	    while(Math.abs(tok_x - cubo.position.x) <= 150){
	    	tok_x = game.rnd.integerInRange(40, 760);
	    }

	    while(Math.abs(tok_y - cubo.position.y) <= 150){
	    	tok_y = game.rnd.integerInRange(40, 760);
	    }

	    var token_gen = tokens.create(tok_x, tok_y, 'token');
	    token_gen.body.clearShapes();
	    token_gen.body.setCircle(17);

	    token_gen.body.setCollisionGroup(TokensColGroup);
	    token_gen.body.collides(PlayerColGroup);

	    game.add.tween(token_gen).to ({alpha: 0.05}, 4900, 'Linear', true, 0); 

	    hay_token = 1;
	    game.time.events.add(5000, function(){
	    	if(hay_token == 1)
	    	{
	    		token_gen.kill();
	    	}
	    },this);

	    game.time.events.add(game.rnd.integerInRange(10000,20000), generar_tokens, this);
	}
	else{
		game.time.events.add(game.rnd.integerInRange(2000, 6000), generar_tokens, this);
	}
	
}

function comenzar_enemigos(cuantos){    

    if(cuantos>0){
        comenzar_enemigos(cuantos-1);
    }

    var lado = game.rnd.integerInRange(1,4);

    //para que no te aparezcan malos encima
    if(lado == 1 && cubo.position.x <= 150){
        console.log('cambio lado 1 -> 3');
        lado = 3;
    }
    else if(lado == 3 && cubo.position.x >=650){
        console.log('cambio lado 3 -> 1');
        lado = 1;
    }

    if(lado == 2 && cubo.position.y <= 150){
        console.log('cambio lado 2 -> 4');
        lado = 4;
    }
    else if(lado == 4 && cubo.position.y >= 650){
        console.log('cambio lado 4 -> 2');
        lado = 2;
    }


    //console.log(lado);
    

    if(ciclos_enemigos>prox_dificultad){
        console.log('prox y c enemigos:' + prox_dificultad + ' ' + ciclos_enemigos);
        ciclos_enemigos = 0;
        prox_dificultad = 1.05*prox_dificultad;
        mas_rapido();
    }

    //determinar que malo sale

    var shape = 'm_3';
    var m_hp = 1;

    var r_local = ronda;
    switch(true){
        case (r_local < 3):
            shape = 'm_3';
            m_hp = 1;
            break;

        case (r_local >= 3 &&  r_local < 9):
            if(game.rnd.integerInRange(1,100) < r_local*10){
                shape = 'm_4';
                m_hp = 2;
            }
            else{
                shape = 'm_3';
                m_hp = 1;
            }

            break;


        case (r_local >= 9 &&  r_local < 15):
            var a = game.rnd.integerInRange(1,100);
            if(a < 4*r_local){
                shape = 'm_5';
                m_hp = 3;
            }
            else if(a >= 4*r_local && a < 7*r_local){
                shape = 'm_4';
                m_hp = 2;
            }
            else{
                shape = 'm_3';
                m_hp = 1;
            }
            break;


        case (r_local >= 15 &&  r_local < 28):
            var a = game.rnd.integerInRange(1,100);
            if(a < 2.5*r_local){
                shape = 'm_6';
                m_hp = 4;
            }
            else if(a >= 2.5*r_local && a < 4*r_local){
                shape = 'm_5';
                m_hp = 3;
            }
            else{
                shape = 'm_4';
                m_hp = 2;
            }
            break;

        default:
            console.log('default seleccion de tipo de enemigo, ronda = '+ r_local);
            //rlocal >= 28
            var a = game.rnd.integerInRange(1,100);
            if(a < 30){
                shape = 'm_7';
                m_hp = 5;
            }
            else if(a >= 30 && a < 75){
                shape = 'm_6';
                m_hp = 4;
            }
            else{
                shape = 'm_5';
                m_hp = 3;
            }
            break;
    }

    switch(lado){
        case 1:
            var malo = malos.create(45,game.rnd.integerInRange(45,755), shape);
            break;
        case 2:
            var malo = malos.create(game.rnd.integerInRange(45,755),45, shape);
            break;
        case 3:
            var malo = malos.create(755,game.rnd.integerInRange(45,755), shape);
            break;
        default:
            var malo = malos.create(game.rnd.integerInRange(45,755),755, shape);
            break;

    }

    //definir poligono
    switch(m_hp){
        case 1:
            malo.body.clearShapes();
            malo.body.loadPolygon('physicsData', 'm3');
            malo.body.hp = 1;
            break;
        case 2:
            malo.body.setRectangle(45,45);
            malo.body.hp = 2;
            //console.log('malo con hp = ' + malo.body.hp);
            break;
        case 3:
            malo.body.clearShapes();
            malo.body.loadPolygon('physicsData', 'm5');
            malo.body.hp = 3;
            break;
        case 4:
            malo.body.clearShapes();
            malo.body.loadPolygon('physicsData', 'm6');
            malo.body.hp = 4;
            break;
        default:
            malo.body.clearShapes();
            malo.body.loadPolygon('physicsData', 'm7');
            malo.body.hp = 5;
            break;
    }
    

    vivos++;
    malo.body.setCollisionGroup(EnemyColGroup);
    malo.body.collides([PlayerColGroup, ShieldColGroup, SpikeColGroup]);

}

function mas_rapido(){
    timer_prueba.pause();
    timer_prueba.destroy();
    frecuencia_enemigos = Math.ceil(frecuencia_enemigos/1.01);
    ronda++;

    ronda_lista = 1;
    console.log('ronda = '+ronda);    
}

function mover_malos (malo) { 
     accelerateToObject(malo,cubo,150);  //start accelerateToObject on every bullet
}

function accelerateToObject(obj1, obj2, speed) {
    //if (typeof speed === 'undefined') { speed = 30; }
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    //obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
    obj1.body.force.y = Math.sin(angle) * speed;
}



function create_shield(){
    if(shield_in_use == 0){
        //console.log('scale: '+shield_scale+' CD: '+shield_cooldown+' Duration: '+shield_duration);
        shield_in_use = 1;
        shield = shields.create(cubo.position.x, cubo.position.y, 'circulo');
        shield.alpha = 0.7;
        shield.scale.setTo(shield_scale,shield_scale);
        shield.body.setCircle(shield_scale*25);
        shield.body.setCollisionGroup(ShieldColGroup);
        shield.body.collides(EnemyColGroup, escudo_mata, this);

        game.add.tween(shield).to ({alpha: 0.15}, shield_duration, 'Linear', true, 0); 
 

        setTimeout(function(){            
            shield.destroy();  
            Cooldown_bar = game.add.sprite(cubo.position.x, cubo.position.y - 25, 'CD_bar');
            Cooldown_bar.anchor.setTo(0.5);
            game.add.tween(Cooldown_bar.scale).to ({x: 0.01}, shield_cooldown, 'Linear', true, 0);      

            setTimeout(function() {
                shield_in_use = 0;                  
                Cooldown_bar.destroy(); 
                Cooldown_bar = null;              
            }, shield_cooldown); 

        },shield_duration);
    }
}

function create_spike(){
    var spike = spikes.create(game.rnd.integerInRange(50,750), game.rnd.integerInRange(50,750), 'spike');

    spike.body.setCircle(13);
    spike.body.hp = spikes_hp;
    spike.body.collideWorldBounds = false;

    spike.body.setCollisionGroup(SpikeColGroup);
    spike.body.collides(EnemyColGroup, spike_vs_malo, this);
    var spike_dist = game.physics.p2.createDistanceConstraint(cubo, spike, 150);

}

function pausar(){

    //game.paused = true;
    comprando = 1;
    timer_prueba.pause();

    // inicio menu de pausa 
    fondo = game.add.sprite(0,0,'fondo_pausa');
    fondo.alpha = 0.2;

    escudo = game.add.sprite(120,220,'circulo');
    escudo.scale.setTo(2, 2);
    escudo2 = game.add.sprite(120,350,'circulo');
    escudo2.scale.setTo(2, 2);
    escudo3 = game.add.sprite(120,480,'circulo');
    escudo3.scale.setTo(2, 2);

    spike1 = game.add.sprite(380, 220, 'sh_sp');
    spike2 = game.add.sprite(380, 350, 'sh_sp');
    mas_hp = game.add.sprite(385, 490, 'cubito');
    mas_hp.scale.setTo(2);



    escudo_size = game.add.text(90, 315, 'Shield Size: $'+ shield_price, { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });  
    escudo_time = game.add.text(70, 445, 'Shield Duration: $'+ shield_price_dur, { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });  
    
    if(shield_cooldown == 600){
        escudo_CD   = game.add.text(70, 575, 'Shield Cooldown Maxed', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });
    }
    else{
        escudo_CD   = game.add.text(70, 575, 'Shield Cooldown: $'+ shield_price_CD, { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });
    }
            
    spike_cuantos = game.add.text(350, 315, 'Spike Count: $'+ spike_count_price, { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });  
    spike_pierce = game.add.text(350, 445, 'Spike Pierce: $'+ spike_pierce_price, { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });
    max_hp_text = game.add.text(320, 575, 'Increase Max HP: $'+ max_hp_price, { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });


    back_to_game = game.add.text(400,650, 'Click to buy upgrades',{ font: '25px Courier', fill: '#ffffff' } )
    back_to_game.anchor.setTo(0.5, 0.5);
    back_to_game.align = "center";    

    back_to_game2 = game.add.text(400,685, 'Press s to finish shopping.',{ font: '25px Courier', fill: '#ffffff' } )
    back_to_game2.anchor.setTo(0.5, 0.5);
    back_to_game2.align = "center"; 

}

function sacar_pausa(){
    if(comprando == 1){      

        //game.paused = false;
        comprando = 0;
        timer_prueba.resume();

        fondo.destroy();
        escudo.destroy();
        escudo2.destroy();
        escudo3.destroy();

        spike1.destroy();
        spike2.destroy();
        mas_hp.destroy();

        escudo_size.destroy();
        escudo_time.destroy();
        escudo_CD.destroy();
        back_to_game.destroy();
        back_to_game2.destroy();
        spike_cuantos.destroy();
        spike_pierce.destroy();
        max_hp_text.destroy();

        timer_prueba = game.time.create(false);
        timer_prueba.loop(frecuencia_enemigos, function(){
            ciclos_enemigos++;
            comenzar_enemigos(Math.floor(Math.log(ronda)));
        }, this);
        timer_prueba.start();
        ronda_lista = 0;

        var wave_name = game.add.text(400, 400, 'Wave '+ ronda, { font: '25px Courier', fill: '#ffffff' });
        wave_name.anchor.setTo(0.5, 0.5);
        wave_name.align = "center";

        game.add.tween(wave_name).to( { alpha: 0 }, 2000, "Linear", true);
        setTimeout(function (){
            wave_name.destroy();
        },2000);
    }
}

function shop(event){
    if(comprando == 1){

        if(event.x>120 && event.x<200 && event.y>220 && event.y<300 ){
            //significa que el click está en donde puse el boton de mejorar scale de escudo
            if(score >= shield_price){
                shield_scale = shield_scale*1.13;
                score-= shield_price;

                if(shield_scale < 4){
                    shield_price = 2*shield_price;
                }
                else{
                    shield_price = 4*shield_price;
                }

                escudo_size.text = 'Shield Size: $'+ shield_price;
                scoreLabel.text = '$'+score;
            }
            else{
                var cash = game.add.text(250, 700, 'Not enough coins', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
                setTimeout(function(){cash.destroy();}, 500);
            }

        }
        else if(event.x>120 && event.x<200 && event.y>350 && event.y<430){
            if(score >= shield_price_dur){
                shield_duration = shield_duration*1.2;
                score-= shield_price_dur;

                if(shield_duration < 4000){
                    shield_price_dur = 3*shield_price_dur;
                }
                else{
                    shield_price_dur = 5*shield_price_dur;
                }
                
                escudo_time.text = 'Shield Duration: $'+ shield_price_dur;
                scoreLabel.text = '$'+score;
            }
            else{
                var cash = game.add.text(250, 700, 'Not enough coins', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
                setTimeout(function(){cash.destroy();}, 500);
            }

        }
        else if(event.x>120 && event.x<200 && event.y>480 && event.y<560){
            if(score >= shield_price_CD && shield_cooldown > 600){
                shield_cooldown -= 300;
                score-= shield_price_CD;
                shield_price_CD = 2*shield_price_CD;
                escudo_CD.text = 'Shield Cooldown: $'+ shield_price_CD;
                scoreLabel.text = '$'+score;
            }
            else{
                if(shield_cooldown == 600){
                    var maxed = game.add.text(250, 700, 'Shield Cooldown maxed', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
                    setTimeout(function(){maxed.destroy();}, 500);
                }
                else{
                    var cash = game.add.text(250, 700, 'Not enough coins', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
                    setTimeout(function(){cash.destroy();}, 500);
                }
                
            }

        }
        else if(event.x>350 && event.x<430 && event.y>220 && event.y<300 ){
            //significa que el click está en donde puse el boton de mejorar scale de escudo
            if(score >= spike_count_price){
                create_spike();                
                score-= spike_count_price;

                if(spikes.total < 4){
                    spike_count_price = 2*spike_count_price;
                }
                else{
                    spike_count_price = 4*spike_count_price;
                }

                spike_cuantos.text = 'Spike Count: $'+ spike_count_price;
                scoreLabel.text = '$'+score;
            }
            else{
                var cash = game.add.text(250, 700, 'Not enough coins', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
                setTimeout(function(){cash.destroy();}, 500);
            }

        }
        else if(event.x>350 && event.x<430 && event.y>350 && event.y<430){
            if(score >= spike_pierce_price){
                spikes_hp++;
                score-= spike_pierce_price;

                if(spikes_hp < 4){
                    spike_pierce_price = 2*spike_pierce_price;
                }
                else{
                    spike_pierce_price = 4*spike_pierce_price;
                }
                
                spike_pierce.text = 'Spike Pierce: $'+ spike_pierce_price;
                scoreLabel.text = '$'+score;
            }
            else{
                var cash = game.add.text(250, 700, 'Not enough coins', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
                setTimeout(function(){cash.destroy();}, 500);
            }

        }
        else if(event.x>350 && event.x<430 && event.y>480 && event.y<560){
            if(score >= max_hp_price && max_hp < 8){
                max_hp++;
                hp = max_hp;
                score-= max_hp_price;

                var hp1 = game.add.sprite(50+(max_hp-1)*32, 80,'hp_bar');
                hp1.alpha = 0.8;
                hp1.frame = 0;
                hp_bar.push(hp1);

                //llena el hp
                for (var i = 0; i < max_hp; i++) {
                    hp_bar[i].frame = 0;
                }

                max_hp_price = 4*max_hp_price;

                max_hp_text.text = 'Increase Max HP: $'+ max_hp_price;
                scoreLabel.text = '$'+score;
            }
            else{
                if(max_hp == 8){
                    var maxed = game.add.text(300, 700, 'HP maxed', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
                    setTimeout(function(){maxed.destroy();}, 500);
                }
                else{
                    var cash = game.add.text(250, 700, 'Not enough coins', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
                    setTimeout(function(){cash.destroy();}, 500);
                }
                
            }

        }


    }
}

function toggle_music(){
    if(music.mute == true){
        music.mute = false;
    }
    else{
        music.mute = true;
    }
}

function update() {

    //movimiento
    cubo.body.setZeroVelocity();

    if (cursors.up.isDown) {
        cubo.body.moveUp(speed);
        direccion = 2;
        //result = 'arriba';
    }
    else if (cursors.down.isDown) {
        cubo.body.moveDown(speed);
        direccion = 4;
        //result = 'abajo';
    }

    if (cursors.left.isDown) {
        cubo.body.moveLeft(speed);
        direccion = 1;
        //result = 'izquierda';
    }
    else if (cursors.right.isDown) {
        cubo.body.moveRight(speed);      
        direccion = 3;
        //result = 'derecha';
    }


    //Shield encima del personaje
    if(shield_in_use == 1){
        // revisar como hacerlo con cubo.addChild(shield) al momento de crearlo
        shield.reset(cubo.position.x, cubo.position.y);
    }
    
    if(Cooldown_bar != null){ //shield_in_use == 0
        Cooldown_bar.position.x = cubo.position.x;
        Cooldown_bar.position.y = cubo.position.y - 35;
    }


    malos.forEachAlive(mover_malos,this);


    scoreLabel.text = '$'+score;

    if(ronda_lista == 1 && vivos == 0 && comprando == 0){
        pausar();
    }
}


function render() {
    game.debug.text(result, 32, 780);

}






