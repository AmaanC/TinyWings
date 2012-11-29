window.initPlayer = function (){
    'use strict';
    var ctx = document.getElementById('player').getContext('2d'),
        angleLimit = 60 * Math.PI / 180,
        speedMultiplier = 1;
    var keycode = 40; // Keycode for what brings the window.player down. Right now, it is the down arrow

    var lastTime, framesElapsed;

    window.player = {}
    window.player.x = window.window.playerX;
    window.player.y = 50;
    window.player.speed = 3; // The max speed in the direction he's facing
    window.player.radius = 5;
    window.player.angle = 0;
    window.player.heaver = false;
    window.player.weight = 1;

    ctx.canvas.width = window.WIDTH;
    ctx.canvas.height = window.HEIGHT;
    var diameter = window.player.radius * 2;

    window.drawPlayer = function (){
        ctx.clearRect(window.player.x - window.player.radius*2, 0, diameter*3, window.HEIGHT);
        ctx.beginPath();
        ctx.save();
        ctx.translate(window.player.x, window.player.y /*< 0.1 * window.HEIGHT ? 0.1 * window.HEIGHT : window.player.y */); // Limit the window.player's y only on the canvas, so it can still go "higher" as the hills get smaller
        ctx.rotate(window.player.angle);
        ctx.fillRect(0, 0, diameter, window.player.radius);
        ctx.arc(0, 0 - window.player.radius, window.player.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
        ctx.closePath();
    };

    window.controlPlayer = function (){
        if(lastTime){
            framesElapsed = Math.round( (Date.now() - lastTime) / (1000 / window.FPS) );
        }
        else {
            framesElapsed = 1;
        }

        // This might happen when the user leaves the tab or similar (on fast computers). Going that fast would be crazy
        if(framesElapsed >= 30){
            framesElapsed = 2;
        }

        lastTime = Date.now();
        // Calculate angle of the slope at the window.player's position
        if(window.listOfHills[window.hillAtPlayerX].x[window.currentPosIndex + 1]){
            window.angleAtPlayerX = Math.atan2(
                window.listOfHills[window.hillAtPlayerX].y[window.currentPosIndex + 1] -
                window.listOfHills[window.hillAtPlayerX].y[window.currentPosIndex],

                window.listOfHills[window.hillAtPlayerX].x[window.currentPosIndex + 1] -
                window.listOfHills[window.hillAtPlayerX].x[window.currentPosIndex]
            );
        }
        else {
            // This means they went through the valley of the hill, meaning they win a boost or something
            if(window.player.y >= window.yAtPlayerX){
                console.log('SWOOOSH!');
                speedMultiplier += 0.3;
            }
        }

        // --------------------------------------------------------------
        // If the hill and window.player touch, move the window.player back, and fix the angle
        if(window.player.y >= window.yAtPlayerX){
            window.player.y = window.yAtPlayerX;
            if(window.player.angle >= window.angleAtPlayerX){
                if(Math.abs(window.player.angle - window.angleAtPlayerX) > 45 * Math.PI / 180){
                    console.log('BOOM!');
                    speedMultiplier -= 0.3 * window.speedX;
                    if(speedMultiplier <= 0.6){
                        speedMultiplier = 0.6;
                    }
                    window.player.angle = window.angleAtPlayerX - (window.player.angle - window.angleAtPlayerX) / 4;
                }
                else {
                    window.player.angle = window.angleAtPlayerX;
                }
            }
            if(window.angleAtPlayerX > 0){
                speedMultiplier += 0.05;
            }
            else if(window.player.heavier){
                speedMultiplier -= 0.05;
            }
        }
        else {
            // if(speedMultiplier <= 0.5){
            //     speedMultiplier = 1;
            // }
            if(window.player.heavier){
                window.player.angle += Math.PI / 45;
                window.player.weight = 2;
            }
            else {
                window.player.angle += Math.PI / 450;
                window.player.weight = 1;
            }
        }

        // Keep it within these angles (facing only forward)
        if(window.player.angle > angleLimit){
            window.player.angle = angleLimit;
        }
        else if(window.player.angle < -angleLimit){
            window.player.angle = -angleLimit;
        }

        if(speedMultiplier < 0.3){
            speedMultiplier = 0.3;
        }

        // Minimum speed (weight), plus the speed depending on the angle
        window.player.y += window.player.weight + Math.sin(window.player.angle) * window.player.speed * speedMultiplier * framesElapsed;
        window.speedX = Math.cos(window.player.angle) * window.player.speed * speedMultiplier;
        if(window.speedX > 10){
            window.speedX = 10;
        }
        else if(window.speedX < 1){
            window.speedX = 1;
        }

        if(window.player.y < -100){
            window.player.y = -100;
        }
        document.getElementById('speed').textContent = window.speedX;
    };

    document.body.addEventListener('mousedown', function (){
        window.player.heavier = true;
    }, false);
    document.body.addEventListener('mouseup', function (){
        window.player.heavier = false;
    }, false);

    document.body.addEventListener('touchstart', function (){
        window.player.heavier = true;
    }, false);
    document.body.addEventListener('touchend', function (){
        window.player.heavier = false;
    }, false);

    document.body.addEventListener('keydown', function (e){
        if(e.keyCode === keycode){
            window.player.heavier = true;
        }
    }, false);
    document.body.addEventListener('keyup', function (e){
        if(e.keyCode === keycode){
            window.player.heavier = false;
        }
    }, false);
};