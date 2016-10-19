/********************************************************************
Project: Maze - Unit 11 - CoderCamps
Tools: HTML5, JavaScript, CSS, TypeScript
Author: Jose L. Collins
Date: 5/14/2016
Description:
The goal of the game is to reach the botton side of the maze (canvas). The user (square) must to skip the zombies (Circle)
for to win the game.
The image of Square and Circle were seleted due to other images (png, jpeg, etc) were to havy and in some browser
caused a trail after the "movements".
***********************************************************************/
let x = 0; //X axis for the zombies (Circles blue)
let xx = 800; //X axis for the zombies (Circles red)
let y = 100; //Y axis for the zombies (Circles blue)
let yy = 0; //Y axis for the zombies (Circles red)
let ux = 20; //X axis for the hero
let uy = 20; // Y axis for the hero
let heroHigh = 20;
let heroWidth = 20;
let xIncrement = 5; //Increment for the axis X (zombies blue)
let xxIncrement = 5; //Increment for the axis X (zombies red)
let chunkHigh = 30;
let chunkWidth = 30;
let chunkxline = 27;
let numInterrxline = 5;
let numMazeLine = 5;
let mazeLine = [];
let mazeLineIncr = 100;
let mazeLineInit = 50;
let mazeLineColor = 'green';

//Initial reference to the Canvas.
let canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
let context = canvas.getContext("2d");

//Initial and One time job routines for definition of the structure of a random Maze

createMaze();

function drawGame(x, y, ux, uy) {
    //Control for to put all the images on the screen over the Canvas, this function is call repeatedly in a unfinity loop
    context.clearRect(0, 0, canvas.width, canvas.height);
    borderMaze();
    drawMazeLine();
    drawHero();
    drawZombies();
    }

function drawHero() {
    //Definition and show on the screen of the "hero" (represented by a square), this character will be controlled
    //by the user with the 4 arrows key.
    context.beginPath();
    context.rect(ux, uy, 20, 20);
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
}

function drawZombies() {
    //Definition and show of the 4 zombies (represented by circles): 2 Even (blue) and 2 Odd (Red)
    let zy = 0;
    let zx = 0;

    for (let i = 0; i < 4; i++) {

        context.beginPath();
        zy += 105;
        zx = ((i % 2) == 1) ? x : xx;
        context.arc(zx, zy, 20, 0, Math.PI * 2);
        context.fillStyle = ((i % 2) == 1) ? "blue":"red";
        context.fill();
        context.closePath();

        verifyDeath(zx,zy); // Verify the "death" of the hero (user character).
    }
}

function updateGame() {
    //Update and "move" the position of the zombies in 2 diffferents directions
    x += xIncrement;
    if (x > canvas.width) { xIncrement = -5 }
    else if (x < 0) { xIncrement = 5 }

    xx += xxIncrement;
    if (xx >= canvas.width) { xxIncrement = -5 }
    else if (xx <= 0) { xxIncrement = 5 }
}

function verifyCollision(cx, cy) {
    //Avoid that the hero (square) go through the walls of the maze and the borders of the canvas.
    let result = false;
    for (let l = 0; l < numMazeLine; l++) {

        for (let c = 0; c < chunkxline; c++) {

            if (mazeLine[l][c].status) {

                if (((cx < (mazeLine[l][c].x + chunkWidth) &&
                    (cx + heroWidth) > mazeLine[l][c].x &&
                    cy < (mazeLine[l][c].y + chunkHigh) &&
                    (cy + heroHigh) > mazeLine[l][c].y)) ||
                    (heroWidth + cx > canvas.width) ||
                    (cx < 0) ||
                    (cy < 0) ||
                    (heroHigh + cy > canvas.height)
                ) {
                    result = true;

                }

            }
        }
    }

    return result;

}


function verifyDeath(zx,zy) {
    //If the hero make contact (sometime close) with the zombies then the game is over saddly for the user.
    if (Math.abs((zx - ux)) < 20 && Math.abs((zy - uy)) < 20) {

        let img = new Image();
        img.addEventListener('load', () => {
            context.drawImage(img, ux,uy,50,50);
        });
        img.src = "boom.jpg";

        alert('Game Over!!!!');
        window.location.reload();

    }

}


function borderMaze() {
    //It is just delimitation of the area of the game in the screen
    context.beginPath();
    context.strokeStyle = "red";
    context.rect(0, 0, 800, 500);
    context.stroke();
    context.fillText("<--------------> To Win Get Here -----------> Infinity Maze v1.0 <------------->", 250, 495,500);
    context.closePath();

}

function createMaze() {
    //Definition of the data of the maze that is created in a random way.
    // Each time the user will have differents (unlimited or infinity) templates for to play
    for (let l = 0; l < numMazeLine; l++) {
        mazeLine[l] = [];
        for (let c = 0; c < chunkxline; c++) {
            mazeLine[l][c] = { x: 0, y: 0, status: true };
        }
    }

    let chunky = mazeLineInit;

    for (let l = 0; l < numMazeLine; l++) {

        let chunkx = 0;
        let interruptions = new Array;
        //Actually the walls and contiguous rectangles (chunks) with some "interruptions" created ramdonly.
        interruptions = getLineInterr(numInterrxline);

        for (let c = 0; c < chunkxline; c++) {

            mazeLine[l][c].x = chunkx;
            mazeLine[l][c].y = chunky;
            mazeLine[l][c].status = chunkstatus(c, interruptions);
            chunkx += chunkWidth;
        }

        chunky += mazeLineIncr;
    }

    drawMazeLine();

}

function drawMazeLine() {
    //Using the data created ramdonly the Maze is showed to the user and ready for to play
    for (let l = 0; l < numMazeLine; l++) {

        for (let c = 0; c < chunkxline; c++) {

            if (mazeLine[l][c].status) { //true for to show and false for to hide (interruption of the wall)
                context.beginPath();
                context.rect(mazeLine[l][c].x, mazeLine[l][c].y, chunkWidth, chunkHigh);
                context.fillStyle = mazeLineColor;
                context.fill();

                context.closePath
            }

        }
    }

   }


function chunkstatus(x,interruptions) {
    //To set if the chunk of the wall will be present or not.
    let result = true;

    if (nointerrupt(x, interruptions)) {
        result = true;
    } else {
        result = false;
    }

    return result;
}


function getLineInterr(num) {
    //To set in a random way if the chunk of the wall will be present in the maze.
    let interrNumbers = new Array;

    for (let i = 0; i < num; i++) {

        let x = Math.floor((Math.random() * chunkxline) + 1);

        interrNumbers[i] = x;
    }

    return interrNumbers;
}

function nointerrupt(num, interruptions){
    //Verify if the chunk of the wall was selected for to be present or no in the maze.
    let result = true;

    for (let i = 0; i < interruptions.length; i++) {

        if (num == interruptions[i]) {

            result = false;
        }

    }
    return result;
}



window.addEventListener('keydown', function (event) {
    //control and action for to move the hero to the position seleted by the user.
    let lastmovex = ux;
    let lastmovey = uy;
            switch (event.keyCode) {
                case 37:  //left arrow
                    ux += -5;
                    break;
                case 38: //Up arrow
                    uy += -5;
                    break;
                case 39: //right arrow
                    ux += 5;
                    break;
                case 40: // Down arrow
                    uy += 5;
                    break;
                default: //Other key do nothing
                    alert('Please, only use the arrow keys..thanks!');
                    break;
    }


            if (verifyCollision(ux, uy)) {
                //If the new position cause a collision (against the walls or the borders) the hero (square) will stay
                // in his previous position.
                ux = lastmovex;
                uy = lastmovey;
            }

                //If the user (square) reach the botton of the canvas (maze) then He/she won the game!!...and
                //can play another different maze created on the fly.
                if (uy == 480 ) {
                    alert('You Win!!!!');
                    alert('Game Over!!!');
                    location.reload();
            }

});

//Functions and routines needed for the recursive and repetedly process of the interactive game, in this way
// exists the ilusion of objects are moving constantly on the screen, but the thru is that is just re-draw of
//the same objects in others positions..just like the movies...
interface Window {
    requestAnimFrame(callback: any, element?: any): void;
    webkitRequestAnimationFrame(callback: any, element?: any): void;
    mozRequestAnimationFrame(callback: any, element?: any): void;
    oRequestAnimationFrame(callback: any, element?: any): void;
}

var mainloop = function () {
    updateGame();
    drawGame(x,y,ux,uy);
};

var animFrame = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                null;

if (animFrame !== null) {
    var recursiveAnim = function () {
        mainloop();
        animFrame(recursiveAnim);
    };

    // start the mainloop
    animFrame(recursiveAnim);
} else {
    var ONE_FRAME_TIME = 1000.0 / 1000.0; //set the speed of the refresh
    setInterval(mainloop, ONE_FRAME_TIME);
}
