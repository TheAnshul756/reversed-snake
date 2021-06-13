var heightOfViewPort, widthOfViewPort; // dimension of viewport in pixels
const BLOCK_SiZE = 20; // block size in pixels
var height, width; // grid dimension
var extraHeightPixels, extraWidthPixels;
var DIRECTIONS = ['R', 'L', 'U', 'D'];


// Snake Details
var snake;
// Attributes of Snake
// - snake[0] is always head
// - posX = row in grid
// - posY = coloumn in grid
// - dir = current direction of snake


$(document).ready(loadGame());
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
            var pix = createDivBox(BLOCK_SiZE, BLOCK_SiZE, "White", "div" + num);
            document.getElementById("main").appendChild(pix);
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
    let tempHead = {posX : Math.floor(height / 2), posY: Math.floor(width / 2), dir : 'L'};
    snake.push(tempHead);
    showSnake();
}

function increaseSize() {
    
}

function showSnake() {
    for(var i = 0; i < snake.length; i++) {
        num = snake[i].posX * width + snake[i].posY;
        console.log(num);
        $("#div" + num).css({
            "background-color": "red",
            "border-radius": "6px"
        });
    }
}