let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let gameStarted = false;
let moleInterval;
let plantInterval;

window.onload = function() {
    setGame();
    document.getElementById("startBtn").addEventListener("click", startGame);
    document.getElementById("restartBtn").addEventListener("click", restartGame);
    // Disable restart button initially
    document.getElementById("restartBtn").disabled = true;
}

function setGame() {
    //set up the grid in html
    for (let i = 0; i < 9; i++) { //i goes from 0 to 8, stops at 9
        //<div id="0-8"></div>
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    // Don't start intervals automatically - wait for start button
}

function getRandomTile() {
    //math.random --> 0-1 --> (0-1) * 9 = (0-9) --> round down to (0-8) integers
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (!gameStarted || gameOver) {
        return;
    }
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }
    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) {
        return;
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
    
    // Add animation class
    setTimeout(() => {
        if (mole.parentNode === currMoleTile) {
            mole.classList.add("pop-up");
        }
    }, 10);
}

function setPlant() {
    if (!gameStarted || gameOver) {
        return;
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }
    let plant = document.createElement("img");
    plant.src = "./piranha-plant.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        return;
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
    
    // Add animation class
    setTimeout(() => {
        if (plant.parentNode === currPlantTile) {
            plant.classList.add("pop-up");
        }
    }, 10);
}

function selectTile() {
    if (gameOver) {
        return;
    }
    if (this == currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = score.toString(); //update score html
    }
    else if (this == currPlantTile) {
        document.getElementById("score").innerText = "GAME OVER: " + score.toString(); //update score html
        gameOver = true;
    }
}

function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    gameOver = false;
    score = 0;
    document.getElementById("score").innerText = score.toString();
    document.getElementById("startBtn").disabled = true;
    document.getElementById("restartBtn").disabled = false;
    
    // Clear any existing intervals
    if (moleInterval) clearInterval(moleInterval);
    if (plantInterval) clearInterval(plantInterval);
    
    // Start the game intervals
    moleInterval = setInterval(setMole, 1000); // 1000 milliseconds = 1 second
    plantInterval = setInterval(setPlant, 2000); // 2000 milliseconds = 2 seconds
    
    // Clear any existing moles or plants
    if (currMoleTile) currMoleTile.innerHTML = "";
    if (currPlantTile) currPlantTile.innerHTML = "";
    
    currMoleTile = null;
    currPlantTile = null;
}

function restartGame() {
    // Clear any existing intervals
    if (moleInterval) clearInterval(moleInterval);
    if (plantInterval) clearInterval(plantInterval);
    
    // Clear any existing moles or plants
    if (currMoleTile) currMoleTile.innerHTML = "";
    if (currPlantTile) currPlantTile.innerHTML = "";
    
    currMoleTile = null;
    currPlantTile = null;
    
    // Reset game state
    gameStarted = false;
    gameOver = false;
    score = 0;
    document.getElementById("score").innerText = score.toString();
    document.getElementById("startBtn").disabled = false;
    document.getElementById("restartBtn").disabled = true;
}