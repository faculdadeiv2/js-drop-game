const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const points_paragraph = document.getElementById('points');

const settings = {
    moveSpd: 20,
    spawnDelay: 1000,
    gravity: 5,
}

let player = {
    x: (window.innerWidth - 40) / 2,
    y: window.innerHeight - 40,
    width: 40,
    height: 40,
}

let spawnState = {
    lastSpawn: 0,
    lastDate: 0,
}

let gameState = {
    points: 0,
    isGameStarted: false,
}

let objectsArray = [];

function init() {
    resizeCanvas();
    resetCanvas();
    attachEventListeners();

    window.requestAnimationFrame(gameLoop);
}

function attachEventListeners() {
    window.addEventListener('keydown', (e) => {
        if (e.code == 'ArrowLeft') {
            movePlayer(-settings.moveSpd);
        } else if(e.code == 'ArrowRight') {
            movePlayer(settings.moveSpd);
        }
    });

    document.getElementById('btn-wrapper').addEventListener('click', (e) => {
        e.target.parentElement.style.display = 'none';
        gameState.isGameStarted = true;
    })
}

function gameLoop() {
    if (gameState.isGameStarted) {
        resizeCanvas();
        resetCanvas();
        drawPlayer();
        spawnObject();
        updateObjectsPosition();
        drawObjects();
        checkForCollisions();
    }
    
    window.requestAnimationFrame(gameLoop);
}

function resetCanvas() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function resetGame() {
    player = {
        x: (window.innerWidth - 40) / 2,
        y: window.innerHeight - 40,
        width: 40,
        height: 40,
    }
    
    spawnState = {
        lastSpawn: 0,
        lastDate: 0,
    }
    
    gameState = {
        points: 0,
        isGameStarted: false,
    }
    points_paragraph.innerHTML = '0';
    
    objectsArray = [];

    document.getElementById('btn-wrapper').style.display = 'block';
    resetCanvas();
    drawPlayer();
}

function movePlayer(val) {
    const nextPlayerPos = player.x + val;
    if (nextPlayerPos > canvas.width - player.width || nextPlayerPos < 0) {
        return;
    }
    player.x = nextPlayerPos;
}

function drawPlayer() {
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function spawnObject() {
    if (spawnState.lastSpawn > settings.spawnDelay) {
        objectsArray.push({
            id: new Date().getTime(),
            x: Math.floor(Math.random() * (canvas.width - 40)),
            y: -40,
            width: 40,
            height: 40,
        });
        spawnState.lastSpawn = 0;
    }
    const now = new Date().getTime(); // Retorna a hora atual em milissegundos;
    spawnState.lastSpawn += now - spawnState.lastDate;
    spawnState.lastDate = now;
}

function updateObjectsPosition() {
    objectsArray.forEach(object => {
        object.y += settings.gravity;
        if (object.y === canvas.height) {
            resetGame();
        }
    });

    objectsArray = objectsArray.filter(object => object.y < canvas.height);
}

function checkForCollisions() {
    objectsArray.forEach(object => {
        if (
            object.x < player.x + player.width &&
            object.x + object.width > player.x &&
            object.y < player.y + player.height &&
            object.y + object.height > player.y
        ) {
            objectsArray = objectsArray.filter(obj => obj.id !== object.id)
            gameState.points++;
            points_paragraph.innerHTML = gameState.points;
        }
    });
}

function drawObjects() {
    objectsArray.forEach(object => {
        ctx.fillStyle = 'rgb(0, 0, 200)';
        ctx.fillRect(object.x, object.y, object.width, object.height);
    });
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

init();
