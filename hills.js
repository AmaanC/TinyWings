window.initHills = function (){
    'use strict';
    var ctx = document.getElementById('hills').getContext('2d'),
        MAX_HILLS = 2,
        MIN_HILL_HEIGHT = 20,
        PIXEL_STEP = 5,
        hillWidth = window.WIDTH / MAX_HILLS;

    var lastTime, framesElapsed; // Needed for the delta logic code

    ctx.canvas.width = window.WIDTH;
    ctx.canvas.height = window.HEIGHT;

    var closestMatch = function (array, num){
        var i = 0;
        array.forEach(function (elem, index){
            if(Math.abs(elem - num) < Math.abs(array[i] - num)){
                i = index;
            }
        });
        return i === array.length - 1 ? i : i + 1;
    };

    window.makeHill = function (startX, startY, randomHeight){
        var hillSlices = hillWidth / PIXEL_STEP,
            tempCtx = document.createElement('canvas').getContext('2d'),
            retObj = {
                canvasElem: '',
                x: [],
                y: []
            };

        tempCtx.canvas.width = hillWidth;
        tempCtx.canvas.height = window.HEIGHT;
        tempCtx.save();
        tempCtx.beginPath();
        tempCtx.moveTo(0, startY+randomHeight*Math.cos(0));
        for(var i = 0; i <= hillSlices; i++){
            var hillX = (i * PIXEL_STEP),
                hillY = startY+randomHeight*Math.cos(2*Math.PI/hillSlices*i);
            tempCtx.lineTo(hillX, hillY);
            retObj.x.push(hillX + startX);
            retObj.y.push(hillY);
        }
        tempCtx.stroke();
        tempCtx.clip();
        // tempCtx.fillRect(0,0, 3000, 300);
        // Create the hill's background texture here
        tempCtx.closePath();
        tempCtx.restore();
        retObj.canvasElem = tempCtx.canvas;
        return retObj;
    };

    window.listOfHills = [];
    window.yAtPlayerX = 0; // The y position of the hill slope at the player's x position

    window.manageHills = function (){
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
        if(window.listOfHills.length === 0){
            var startY = 3 * window.HEIGHT/4,
                startX,
                randomHeight;

            for(var i = 0; i < MAX_HILLS + 1; i++){
                randomHeight = MIN_HILL_HEIGHT + Math.random() * 30;
                if(i !== 0){
                    startY -= randomHeight;
                }
                startX = i * hillWidth;
                window.listOfHills.push( window.makeHill(startX, startY, randomHeight) );
                startY += randomHeight;
            }
        }

        window.hillAtPlayerX = (window.listOfHills[0].x[window.listOfHills[0].x.length - 1] > window.playerX) ? 0 : 1;
        window.currentPosIndex = closestMatch(window.listOfHills[window.hillAtPlayerX].x, window.playerX);
        window.yAtPlayerX = window.listOfHills[window.hillAtPlayerX].y[window.currentPosIndex];

        window.listOfHills.forEach(function (obj, index){
            if(obj.x[obj.x.length - 1] <= 0){
                window.listOfHills[index] = undefined;
                var lastHill = window.listOfHills[window.listOfHills.length - 1];
                var startX = lastHill.x[lastHill.x.length - 1] - window.speedX * framesElapsed,
                    startY = lastHill.y[lastHill.y.length - 1],
                    randomHeight = MIN_HILL_HEIGHT + Math.random() * 100;
                startY -= randomHeight;
                window.listOfHills.push( window.makeHill(startX, startY, randomHeight) );
                return;
            }
            else {
                for(var i = 0, len = obj.x.length; i < len; i++){
                    obj.x[i] -= window.speedX * framesElapsed;
                }
            }
        });

        var deletedIndex;
        while( (deletedIndex = window.listOfHills.indexOf(undefined)) >= 0 ){
            window.listOfHills.splice(deletedIndex, 1);
        }
    };

    window.drawHills = function(){
        ctx.clearRect(0, 0, window.WIDTH, window.HEIGHT);
        window.listOfHills.forEach(function (obj){
            ctx.drawImage(obj.canvasElem, obj.x[0], 0);
        });
    };
};