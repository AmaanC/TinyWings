window.initPlayer = function (){
    'use strict';
    var player = {},
        ctx = document.getElementById('player').getContext('2d'),
        gravity = 9.8,
        angleLimit = 60 * Math.PI / 180,
        speedMultiplier = 1;

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
    };

    window.controlPlayer = function (){
        // Calculate angle of the slope at the player's position
        if(window.listOfHills[window.hillAtPlayerX].x[currentPosIndex + 1]){
            window.angleAtPlayerX = Math.atan2(
                window.listOfHills[window.hillAtPlayerX].y[currentPosIndex + 1]
                - window.listOfHills[window.hillAtPlayerX].y[currentPosIndex],

                window.listOfHills[window.hillAtPlayerX].x[currentPosIndex + 1]
                - window.listOfHills[window.hillAtPlayerX].x[currentPosIndex]
            );
        }
        else{
            // This means they went through the valley of the hill, meaning they win a boost or something
            if(player.y >= window.yAtPlayerX){
                console.log('SWOOOSH!');
                speedMultiplier = 1.5;
            }
        }

        // --------------------------------------------------------------
        // If the hill and player touch, move the player back, and fix the angle
        if(player.y >= window.yAtPlayerX){
            player.y = window.yAtPlayerX;
            if(player.angle >= window.angleAtPlayerX){
                if(Math.abs(player.angle - window.angleAtPlayerX) > 45 * Math.PI / 180){
                    console.log('BOOM!');
                    speedMultiplier = 0.5;
                    player.angle = window.angleAtPlayerX - (player.angle - window.angleAtPlayerX) / 4;
                }
                else{
                    player.angle = window.angleAtPlayerX
                }
            }
        }
        else{
            if(speedMultiplier === 0.5){
                speedMultiplier = 1;
            }
            if(player.heavier){
                player.angle += Math.PI / 45;
                player.weight = 2;
            }
            else{
                player.angle += Math.PI / 360;
                player.weight = 1;
            }
        }

        // Keep it within these angles (facing only forward)
        if(player.angle > angleLimit){
            player.angle = angleLimit;
        }
        else if(player.angle < -angleLimit){
            player.angle = -angleLimit;
        }

        // Minimum speed (weight), plus the speed depending on the angle
        player.y += player.weight + Math.sin(player.angle) * player.speed * speedMultiplier;
        window.speedX = Math.cos(player.angle) * player.speed * speedMultiplier;
        document.getElementById('speed').textContent = window.speedX;
    };

    document.body.addEventListener('mousedown', function (){
        player.heavier = true;
    }, false);
    document.body.addEventListener('mouseup', function (){
        player.heavier = false;
    }, false);
    document.body.addEventListener('keydown', function (){
        player.heavier = true;
    }, false);
    document.body.addEventListener('keyup', function (){
        player.heavier = false;
    }, false);
};