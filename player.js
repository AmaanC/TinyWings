window.initPlayer = function (){
    'use strict';
    var player = {},
        ctx = document.getElementById('player').getContext('2d'),
        gravity = 9.8;

    player.x = window.playerX;
    player.y = 50;
    player.speed = 5; // The speed in the direction he's facing
    player.radius = 5;
    player.angle = 0;
    player.heaver = false;
    player.weight = 1;

    ctx.canvas.width = window.WIDTH;
    ctx.canvas.height = window.HEIGHT;
    var diameter = player.radius * 2;

    var playerImg = new Image();
    playerImg.src = 'circle.gif';

    window.drawPlayer = function (){
        ctx.clearRect(player.x - player.radius*2, 0, diameter*3, HEIGHT);
        ctx.beginPath();
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(player.angle);
        ctx.fillRect(0, 0, diameter, player.radius);
        ctx.arc(0, 0 - player.radius, player.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
        ctx.closePath();

        setTimeout(window.controlPlayer, 1000/window.FPS);
    };

    window.controlPlayer = function (){
        // player.y = window.yAtPlayerX;
        // window.speed = 4;// + Math.random() * 2;

        // if(player.y + gravity < window.yAtPlayerX){
        //     player.y += gravity;
        // }
        // else{
        //     player.y = window.yAtPlayerX;
        // }
        var old = player.y;
        if(player.heavier){
            player.angle += Math.PI / 90;
            player.weight = 1.5;
        }
        else{
            player.angle += Math.PI / 360;
            player.weight = 1;
        }

        if(player.angle > 80 * Math.PI / 180){
            player.angle = 80 * Math.PI / 180;
        }
        else if(player.angle < -70 * Math.PI / 180){
            player.angle = -70 * Math.PI / 180;
        }
        player.angle %= Math.PI;

        player.y += 1 + Math.sin(player.angle) * player.speed * player.weight;
        // console.log(player.y - old);
        window.speedX = Math.cos(player.angle) * player.speed;
        document.getElementById('speed').textContent = window.speedX;
        
        if(player.y >= window.yAtPlayerX){
            player.y = window.yAtPlayerX;
            if(player.angle > window.angleAtPlayerX){
                player.angle = window.angleAtPlayerX;
            }
        }
        window.drawPlayer();
    };

    document.body.addEventListener('mousedown', function (){
        player.heavier = true;
    }, false);
    document.body.addEventListener('mouseup', function (){
        player.heavier = false;
    }, false);

};