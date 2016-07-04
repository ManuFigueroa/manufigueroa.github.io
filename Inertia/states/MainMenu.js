var mainmenu = {
    create: create,
    start: start
};


var mute;
var max_wave;
var start_wave = 1;
var wave_label;
var comprando_tokens = 0;
var current_tokens = 0;


function create() {
    console.log('Menu ver 3.42');    

    /*===========================*/
    /*TESTING*/
    //localStorage.clear();

    /*FIN TESTING*/
    /*===========================*/

    loading_label.destroy();
    //var namelabel = game.add.text(400, 200, 'INERTIA', { font: '50px Courier', fill: '#ffffff', boundsAlignH: 'center' });
    titulo = game.add.sprite(400,300, 'titulo');
    titulo.anchor.setTo(0.5, 0.5);

    cubo_titulo = game.add.sprite(590, 240, 'cubito');
    cubo_titulo.anchor.set(0.5);
    still_titulo = cubo_titulo.animations.add('still');
    cubo_titulo.animations.play('still', 8, true);

    var pressStart = game.add.text(400, 600, 'Press s to start', { font: '25px Courier', fill: '#ffffff' });
    var music_text = game.add.text(600, 38, 'press t to mute/unmute',{ font: '12px Courier', fill: '#ffffff' } );
    

    pressStart.anchor.setTo(0.5, 0.5);
    pressStart.align = "center";

    var boton_instrucciones = game.add.sprite(400, 650, 'instrucciones');
    boton_instrucciones.anchor.setTo(0.5,0.5);
    boton_instrucciones.inputEnabled = true;
    boton_instrucciones.events.onInputDown.add(mostrar_instrucciones,this);

    if(localStorage.getItem("max_wave") == null)
    {
        max_wave = 0;  
    }
    else{
        max_wave = parseInt(localStorage.getItem("max_wave"));
        console.log('max wave =' + max_wave);
    }   


    if(max_wave>1){
        var selectlevel = game.add.text(550, 450, 'Select starting wave', { font: '25px Courier', fill: '#ffffff'});
        selectlevel.anchor.setTo(0.5, 0.5);
        selectlevel.align = "center";

        start_wave = max_wave;
        wave_label = game.add.text(550, 500, max_wave, { font: '25px Courier', fill: '#ffffff'})
        wave_label.anchor.setTo(0.5, 0.5);
        wave_label.align = "center";

        var mas_lvl = game.add.sprite(580, 490, 'mas');
        mas_lvl.scale.setTo(0.7);
        var menos_lvl = game.add.sprite(490, 490, 'menos');
        menos_lvl.scale.setTo(0.7);

        mas_lvl.inputEnabled = true;
        mas_lvl.events.onInputDown.add(subir_wave, this);
        menos_lvl.inputEnabled = true;
        menos_lvl.events.onInputDown.add(bajar_wave, this);

        var token_shop = game.add.sprite(235, 500, 'token');
        token_shop.anchor.setTo(0.5,0.5);
        token_shop.position.x = 235;
        token_shop.position.y = 500;
        game.stage.smoothed = false;
        token_shop.scale.setTo(1.5);

        token_shop.inputEnabled = true;
        token_shop.events.onInputDown.add(abrir_tienda, this);

        token_shop_label = game.add.text(240, 455, 'Token shop', { font: '25px Courier', fill: '#ffffff'})
        token_shop_label.anchor.setTo(0.5, 0.5);
        token_shop_label.align = "center";

        definir_precios();
    }

    if(localStorage.getItem("tokens") == null){
        current_tokens = 0;
    }
    else{
        current_tokens = parseInt(localStorage.getItem("tokens"));  
    }

    token_sym_1 = game.add.sprite(650,70, 'token');
    token_disp_label_2 = game.add.text(690, 75, "x"+current_tokens, { font: '25px Courier', fill: '#ffffff'});
    
    var menos = game.add.sprite(650, 20, 'menos');
    menos.scale.setTo(0.5);
    mute = game.add.sprite(685, 20, 'mute');
    mute.scale.setTo(0.5);
    var mas = game.add.sprite(720, 20, 'mas');
    mas.scale.setTo(0.5);
    
    if(BasicGame.music == null){
        BasicGame.music  = game.add.audio('bgm1', 1, true);
        BasicGame.music.play();
        BasicGame.music.mute = false;
        BasicGame.music.volume = 1;
    }    

    mas.inputEnabled = true;
    mas.events.onInputDown.add(subir_volumen, this);
    menos.inputEnabled = true;
    menos.events.onInputDown.add(bajar_volumen, this);
    mute.inputEnabled = true;
    mute.events.onInputDown.add(toggle_music, this);
    

    var xkey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    var tkey = game.input.keyboard.addKey(Phaser.Keyboard.T);
    xkey.onDown.add(this.start, this);
    tkey.onDown.add(toggle_music,this);
     
}

function subir_wave(){
    if(start_wave<max_wave){
        start_wave+=1;
        wave_label.text = start_wave;
    }    
}
function bajar_wave(){
    if(start_wave>1){
        start_wave-=1;
        wave_label.text = start_wave;
    }
}

function subir_volumen(){
    console.log('mas ' + BasicGame.music.volume);
    if(BasicGame.music.volume < 1){
        BasicGame.music.volume += 0.1;
    }    
}

function bajar_volumen(){
    //console.log('menos fuera if ');
    if(BasicGame.music.volume > 0.1){
        console.log('menos en if ' + BasicGame.music.volume);
        BasicGame.music.volume -= 0.1;
    }    
}
/*
function mutear(){
    if(music.mute == true){
        console.log('unmute');
        mute.frame = 0;
        music.mute = false;
        music.volume = 1;
    }
    else{
        console.log('mute');
        music.mute = true;
        mute.frame = 1;
        music.volume = 0;
    }
    
}
*/

function toggle_music(){
    if(BasicGame.music.mute == true){
        BasicGame.music.mute = false;
        mute.frame = 0;
    }
    else{
        BasicGame.music.mute = true;
        mute.frame = 1;
    }
}

function definir_precios(){

    if(localStorage.getItem("start_shield_scale_level") == null){
        shield_price_t = 100;
        shield_scale_level = 1;
        localStorage.setItem("start_shield_scale_level", "1");
    }
    else{
        shield_scale_level = parseInt(localStorage.getItem("start_shield_scale_level"));        
        shield_price_t = 100;
        for(var i = 1; i < shield_scale_level; i++){
            shield_price_t = shield_price_t*2;            
        }        
    }

    if(localStorage.getItem("start_shield_duration_level") == null){        
        shield_duration_level = 1;
        shield_price_dur_t = 100;
        localStorage.setItem("start_shield_duration_level", "1");
    }
    else{
        shield_duration_level = parseInt(localStorage.getItem("start_shield_duration_level"));
        
        shield_price_dur_t = 100;

        for(var i = 1; i < shield_duration_level; i++){
            shield_price_dur_t = 2*shield_price_dur_t;
        }
    }

    if(localStorage.getItem("start_shield_cooldown_level") == null){
        shield_cooldown_level = 1;
        shield_price_CD_t = 100;
        localStorage.setItem("start_shield_cooldown_level", "1");
    }
    else{
        shield_cooldown_level = parseInt(localStorage.getItem("start_shield_cooldown_level"));
        
        shield_price_CD_t = 100;

        for(var i = 1; i < shield_cooldown_level; i++){
            shield_price_CD_t = 2*shield_price_CD_t;
        }
    }

    if(localStorage.getItem("start_spike_pierce_level") == null){
        spike_pierce_price_t = 100;
        spike_pierce_level = 1;
        localStorage.setItem("start_spike_pierce_level", "1");
    }
    else{
        spike_pierce_level = parseInt(localStorage.getItem("start_spike_pierce_level"));
        spike_pierce_price_t = 100;

        for(var i = 1; i < spike_pierce_level; i++){
            spike_pierce_price_t = 2*spike_pierce_price_t;            
        }
    }
       
    if(localStorage.getItem("start_spike_count_level") == null){
        spike_count_price_t = 100;
        spike_count_level = 1;
        localStorage.setItem("start_spike_count_level", "1");
    }
    else{
        spike_count_level = parseInt(localStorage.getItem("start_spike_count_level"));
        spike_count_price_t = 100;

        for(var i = 1; i < spike_count_level; i++){
            spike_count_price_t = 2*spike_count_price_t;
        }
    }

    if(localStorage.getItem("start_max_hp_level") == null){        
        max_hp_price_t = 1000;
        max_hp_level = 1;
        localStorage.setItem("start_max_hp_level", "1");
    }
    else{
        max_hp_level = parseInt(localStorage.getItem("start_max_hp_level"));
        max_hp_price_t = 1000;

        for(var i = 1; i < max_hp_level; i++){
            max_hp_price_t +=1000;
        }
    }

}

function mostrar_instrucciones(){
    keys_guide = game.add.sprite(400,400, 'keys');
    keys_guide.anchor.setTo(0.5,0.5);

    keys_anim = keys_guide.animations.add('display');
    keys_guide.animations.play('display', 2, true);

    boton_cerrar_inst = game.add.sprite(630, 250, 'mas');
    boton_cerrar_inst.angle = 45;
    boton_cerrar_inst.inputEnabled = true;
    boton_cerrar_inst.events.onInputDown.add(cerrar_inst, this);

}

function cerrar_inst(){
    keys_guide.destroy();
    boton_cerrar_inst.destroy();
}

function abrir_tienda(){
    if(comprando_tokens == 0){
        if(localStorage.getItem("tokens") == null){
            current_tokens = 0;
        }
        else{
            current_tokens = parseInt(localStorage.getItem("tokens"));  
        }        
        //game.paused = true;
        comprando_tokens = 1;

        // inicio menu de pausa 
        fondo = game.add.sprite(0,0,'fondo_pausa');
        fondo.alpha = 0.99;

        token_sym = game.add.sprite(350,120, 'token');
       
        
        token_disp_label = game.add.text(390, 125, "x"+current_tokens, { font: '25px Courier', fill: '#ffffff'});

        escudo = game.add.sprite(120,220,'circulo');
        escudo.scale.setTo(2, 2);
        escudo.inputEnabled = true;
        escudo.events.onInputDown.add(mejorar_scale, this);

        escudo2 = game.add.sprite(120,350,'circulo');
        escudo2.scale.setTo(2, 2);
        escudo2.inputEnabled = true;
        escudo2.events.onInputDown.add(mejorar_duration, this);

        escudo3 = game.add.sprite(120,480,'circulo');
        escudo3.scale.setTo(2, 2);
        escudo3.inputEnabled = true;
        escudo3.events.onInputDown.add(mejorar_CD, this);

        spike1 = game.add.sprite(380, 220, 'sh_sp');
        spike1.inputEnabled = true;
        spike1.events.onInputDown.add(mejorar_cantidad, this);

        spike2 = game.add.sprite(380, 350, 'sh_sp');
        spike2.inputEnabled = true;
        spike2.events.onInputDown.add(mejorar_pierce, this);

        mas_hp = game.add.sprite(385, 490, 'cubito');
        mas_hp.scale.setTo(2);
        mas_hp.inputEnabled = true;
        mas_hp.events.onInputDown.add(mejorar_hp, this);

        boton_cerrar = game.add.sprite(750,50, 'mas');
        boton_cerrar.angle = 45;
        boton_cerrar.inputEnabled = true;
        boton_cerrar.events.onInputDown.add(cerrar_tienda, this);

        if(shield_scale_level > 7){
            escudo_size = game.add.text(60, 315, 'Shield Size: MAXED', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' }); 
        }
        else{
            escudo_size = game.add.text(60, 315, 'Shield Size: '+ shield_price_t +' tokens', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });  
        }

        if(shield_duration_level > 7){
            escudo_time = game.add.text(40, 445, 'Shield Duration: MAXED', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });  
        }
        else{
            escudo_time = game.add.text(40, 445, 'Shield Duration: '+ shield_price_dur_t+' tokens', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });  
        }
        
        
        if(shield_cooldown_level > 7){
            escudo_CD   = game.add.text(40, 575, 'Shield Cooldown: MAXED', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        else{
            escudo_CD   = game.add.text(40, 575, 'Shield Cooldown: '+ shield_price_CD_t+' tokens', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }

        if(spike_count_level > 7){
            spike_cuantos = game.add.text(320, 315, 'Spike Count: MAXED', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });  
        }
        else{
            spike_cuantos = game.add.text(320, 315, 'Spike Count: '+ spike_count_price_t+' tokens', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });  
        }
        
        if(spike_pierce_level > 7){
            spike_pierce = game.add.text(320, 445, 'Spike Pierce: MAXED', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        else{
            spike_pierce = game.add.text(320, 445, 'Spike Pierce: '+ spike_pierce_price_t+' tokens', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }        
        
        if(max_hp_level > 7){
            max_hp_text = game.add.text(310, 575, 'Increase Max HP: MAXED', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        else{
            max_hp_text = game.add.text(310, 575, 'Increase Max HP: '+ max_hp_price_t+' tokens', { font: '15px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }       


        back_to_game = game.add.text(400,650, 'Click to buy upgrades',{ font: '25px Courier', fill: '#ffffff' } )
        back_to_game.anchor.setTo(0.5, 0.5);
        back_to_game.align = "center";    

        back_to_game2 = game.add.text(400,685, 'Press s to finish shopping.',{ font: '25px Courier', fill: '#ffffff' } )
        back_to_game2.anchor.setTo(0.5, 0.5);
        back_to_game2.align = "center"; 
    }
}

function mejorar_scale(){
    if(current_tokens >= shield_price_t && shield_scale_level <= 7){
        shield_scale_level ++;
        current_tokens-= shield_price_t;

        localStorage.setItem("start_shield_scale_level", shield_scale_level.toString());
        localStorage.setItem("tokens", current_tokens.toString());

        definir_precios();

        if(shield_scale_level == 8){
            escudo_size.text = "Shield Size: MAXED";
        }
        else{
            escudo_size.text = 'Shield Size: '+ shield_price_t + " tokens";
        }

        token_disp_label.text = "x"+current_tokens;
        token_disp_label_2.text = "x"+current_tokens;
    }
    else{
        if(shield_scale_level >7){
            var cash = game.add.text(250, 700, 'Already maxed', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        else{
            var cash = game.add.text(250, 700, 'Not enough tokens', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        setTimeout(function(){cash.destroy();}, 500);
    }
}

function mejorar_duration(){
    if(current_tokens >= shield_price_dur_t && shield_duration_level <= 7){
        shield_duration_level ++;
        current_tokens-= shield_price_dur_t;

        localStorage.setItem("start_shield_duration_level", shield_duration_level.toString());
        localStorage.setItem("tokens", current_tokens.toString());

        definir_precios();

        if(shield_duration_level == 8){
            escudo_time.text = "Shield Duration: MAXED";
        }
        else{
            escudo_time.text = 'Shield Duration: '+ shield_price_dur_t + " tokens"; 
        }
        
        token_disp_label.text = "x"+current_tokens;
        token_disp_label_2.text = "x"+current_tokens;
    }
    else{
        if(shield_duration_level >7){
            var cash = game.add.text(250, 700, 'Already maxed', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        else{
            var cash = game.add.text(250, 700, 'Not enough tokens', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        
        setTimeout(function(){cash.destroy();}, 500);
    }
}

function mejorar_CD(){
    if(current_tokens >= shield_price_CD_t && shield_cooldown_level <= 7){
        shield_cooldown_level ++;
        current_tokens-= shield_price_CD_t;

        localStorage.setItem("start_shield_cooldown_level", shield_cooldown_level.toString());
        localStorage.setItem("tokens", current_tokens.toString());

        definir_precios();

        if(shield_cooldown_level == 8){
            escudo_CD.text = "Shield Cooldown: MAXED";
        }
        else{
            escudo_CD.text = 'Shield Cooldown: '+ shield_price_CD_t + " tokens"; 
        }
        
        token_disp_label.text = "x"+current_tokens;
        token_disp_label_2.text = "x"+current_tokens;
    }
    else{
        if(shield_cooldown_level >7){
            var cash = game.add.text(250, 700, 'Already maxed', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        else{
            var cash = game.add.text(250, 700, 'Not enough tokens', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        
        setTimeout(function(){cash.destroy();}, 500);
    }

}

function mejorar_cantidad(){
    if(current_tokens >= spike_count_price_t && spike_count_level <= 7){
        spike_count_level ++;
        current_tokens-= spike_count_price_t;

        localStorage.setItem("start_spike_count_level", spike_count_level.toString());
        localStorage.setItem("tokens", current_tokens.toString());

        definir_precios();

        if(spike_count_level == 8){
            spike_cuantos.text = "Spike Count: MAXED";
        }
        else{
            spike_cuantos.text = 'Spike Count: '+ spike_count_price_t + " tokens"; 
        }
        
        token_disp_label.text = "x"+current_tokens;
        token_disp_label_2.text = "x"+current_tokens;
    }
    else{
        if(spike_count_level >7){
            var cash = game.add.text(250, 700, 'Already maxed', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        else{
            var cash = game.add.text(250, 700, 'Not enough tokens', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        
        setTimeout(function(){cash.destroy();}, 500);
    }

}

function mejorar_pierce(){
    if(current_tokens >= spike_pierce_price_t && spike_pierce_level <= 7){
        spike_pierce_level ++;
        current_tokens-= spike_pierce_price_t;

        localStorage.setItem("start_spike_pierce_level", spike_pierce_level.toString());
        localStorage.setItem("tokens", current_tokens.toString());

        definir_precios();

        if(spike_pierce_level == 8){
            spike_pierce.text = "Spike Pierce: MAXED";
        }
        else{
            spike_pierce.text = 'Spike Pierce: '+ spike_pierce_price_t + " tokens"; 
        }
        
        token_disp_label.text = "x"+current_tokens;
        token_disp_label_2.text = "x"+current_tokens;
    }
    else{
        if(spike_pierce_level >7){
            var cash = game.add.text(250, 700, 'Already maxed', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        else{
            var cash = game.add.text(250, 700, 'Not enough tokens', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        
        setTimeout(function(){cash.destroy();}, 500);
    }
}

function mejorar_hp(){
    if(current_tokens >= max_hp_price_t && max_hp_level <= 7){
        max_hp_level ++;
        current_tokens-= max_hp_price_t;

        localStorage.setItem("start_max_hp_level", max_hp_level.toString());
        localStorage.setItem("tokens", current_tokens.toString());

        definir_precios();

        if(max_hp_level == 8){
            max_hp_text.text = "Increase Max HP: MAXED";
        }
        else{
            max_hp_text.text = 'Increase Max HP: '+ max_hp_price_t + " tokens"; 
        }
        
        token_disp_label.text = "x"+current_tokens;
        token_disp_label_2.text = "x"+current_tokens;
    }
    else{
        if(max_hp_level >7){
            var cash = game.add.text(250, 700, 'Already maxed', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        else{
            var cash = game.add.text(250, 700, 'Not enough tokens', { font: '25px Courier', fill: '#ffffff', boundsAlignH: 'center' });
        }
        
        setTimeout(function(){cash.destroy();}, 500);
    }
}

function cerrar_tienda(){
    if(comprando_tokens == 1){
        fondo.destroy();
        token_sym.destroy();
        token_disp_label.destroy();

        escudo.destroy();
        escudo2.destroy();
        escudo3.destroy();

        spike1.destroy();
        spike2.destroy();

        boton_cerrar.destroy();

        mas_hp.destroy();
        escudo_size.destroy();
        escudo_time.destroy();
        escudo_CD.destroy();
        spike_cuantos.destroy();
        spike_pierce.destroy();
        max_hp_text.destroy();
        back_to_game2.destroy();
        back_to_game.destroy();

        comprando_tokens = 0; 
    }
  
}

function start(){
    if(comprando_tokens == 1){
        cerrar_tienda();
    }
    else{
        game.add.tween(cubo_titulo).to({y: 400, x: 400}, 500, 'Linear', true, 0);
        game.add.tween(titulo).to({alpha:0}, 1800, 'Linear', true, 0);

        setTimeout(function(){
            game.state.start('game');
        },750);        
    }   
}

