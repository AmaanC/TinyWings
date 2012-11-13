window.initHills = function (){
    'use strict';
    var ctx = document.getElementById('hills').getContext('2d'),
        MAX_HILLS = 2,
        MIN_HILL_HEIGHT = 20,
        PIXEL_STEP = 5,
        hillWidth = WIDTH / MAX_HILLS;

    ctx.canvas.width = WIDTH;
    ctx.canvas.height = HEIGHT;

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
                src: '',
                x: [],
                y: []
            };

        tempCtx.canvas.width = hillWidth;
        tempCtx.canvas.height = HEIGHT;
        tempCtx.beginPath();
        tempCtx.moveTo(0, startY+randomHeight*Math.cos(0));
        for(var i = 0; i <= hillSlices; i++){
            var hillX = (i * PIXEL_STEP),
                hillY = startY+randomHeight*Math.cos(2*Math.PI/hillSlices*i);
            tempCtx.lineTo(hillX, hillY);
            // tempCtx.moveTo(hillX, hillY);
            retObj.x.push(hillX + startX);
            retObj.y.push(hillY);
        }
        tempCtx.stroke();
        tempCtx.closePath();
        retObj.src = tempCtx.canvas.toDataURL();
        return retObj;
    };

    window.listOfHills = [];
    window.yAtPlayerX = 0; // The y position of the hill slope at the player's x position
    var hillAtPlayerX;

    window.manageHills = function (){
        if(window.listOfHills.length === 0){
            var startY = 3 * HEIGHT/4,
                startX,
                randomHeight;

            for(var i = 0; i < MAX_HILLS + 1; i++){
                randomHeight = MIN_HILL_HEIGHT + Math.random() * 100;
                if(i !== 0){
                    startY -= randomHeight;
                }
                startX = i * hillWidth;
                window.listOfHills.push( makeHill(startX, startY, randomHeight) );
                window.listOfHills[i].img = new Image();
                window.listOfHills[i].img.src = window.listOfHills[i].src;
                startY += randomHeight;
            }
        }
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        hillAtPlayerX = (window.listOfHills[0].x[window.listOfHills[0].x.length - 1] > window.playerX) ? 0 : 1;
        var currentPosIndex = closestMatch(window.listOfHills[hillAtPlayerX].x, window.playerX);
        window.yAtPlayerX = window.listOfHills[hillAtPlayerX].y[currentPosIndex];
        // console.log(currentPosIndex + 1 > listOfHills[hillAtPlayerX].y.length);

        if(window.listOfHills[hillAtPlayerX].x[currentPosIndex + 1]){
            window.angleAtPlayerX = Math.atan2(
                window.listOfHills[hillAtPlayerX].y[currentPosIndex + 1]
                - window.listOfHills[hillAtPlayerX].y[currentPosIndex],

                window.listOfHills[hillAtPlayerX].x[currentPosIndex + 1]
                - window.listOfHills[hillAtPlayerX].x[currentPosIndex]
            );
        }
        // window.angleAtPlayerX *= window.angleAtPlayerX < 0 ? -1 : 1;

        window.listOfHills.forEach(function (obj, index){
            if(obj.x[obj.x.length - 1] <= 0){
                window.listOfHills[index] = undefined;
                var lastHill = window.listOfHills[window.listOfHills.length - 1];
                var startX = lastHill.x[lastHill.x.length - 1] - window.speedX,
                    startY = lastHill.y[lastHill.y.length - 1],
                    randomHeight = MIN_HILL_HEIGHT + Math.random() * 100;
                startY -= randomHeight;
                window.listOfHills.push( makeHill(startX, startY, randomHeight) );
                window.listOfHills[listOfHills.length - 1].img = new Image();
                window.listOfHills[listOfHills.length - 1].img.src = window.listOfHills[listOfHills.length - 1].src;
                return;
            }
            else{
                for(var i = 0, len = obj.x.length; i < len; i++){
                    obj.x[i] -= window.speedX;
                }
                drawHill(obj.img, obj.x[0]);
            }
        });

        var deletedIndex;
        while( (deletedIndex = window.listOfHills.indexOf(undefined)) >= 0 ){
            window.listOfHills.splice(deletedIndex, 1);
        }
        setTimeout(manageHills, 1000/window.FPS);
    };
    window.drawHill = function(img, startX){
        ctx.drawImage(img, startX, 0);
    };
};