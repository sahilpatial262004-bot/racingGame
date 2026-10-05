// ==========================
// CANVAS
// ==========================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ==========================
// GAME VARIABLES
// ==========================

let gameRunning = false;
let score = 0;
let roadSpeed = 8;

let roadOffset = 0;

const roadWidth = 320;

const player = {
    width: 50,
    height: 90,
    x: canvas.width / 2 - 25,
    y: canvas.height - 130,
    speed: 8,
    color: "#00ff00"
};

const traffic = [];

const keys = {
    left: false,
    right: false
};

// ==========================
// KEYBOARD
// ==========================

document.addEventListener("keydown", function(e){

    if(e.key==="ArrowLeft")
        keys.left=true;

    if(e.key==="ArrowRight")
        keys.right=true;

});

document.addEventListener("keyup", function(e){

    if(e.key==="ArrowLeft")
        keys.left=false;

    if(e.key==="ArrowRight")
        keys.right=false;

});

// ==========================
// PLAYER
// ==========================

function updatePlayer(){

    if(keys.left){

        player.x -= player.speed;

    }

    if(keys.right){

        player.x += player.speed;

    }

    const leftLimit=(canvas.width-roadWidth)/2;

    const rightLimit=leftLimit+roadWidth-player.width;

    if(player.x<leftLimit)
        player.x=leftLimit;

    if(player.x>rightLimit)
        player.x=rightLimit;

}

function drawPlayer(){

    ctx.fillStyle=player.color;

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

    ctx.fillStyle="black";

    ctx.fillRect(
        player.x+8,
        player.y+12,
        34,
        25
    );

}

// ==========================
// ROAD
// ==========================

function drawRoad(){

    const left=(canvas.width-roadWidth)/2;

    ctx.fillStyle="#444";

    ctx.fillRect(
        left,
        0,
        roadWidth,
        canvas.height
    );

    ctx.fillStyle="white";

    roadOffset+=roadSpeed;

    if(roadOffset>40)
        roadOffset=0;

    for(let y=-40;y<canvas.height;y+=80){

        ctx.fillRect(
            canvas.width/2-5,
            y+roadOffset,
            10,
            40
        );

    }

}
// ==========================
// TRAFFIC CARS
// ==========================

function createTrafficCar() {

    const left = (canvas.width - roadWidth) / 2;

    const lanes = [
        left + 30,
        left + 135,
        left + 240
    ];

    const lane = Math.floor(Math.random() * lanes.length);

    traffic.push({
        x: lanes[lane],
        y: -120,
        width: 50,
        height: 90,
        speed: roadSpeed + Math.random() * 3,
        color: "red"
    });

}

setInterval(function () {

    if (gameRunning) {

        createTrafficCar();

    }

}, 1200);

// ==========================
// UPDATE TRAFFIC
// ==========================

function updateTraffic() {

    for (let i = traffic.length - 1; i >= 0; i--) {

        traffic[i].y += traffic[i].speed;

        if (traffic[i].y > canvas.height + 100) {

            traffic.splice(i, 1);

            score++;

            document.getElementById("score").textContent = score;

        }

    }

}

// ==========================
// DRAW TRAFFIC
// ==========================

function drawTraffic() {

    traffic.forEach(function (car) {

        ctx.fillStyle = car.color;

        ctx.fillRect(
            car.x,
            car.y,
            car.width,
            car.height
        );

        ctx.fillStyle = "black";

        ctx.fillRect(
            car.x + 8,
            car.y + 12,
            34,
            25
        );

    });

}

// ==========================
// COLLISION
// ==========================

function checkCollision() {

    for (let car of traffic) {

        if (

            player.x < car.x + car.width &&
            player.x + player.width > car.x &&
            player.y < car.y + car.height &&
            player.y + player.height > car.y

        ) {

            gameRunning = false;

            document.getElementById("finalScore").textContent = score;

            document
                .getElementById("gameOver")
                .classList.remove("hidden");

        }

    }

}

// ==========================
// GAME LOOP
// ==========================

function gameLoop() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawRoad();

    updatePlayer();

    drawPlayer();

    updateTraffic();

    drawTraffic();

    checkCollision();

    if (gameRunning) {

        requestAnimationFrame(gameLoop);

    }

}
// ==========================
// GAME START
// ==========================

const loadingScreen = document.getElementById("loadingScreen");
const mainMenu = document.getElementById("mainMenu");
const gameContainer = document.getElementById("gameContainer");

setTimeout(() => {
    loadingScreen.style.display = "none";
}, 1500);

document.getElementById("playBtn").addEventListener("click", startGame);

function startGame() {

    score = 0;
    roadSpeed = 8;

    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 130;

    traffic.length = 0;

    document.getElementById("score").textContent = score;
    document.getElementById("finalScore").textContent = 0;

    document.getElementById("gameOver").classList.add("hidden");

    mainMenu.classList.add("hidden");
    gameContainer.classList.remove("hidden");

    gameRunning = true;

    requestAnimationFrame(gameLoop);

}

// ==========================
// RESTART
// ==========================

document
.getElementById("restartBtn")
.addEventListener("click", startGame);

// ==========================
// MAIN MENU
// ==========================

document
.getElementById("menuBtn")
.addEventListener("click", function(){

    gameRunning = false;

    gameContainer.classList.add("hidden");

    mainMenu.classList.remove("hidden");

});

// ==========================
// PAUSE
// ==========================

let paused = false;

document
.getElementById("pauseBtn")
.addEventListener("click", function(){

    if(!gameRunning) return;

    paused = !paused;

    if(paused){

        gameRunning = false;

    }else{

        gameRunning = true;

        requestAnimationFrame(gameLoop);

    }

});

// ==========================
// MOBILE CONTROLS
// ==========================

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

leftBtn.addEventListener("touchstart", () => keys.left = true);
leftBtn.addEventListener("touchend", () => keys.left = false);

rightBtn.addEventListener("touchstart", () => keys.right = true);
rightBtn.addEventListener("touchend", () => keys.right = false);

// ==========================
// BEST SCORE
// ==========================

let best = localStorage.getItem("bestScore");

if(best == null){

    best = 0;

}

document.getElementById("bestScore").textContent = best;

function updateBestScore(){

    if(score > best){

        best = score;

        localStorage.setItem("bestScore", best);

        document.getElementById("bestScore").textContent = best;

    }

}

setInterval(function(){

    if(gameRunning){

        roadSpeed += 0.05;

        document.getElementById("speed").textContent =
            Math.floor(roadSpeed);

        updateBestScore();

    }

},1000);

// ==========================
// OPTIONAL BUTTONS
// ==========================

const garageBtn = document.getElementById("garageBtn");
const settingsBtn = document.getElementById("settingsBtn");
const aboutBtn = document.getElementById("aboutBtn");

garageBtn.onclick = function(){

    alert("Garage will be added later.");

}

settingsBtn.onclick = function(){

    alert("Settings will be added later.");

}

aboutBtn.onclick = function(){

    alert("Simple Racing Game\nMade with HTML, CSS & JavaScript");

}