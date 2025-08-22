let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let gameStarted = false;
let moleInterval;
let plantInterval;
let customCursor;
let boardElement;
let gameTimer;
let timeLeft = 30; // 30 seconds game time
let feverMode = false; // Track if we're in fever mode

window.onload = function() {
    setGame();
    document.getElementById("startBtn").addEventListener("click", startGame);
    document.getElementById("restartBtn").addEventListener("click", restartGame);
    // Disable restart button initially
    document.getElementById("restartBtn").disabled = true;
    
    // Initialize custom cursor
    customCursor = document.getElementById("custom-cursor");
    boardElement = document.getElementById("board");
    
    // Set up custom cursor
    setupCustomCursor();
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

function setupCustomCursor() {
    // Show custom cursor when entering board
    boardElement.addEventListener("mouseenter", function() {
        customCursor.style.display = "block";
    });
    
    // Hide custom cursor when leaving board
    boardElement.addEventListener("mouseleave", function() {
        customCursor.style.display = "none";
    });
    
    // Move custom cursor with mouse
    boardElement.addEventListener("mousemove", function(e) {
        customCursor.style.left = e.pageX + "px";
        customCursor.style.top = e.pageY + "px";
    });
    
    // Animate cursor on click
    boardElement.addEventListener("click", function() {
        // Remove any existing animation class
        customCursor.classList.remove("cursor-hit");
        
        // Trigger reflow
        void customCursor.offsetWidth;
        
        // Add animation class
        customCursor.classList.add("cursor-hit");
        
        // Remove class after animation completes
        setTimeout(() => {
            customCursor.classList.remove("cursor-hit");
        }, 300);
    });
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
    mole.src = "./assets/characterP_nor.png";

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
    plant.src = "./assets/characterG_nor.png";

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
    
    // Determine point value based on fever mode
    let pointValue = feverMode ? 20 : 10;
    
    // Check if we're hitting the mole (characterP_nor)
    if (this == currMoleTile) {
        // Hit the mole - show angry mole and deduct points
        score -= pointValue;
        if (score < 0) score = 0; // Don't let score go below 0
        document.getElementById("score").innerText = score.toString(); //update score html
        
        // Change mole to angry version
        if (currMoleTile && currMoleTile.firstChild) {
            currMoleTile.firstChild.src = "./assets/characterP_angry.png";
            
            // Reset mole image after a delay
            setTimeout(() => {
                if (currMoleTile && currMoleTile.firstChild) {
                    currMoleTile.firstChild.src = "./assets/characterP_nor.png";
                }
            }, 300);
        }
    }
    // Check if we're hitting the plant (normal or happy)
    else if (this == currPlantTile) {
        // Check if it's the normal plant (characterG_nor)
        if (currPlantTile && currPlantTile.firstChild && 
            currPlantTile.firstChild.src.includes("characterG_nor")) {
            // Hit the normal plant - add score and show happy version
            score += pointValue;
            document.getElementById("score").innerText = score.toString(); //update score html
            
            // Change plant to happy version
            if (currPlantTile && currPlantTile.firstChild) {
                currPlantTile.firstChild.src = "./assets/characterG_happy.png";
            }
            
            // Change mole to angry version
            if (currMoleTile && currMoleTile.firstChild) {
                currMoleTile.firstChild.src = "./assets/characterP_angry.png";
                
                // Reset mole image after a delay
                setTimeout(() => {
                    if (currMoleTile && currMoleTile.firstChild) {
                        currMoleTile.firstChild.src = "./assets/characterP_nor.png";
                    }
                }, 300);
            }
            
            // Reset plant to normal after a delay
            setTimeout(() => {
                if (currPlantTile && currPlantTile.firstChild) {
                    currPlantTile.firstChild.src = "./assets/characterG_nor.png";
                }
            }, 1000);
        } else if (currPlantTile && currPlantTile.firstChild && 
            currPlantTile.firstChild.src.includes("characterG_happy")) {
            // Hit the happy plant - add score
            score += pointValue;
            document.getElementById("score").innerText = score.toString(); //update score html
            
            // Change mole to angry version
            if (currMoleTile && currMoleTile.firstChild) {
                currMoleTile.firstChild.src = "./assets/characterP_angry.png";
                
                // Reset mole image after a delay
                setTimeout(() => {
                    if (currMoleTile && currMoleTile.firstChild) {
                        currMoleTile.firstChild.src = "./assets/characterP_nor.png";
                    }
                }, 300);
            }
            
            // Reset plant to normal after a delay
            setTimeout(() => {
                if (currPlantTile && currPlantTile.firstChild) {
                    currPlantTile.firstChild.src = "./assets/characterG_nor.png";
                }
            }, 1000);
        }
    }
}

function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    gameOver = false;
    feverMode = false;
    score = 0;
    timeLeft = 30; // Reset timer to 30 seconds
    document.getElementById("score").innerText = score.toString();
    document.getElementById("timer").innerText = timeLeft + "s";
    document.getElementById("startBtn").disabled = true;
    document.getElementById("restartBtn").disabled = false;
    
    // Clear any existing intervals
    if (moleInterval) clearInterval(moleInterval);
    if (plantInterval) clearInterval(plantInterval);
    if (gameTimer) clearInterval(gameTimer);
    
    // Start the game intervals
    moleInterval = setInterval(setMole, 1000); // 1000 milliseconds = 1 second
    plantInterval = setInterval(setPlant, 2000); // 2000 milliseconds = 2 seconds
    
    // Start the game timer
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft + "s";
        
        // Check for fever mode (last 10 seconds)
        if (timeLeft <= 10 && !feverMode) {
            enterFeverMode();
        }
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    // Clear any existing moles or plants
    if (currMoleTile) currMoleTile.innerHTML = "";
    if (currPlantTile) currPlantTile.innerHTML = "";
    
    currMoleTile = null;
    currPlantTile = null;
}

function enterFeverMode() {
    feverMode = true;
    
    // Clear existing intervals
    if (moleInterval) clearInterval(moleInterval);
    if (plantInterval) clearInterval(plantInterval);
    
    // Start faster intervals for fever mode
    moleInterval = setInterval(setMole, 500); // 500 milliseconds = 0.5 seconds
    plantInterval = setInterval(setPlant, 1000); // 1000 milliseconds = 1 second
    
    // Update timer display to show fever mode
    document.getElementById("timer").innerText = timeLeft + "s FEVER!";
    document.getElementById("timer").style.color = "#FFD700"; // Gold color for fever mode
    
    // Add fever mode notification
    let feverNotice = document.createElement("div");
    feverNotice.id = "fever-notice";
    feverNotice.innerText = "FEVER MODE! +20 points per hit!";
    feverNotice.style.position = "fixed";
    feverNotice.style.top = "50%";
    feverNotice.style.left = "50%";
    feverNotice.style.transform = "translate(-50%, -50%)";
    feverNotice.style.backgroundColor = "#FFD700";
    feverNotice.style.color = "#000";
    feverNotice.style.padding = "20px";
    feverNotice.style.borderRadius = "10px";
    feverNotice.style.fontSize = "24px";
    feverNotice.style.fontWeight = "bold";
    feverNotice.style.zIndex = "10000";
    feverNotice.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.8)";
    document.body.appendChild(feverNotice);
    
    // Remove fever notice after 3 seconds
    setTimeout(() => {
        if (feverNotice.parentNode) {
            feverNotice.parentNode.removeChild(feverNotice);
        }
    }, 3000);
}

function restartGame() {
    // Clear any existing intervals
    if (moleInterval) clearInterval(moleInterval);
    if (plantInterval) clearInterval(plantInterval);
    if (gameTimer) clearInterval(gameTimer);
    
    // Clear any existing moles or plants
    if (currMoleTile) currMoleTile.innerHTML = "";
    if (currPlantTile) currPlantTile.innerHTML = "";
    
    currMoleTile = null;
    currPlantTile = null;
    
    // Reset game state
    gameStarted = false;
    gameOver = false;
    feverMode = false;
    score = 0;
    timeLeft = 30;
    document.getElementById("score").innerText = score.toString();
    document.getElementById("timer").innerText = timeLeft + "s";
    document.getElementById("timer").style.color = "#e52521"; // Reset to original color
    document.getElementById("startBtn").disabled = false;
    document.getElementById("restartBtn").disabled = true;
    
    // Remove any existing fever notice
    let feverNotice = document.getElementById("fever-notice");
    if (feverNotice) {
        feverNotice.parentNode.removeChild(feverNotice);
    }
}

function endGame() {
    // Clear all intervals
    if (moleInterval) clearInterval(moleInterval);
    if (plantInterval) clearInterval(plantInterval);
    if (gameTimer) clearInterval(gameTimer);
    
    // Set game over state
    gameOver = true;
    
    // Update score display to show final score
    document.getElementById("score").innerText = "FINAL SCORE: " + score.toString();
    
    // Enable restart button
    document.getElementById("restartBtn").disabled = false;
}