// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.FIREBASE_APIKEY || "AIzaSyBL8O3QL6eNDibwY6LMJaI9fmUAbujIVJE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "whac-a-g-spot.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "whac-a-g-spot",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "whac-a-g-spot.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "934482651756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:934482651756:web:6bdee2e7f28e38e7ccc649",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VBGNLCNXBL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currCharacterPTile;
let currCharacterGTile;
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
let finalScore = 0; // Store final score for leaderboard
let scoreSaved = false; // Track if score has been saved

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
    
    // Set up leaderboard
    setupLeaderboard();
}

function setGame() {
    //set up the grid in html
    const board = document.getElementById("board");
    board.innerHTML = ""; // Clear any existing content
    
    for (let i = 0; i < 9; i++) { //i goes from 0 to 8, stops at 9
        //<div id="0-8"></div>
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        // Add some styling to ensure the tile is visible and clickable
        tile.style.cssText = "cursor: pointer; position: relative; z-index: 2;";
        board.appendChild(tile);
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
        customCursor.style.left = e.clientX + "px";
        customCursor.style.top = e.clientY + "px";
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

function setCharacterP() {
    if (!gameStarted || gameOver) {
        return;
    }
    if (currCharacterPTile) {
        currCharacterPTile.innerHTML = "";
    }
    let characterP = document.createElement("img");
    characterP.src = "./assets/characterP_nor.png";

    let num = getRandomTile();
    if (currCharacterGTile && currCharacterGTile.id == num) {
        return;
    }
    currCharacterPTile = document.getElementById(num);
    
    // Check if element exists
    if (!currCharacterPTile) {
        return;
    }
    
    currCharacterPTile.appendChild(characterP);
    
    // Add animation class
    setTimeout(() => {
        if (characterP.parentNode === currCharacterPTile) {
            characterP.classList.add("pop-up");
        }
    }, 10);
}

function setCharacterG() {
    if (!gameStarted || gameOver) {
        return;
    }
    if (currCharacterGTile) {
        currCharacterGTile.innerHTML = "";
    }
    let characterG = document.createElement("img");
    characterG.src = "./assets/characterG_nor.png";

    let num = getRandomTile();
    if (currCharacterPTile && currCharacterPTile.id == num) {
        return;
    }
    currCharacterGTile = document.getElementById(num);
    
    // Check if element exists
    if (!currCharacterGTile) {
        return;
    }
    
    currCharacterGTile.appendChild(characterG);
    
    // Add animation class
    setTimeout(() => {
        if (characterG.parentNode === currCharacterGTile) {
            characterG.classList.add("pop-up");
        }
    }, 10);
}

function selectTile() {
    if (gameOver) {
        return;
    }
    
    // Determine point value based on fever mode
    let pointValue = feverMode ? 20 : 10;
    
    // Check if we're hitting the characterP (characterP_nor)
    if (this == currCharacterPTile) {
        // Hit the characterP - show angry characterP and deduct points
        score -= pointValue;
        if (score < 0) score = 0; // Don't let score go below 0
        document.getElementById("score").innerText = score.toString(); //update score html
        
        // Change characterP to angry version
        if (currCharacterPTile && currCharacterPTile.firstChild) {
            currCharacterPTile.firstChild.src = "./assets/characterP_angry.png";
            
            // Reset characterP image after a delay
            setTimeout(() => {
                if (currCharacterPTile && currCharacterPTile.firstChild) {
                    currCharacterPTile.firstChild.src = "./assets/characterP_nor.png";
                }
            }, 300);
        }
    }
    // Check if we're hitting the characterG (normal or happy)
    else if (this == currCharacterGTile) {
        // Check if it's the normal characterG (characterG_nor)
        if (currCharacterGTile && currCharacterGTile.firstChild && 
            currCharacterGTile.firstChild.src.includes("characterG_nor")) {
            // Hit the normal characterG - add score and show happy version
            score += pointValue;
            document.getElementById("score").innerText = score.toString(); //update score html
            
            // Change characterG to happy version
            if (currCharacterGTile && currCharacterGTile.firstChild) {
                currCharacterGTile.firstChild.src = "./assets/characterG_happy.png";
            }
            
            // Change characterP to angry version
            if (currCharacterPTile && currCharacterPTile.firstChild) {
                currCharacterPTile.firstChild.src = "./assets/characterP_angry.png";
                
                // Reset characterP image after a delay
                setTimeout(() => {
                    if (currCharacterPTile && currCharacterPTile.firstChild) {
                        currCharacterPTile.firstChild.src = "./assets/characterP_nor.png";
                    }
                }, 300);
            }
            
            // Reset characterG to normal after a delay
            setTimeout(() => {
                if (currCharacterGTile && currCharacterGTile.firstChild) {
                    currCharacterGTile.firstChild.src = "./assets/characterG_nor.png";
                }
            }, 1000);
        } else if (currCharacterGTile && currCharacterGTile.firstChild && 
            currCharacterGTile.firstChild.src.includes("characterG_happy")) {
            // Hit the happy characterG - add score
            score += pointValue;
            document.getElementById("score").innerText = score.toString(); //update score html
            
            // Change characterP to angry version
            if (currCharacterPTile && currCharacterPTile.firstChild) {
                currCharacterPTile.firstChild.src = "./assets/characterP_angry.png";
                
                // Reset characterP image after a delay
                setTimeout(() => {
                    if (currCharacterPTile && currCharacterPTile.firstChild) {
                        currCharacterPTile.firstChild.src = "./assets/characterP_nor.png";
                    }
                }, 300);
            }
            
            // Reset characterG to normal after a delay
            setTimeout(() => {
                if (currCharacterGTile && currCharacterGTile.firstChild) {
                    currCharacterGTile.firstChild.src = "./assets/characterG_nor.png";
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
    moleInterval = setInterval(setCharacterP, 1000); // 1000 milliseconds = 1 second
    plantInterval = setInterval(setCharacterG, 2000); // 2000 milliseconds = 2 seconds
    
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
    
    // Clear any existing characterPs or characterGs
    if (currCharacterPTile) currCharacterPTile.innerHTML = "";
    if (currCharacterGTile) currCharacterGTile.innerHTML = "";
    
    currCharacterPTile = null;
    currCharacterGTile = null;
}

function enterFeverMode() {
    feverMode = true;
    
    // Clear existing intervals
    if (moleInterval) clearInterval(moleInterval);
    if (plantInterval) clearInterval(plantInterval);
    
    // Start faster intervals for fever mode
    moleInterval = setInterval(setCharacterP, 500); // 500 milliseconds = 0.5 seconds
    plantInterval = setInterval(setCharacterG, 1000); // 1000 milliseconds = 1 second
    
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
    
    // Clear any existing characterPs or characterGs
    if (currCharacterPTile) currCharacterPTile.innerHTML = "";
    if (currCharacterGTile) currCharacterGTile.innerHTML = "";
    
    currCharacterPTile = null;
    currCharacterGTile = null;
    
    // Reset game state
    gameStarted = false;
    gameOver = false;
    feverMode = false;
    scoreSaved = false; // Reset score saved flag
    score = 0;
    timeLeft = 30;
    document.getElementById("score").innerText = score.toString();
    document.getElementById("timer").innerText = timeLeft + "s";
    document.getElementById("timer").style.color = "#e52521"; // Reset to original color
    document.getElementById("startBtn").disabled = false;
    document.getElementById("restartBtn").disabled = true;
    
    // Hide save score input
    document.getElementById("add-score").style.display = "none";
    
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
    
    // Store final score
    finalScore = score;
    
    // Update score display to show final score
    document.getElementById("score").innerText = "FINAL SCORE: " + score.toString();
    
    // Enable restart button
    document.getElementById("restartBtn").disabled = false;
    
    // Show save score option only if not already saved
    if (!scoreSaved) {
        document.getElementById("add-score").style.display = "block";
        document.getElementById("player-name").focus();
    }
}

function setupLeaderboard() {
    // Save score button
    document.getElementById("save-score").addEventListener("click", saveScore);
    
    // Set up real-time listener for leaderboard updates
    db.collection('leaderboard')
        .orderBy('score', 'desc')
        .limit(10)
        .onSnapshot((querySnapshot) => {
            const leaderboard = [];
            querySnapshot.forEach((doc) => {
                leaderboard.push(doc.data());
            });
            displayLeaderboard(leaderboard);
        }, (error) => {
            console.error("Error listening to leaderboard:", error);
        });
}

function loadLeaderboard() {
    // This function is now handled by the real-time listener in setupLeaderboard
    // Keep it for backward compatibility or manual refresh if needed
}

function displayLeaderboard(leaderboard) {
    // Display leaderboard
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "";
    
    for (let i = 0; i < Math.min(leaderboard.length, 10); i++) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${leaderboard[i].name}</td>
            <td>${leaderboard[i].score}</td>
        `;
        tbody.appendChild(row);
    }
}

function saveScore() {
    const nameInput = document.getElementById("player-name");
    const name = nameInput.value.trim();
    
    if (name === "") {
        alert("Please enter your name");
        return;
    }
    
    // Check if score already saved
    if (scoreSaved) {
        alert("Score already saved!");
        return;
    }
    
    // Save to Firestore
    db.collection('leaderboard').add({
        name: name,
        score: finalScore,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        // Mark score as saved
        scoreSaved = true;
        
        // Hide save score input
        document.getElementById("add-score").style.display = "none";
        
        // Clear input
        nameInput.value = "";
        
        // Show confirmation
        alert("Score saved to global leaderboard!");
    })
    .catch((error) => {
        console.error("Error saving score to Firestore:", error);
        alert("Failed to save score. Please check Firestore security rules.");
    });
}