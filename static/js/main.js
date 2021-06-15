var heightOfViewPort, widthOfViewPort; // dimension of viewport in pixels
const BLOCK_SiZE = 25; // block size in pixels
var height, width; // grid dimension
var extraHeightPixels, extraWidthPixels;
var DIRECTIONS = ['R', 'L', 'U', 'D'];
const APPLE = "🍎";
var gameState = 'pause';
var intervalId;


// Snake Details
var snake;
// Attributes of Snake
// - snake[0] is always head
// - posX = row in grid
// - posY = coloumn in grid
// - dir = current direction of snake


// Apple Details
var apple; 
// posX, posY
var count;

$('#gear').hover(
    function() { $(this).addClass('fa-spin') },
    function() { $(this).removeClass('fa-spin') }
)

$(document).ready(loadGame());

$('#play-pause').click(function() {
    if(gameState == 'pause') {
        gameState = 'play';
        $('#play-pause').removeClass('fa-play-circle-o');
        $('#play-pause').addClass('fa-pause-circle-o');
        intervalId = window.setInterval(tempGameStart, 80);
    } else {
        $('#play-pause').removeClass('fa-pause-circle-o');
        $('#play-pause').addClass('fa-play-circle-o');
        gameState = 'pause';
        clearInterval(intervalId);
    }
});
//listen for window resize event
window.addEventListener('resize', function(event){
    $('#main').empty();
    loadGame(); 
});


function getRandomColour() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createDivBox(H, W, color, id) {
    var pix = document.createElement("div");
    pix.style.height = H + "px";
    pix.style.width = W + "px";
    pix.style.float = "left";
    pix.style.backgroundColor = color;
    if(id != null) {
        pix.id = id;
    }
    return pix;
}

function loadGame() {
    heightOfViewPort = $(document).height();
    widthOfViewPort = $(document).width();
    console.log("Documents Height = " + heightOfViewPort + " px and width = " + widthOfViewPort + " px" + "total pixels = " + heightOfViewPort * widthOfViewPort);
    height = Math.floor(heightOfViewPort / BLOCK_SiZE);
    width = Math.floor(widthOfViewPort / BLOCK_SiZE);
    extraHeightPixels = heightOfViewPort % BLOCK_SiZE; 
    extraWidthPixels = widthOfViewPort % BLOCK_SiZE;
    // initialise divs
    for(var i = 0; i < height; i++) {
        for(var j = 0; j < width; j++) {
            var num = i * width + j;
            if((i + j) % 2 == 0) {
                var pix = createDivBox(BLOCK_SiZE, BLOCK_SiZE, "White", "div" + num);
                document.getElementById("main").appendChild(pix);
            } else {
                var pix = createDivBox(BLOCK_SiZE, BLOCK_SiZE, "#f0f0f0", "div" + num);
                document.getElementById("main").appendChild(pix);
            }
        }
        var pix = createDivBox(BLOCK_SiZE, extraWidthPixels, "Black", null);
        document.getElementById("main").appendChild(pix);
    }
    for(var i = 0; i < width; i++) {
        var pix = createDivBox(extraHeightPixels, BLOCK_SiZE, "Black", null);
        document.getElementById("main").appendChild(pix);
    }
    var pix = createDivBox(extraHeightPixels, extraWidthPixels, "Black", null);
    document.getElementById("main").appendChild(pix);
    snake = [];
    let tempHead = {posX : Math.floor(height / 2), posY: Math.floor(width / 2), dir : 'R'};
    snake.push(tempHead);
    showSnake();
    apple = {posX : Math.floor(height / 4), posY: Math.floor(width / 4)} ;
    showApple();
    increaseSize();
    increaseSize();
    console.log(snake);
    showSnake();
    count = 0;
}

function tempGameStart(){
    getNextSnakePosition();
    count += 1;
    $('#score').text(count + '')
    if(count % 10 == 0) {
        increaseSize();
    }
    showSnake();
}

function increaseSize() {
    let tempNode = {posX : Math.floor(height / 2), posY: Math.floor(width / 2), dir : snake[0].dir};
    snake.push(tempNode);
    getNextSnakePosition();
}

function showSnake() {
    for(var i = 0; i < snake.length; i++) {
        num = snake[i].posX * width + snake[i].posY;
        $("#div" + num).css({
            "background-color": "red",
            "border-radius": "8px"
        });
    }
}

window.addEventListener("keydown", function(event) {
    if(gameState == 'pause') {
        return;
    }
    var move = 'U';
    if(event.code == "ArrowDown" || event.code == "KeyS") {
        move = 'D';
    } else if(event.code == "ArrowLeft" || event.code == "KeyA") {
        move = 'L';
    } else if(event.code == "ArrowRight" || event.code == "KeyD") {
        move = 'R';
    } else if(event.code == "ArrowUp" || event.code == "KeyW") {
        move = 'U';
    } else {
        return;
    }
    var nextCordinate = findNextCoordinate(apple.posX, apple.posY, move)
    if(!checkColision(nextCordinate)) {
        declareWinner('Snake');
    }
    clearAppleshow(apple);
    apple.posX = nextCordinate.posX;
    apple.posY = nextCordinate.posY;
    showApple()
  }, true);

function clearAppleshow(pos) {
    var num = pos.posX * width + pos.posY;
    $("#div" + num).text('');
}

function clearSnaketail(pos) {
    var num = pos.posX * width + pos.posY;
    var col = "#f0f0f0";
    if((pos.posX + pos.posY) % 2 == 0) {
        col = "White";
    }
    $("#div" + num).css({
        "background-color": col,
        "border-radius": "0px"
    });
}

function showApple() {
    num = apple.posX * width + apple.posY;
    $("#div" + num).text(APPLE);
}

function findNextCoordinate(curX, cuyY, dir) {
    if(dir == 'U') {
        return {posX: curX - 1, posY: cuyY};
    }
    if(dir == 'D') {
        return {posX: curX + 1, posY: cuyY};
    }
    if(dir == 'L') {
        return {posX: curX, posY: cuyY - 1};
    }
    if(dir == 'R') {
        return {posX: curX, posY: cuyY + 1};
    }
}

function checkColision(nextCoordinates) {
    if(nextCoordinates.posX < 0 || nextCoordinates.posX >= height || nextCoordinates.posY < 0 || nextCoordinates.posY >= width) {
        return false;
    }
    for(var i = 0; i < snake.length; i++) {
        if(nextCoordinates.posX == snake[i].posX && nextCoordinates.posY == snake[i].posY) {
            return false;
        }
    }
    return true;
}

function performMove(nextCoordinates, move) {
    if(nextCoordinates.posX == apple.posX && nextCoordinates.posY == apple.posY) {
        declareWinner('Snake');
    }
    clearSnaketail(snake[snake.length - 1]);
    for(var i = snake.length - 1; i > 0; i--) {
        snake[i].posX = snake[i - 1].posX;
        snake[i].posY = snake[i - 1].posY;
        snake[i].dir = snake[i - 1].dir;
    }
    snake[0].posX = nextCoordinates.posX;
    snake[0].posY = nextCoordinates.posY;
    snake[0].dir = move;
}


function getNextSnakePosition() {
    var possibleMoves;
    if(Math.abs(apple.posX - snake[0].posX) > Math.abs(apple.posY - snake[0].posY)) {
        if(apple.posX > snake[0].posX) {
            possibleMoves = "DLRU";
        } else {
            possibleMoves = "ULRD";
        }
    } else {
        if(apple.posY < snake[0].posY) {
            possibleMoves = "LDUR";
        } else {
            possibleMoves = "RDUL";
        }
    }
    for(var i = 0; i < possibleMoves.length; i++) {
        var nextCoordinates = findNextCoordinate(snake[0].posX, snake[0].posY, possibleMoves[i]);
        if(checkColision(nextCoordinates)) {
            performMove(nextCoordinates, possibleMoves[i]);
            return;
        }
    }
    // Apple Win Snake Can't move
    declareWinner('Apple');
}

function declareWinner(winner) {
    if(winner == 'Snake') {
        if(!alert('You Lose Sucker!!!')){window.location.reload();}
    } else {
        if('Wow! You beat the invincible Snake'){window.location.reload();}
    }
}