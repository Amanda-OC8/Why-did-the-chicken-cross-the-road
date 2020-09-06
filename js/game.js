const Game = {
    name: 'Frogger-type game',
    description: 'A frogger-type game, with a chicken',
    version: '1.0.0',
    author: 'Amanda Ordóñez, Pedro Conde',
    license: undefined, // Music: “Wacky Race”, from PlayOnLoop.com Licensed under Creative Commons by Attribution 4.0
    canvasDom: undefined,
    ctx: undefined,
    canvasSize: {
        w: undefined ,
        h: undefined
    },
    FPS: 60,
    framesCounter: 0,
    background: undefined,
    player: undefined,
    obstacles: [],
    lives: 3,
    highwayLaneNumber : 4,
    bckSound: undefined,
    keys: {
        upArrow: 38,
        downArrow: 40,
        leftArrow: 37,
        rightArrow: 39,
        wKey: 87,
        aKey: 65,
        sKey: 83,
        dKey: 68,
        shiftRigth: 16,
        qKey: 81
    },

    initialScreen() {
        // A screen to load the context and other elements (dimensions, events) and draw the background in the version without images
        this.canvasDom = document.getElementById("myCanvas")
        this.ctx = this.canvasDom.getContext("2d")
        this.setDimensions()
        this.setEventListeners()
        // Create the background from their class
        this.background = new Background(this.ctx, this.canvasSize, this.highwayLaneNumber, this.lives)
        this.highwayLanePosition = this.background.highwayLanePosition() // Return an object with the dimensions of each highway lane
        this.drawRoad() //Draw the elements
    },

    startGame() {
        // Start the game when the button is clicked. Start the music on loop (previously added in the html page)
        this.bckSound = document.querySelector(".bck")
        this.bckSound.volume = 0.1
        this.theGame() // The method game have the core of the game
    },

    setDimensions() {
        // The dimensions of the canvas, from the html
        this.width = this.canvasDom.width;  
        this.height = this.canvasDom.height;
        this.canvasSize.w = this.width;
        this.canvasSize.h = this.height;
    },

    theGame() {
        // First, checked the number of players. If it is only one, what it is chooses. For default, the player 1 is the chosen one.
        !this.p1.classList.contains("unselected") && !this.p2.classList.contains("unselected") ? this.player = [this.player1, this.player2] : !this.p2.classList.contains("unselected") ? this.player = this.player2 : this.player = this.player1
        // With two players, the initial position in the X axis is changed
        if (this.player.length == 2) {
            this.player[0].playerPos.x = this.canvasSize.w * 3 / 4
            this.player[1].playerPos.x = this.canvasSize.w / 4
        }
        // Start the music
        this.bckSound.play()

        //The interval where all the elements in the game are draw and redraw
        this.interval = setInterval(() => {
            this.framesCounter++
            this.clearScreen() // Clear screen to redraw
            this.clearObst()   // Delete the obstacles that leave the screen to avoid infinite accumulations

            //Initiate a countdown when the game starts for first time the game to allow the obstacles appear along all the screen
            if (this.framesCounter < 590 && this.lives === 3) {
                this.countDown(Math.floor((590 - this.framesCounter) / 100))
            } else {
                // Draw the player(s)
                this.player.length == 2 ? this.drawAll2P() : this.drawAll()
            }
            
            // Add two new obstacles in two differents and random highway lanes
            if (this.framesCounter % 80 == 0) {
                this.randomHighwayLane = [Math.floor(Math.random() * (this.highwayLaneNumber)), this.randomHighwayLane = Math.floor(Math.random() * (this.highwayLaneNumber))]
                // The while avoid the appeance of the two obstacles in the same highway lane
                while(this.randomHighwayLane[0] === this.randomHighwayLane[1]) {
                    this.randomHighwayLane = [Math.floor(Math.random() * (this.highwayLaneNumber)), this.randomHighwayLane = Math.floor(Math.random() * (this.highwayLaneNumber))]
                } 
                // Add the obstacles in the array to printing them
                this.obstacles.push(new Obstacle(this.ctx, this.canvasSize.w, this.highwayLanePosition.middlePoint[this.randomHighwayLane[0]] - 35))
                this.obstacles.push(new Obstacle(this.ctx, this.canvasSize.w, this.highwayLanePosition.middlePoint[this.randomHighwayLane[1]] - 35))
            } 

            //Move along the X axis the obstacles
            this.framesCounter % 10 == 0 ? this.obstacles.forEach(elm => elm.move(this.highwayLanePosition)) : null
            
            // Check if the player(s) collide(s) with an obstacle
            this.player.length == 2 ? this.obstacles.forEach(elm => this.isCollision2P(elm)) : this.obstacles.forEach(elm => this.isCollision(elm))
           
            // Check the victory conditions, from the player class
            if (this.player.length == 2) {
                if (this.player[0].isWin() && this.player[1].isWin) {
                    clearInterval(this.interval)
                    this.clearScreen()
                    this.winScreen()
                }
            } else {
                if (this.player.isWin()) {
                    clearInterval(this.interval)
                    this.clearScreen()
                    this.winScreen()
                }
            }

        }, 1000 / this.FPS)
    },

    reset() {
        // Definition of the background and the players

        this.background = new Background(this.ctx, this.canvasSize, this.highwayLaneNumber, this.lives)

        // Load the class player from the html to check the player or players chosen
        this.p1 = document.querySelector(".player1")
        this.p2 = document.querySelector(".player2")
        // The player 1 has the chicken avatar and the arrow keys control. The player 2 has the chick avatar and the wasd controls
        this.player1 = new Player(this.ctx, this.canvasSize.w / 2, this.canvasSize.h - 50,  this.canvasSize, 1, "./images/animate-chicken.png")
        this.player2 = new Player(this.ctx, this.canvasSize.w / 2, this.canvasSize.h - 50, this.canvasSize, 2, "./images/animate-chick.png")
               
    },

    drawAll() {
        //Draw all the elements of the game: the background, the player and the obstacles
        this.background.draw()
        this.player.draw(this.framesCounter)
        this.obstacles.forEach(elm => elm.draw(this.framesCounter))
    },

    drawAll2P() {
        //Draw all the elements of the game: the background, the players and the obstacles
        this.background.draw()
        this.player[0].draw(this.framesCounter)
        this.player[1].draw(this.framesCounter)
        this.obstacles.forEach(elm => elm.draw(this.framesCounter))
    },

    drawRoad() {
        //Draw the initial elements on screen: the road with canvas rectangles
        this.reset()
        this.background.drawOld()
    },

    isCollision(elm) {
        // The collision checking. For one player and each one of the elements. The collision exists when an obstacle border and the player borders have the same positions
        /* Conditions. Collision for the right side
        this.player.playerPos.x + this.player.playerDim.w >= this.obstacles.obsPos.x 
        Collision for the left side
        this.player.playerPos.x <= this.obstacles.obsPos.x + 121
        Collision for the down side
        this.player.playerPos.y <= this.obstacle.obsPos.y + 70
        Collision for the up side
        this.player.playerPos.y + this.player.playerDim.h >= this.obstacle.obsPos.y 
        */

        if (this.player.playerPos.x + this.player.playerDim.w + 5 >= elm.obsPos.x &&
            this.player.playerPos.x - 5 <= elm.obsPos.x + 121 &&
            this.player.playerPos.y - 5 <= elm.obsPos.y + 70 &&
            this.player.playerPos.y + this.player.playerDim.h + 5 >= elm.obsPos.y) {
            // If a collision occurs, the player losts a live
            this.lostLive()
            if (this.lives <= 0) {
                // When the lives reach zero, the game end
                clearInterval(this.interval)
                this.clearScreen()
                this.gameOverScreen()
            }
        }
    },

    isCollision2P(elm) {
        // The collision checking. For two the players and each one of the elements. The collision exists when an obstacle border and the player borders have the same positions
         /* Conditions. Collision for the right side
         this.player.playerPos.x + this.player.playerDim.w >= this.obstacles.obsPos.x
        Collision for the left side
        this.player.playerPos.x <= this.obstacles.obsPos.x + 121
        Collision for the down side
        this.player.playerPos.y <= this.obstacle.obsPos.y + 70
        Collision for the up side
        this.player.playerPos.y + this.player.playerDim.h >= this.obstacle.obsPos.y
        */

        if ((this.player[0].playerPos.x + this.player[0].playerDim.w + 5 >= elm.obsPos.x &&
            this.player[0].playerPos.x - 5 <= elm.obsPos.x + 121 &&
            this.player[0].playerPos.y - 5 <= elm.obsPos.y + 70 &&
            this.player[0].playerPos.y + this.player[0].playerDim.h + 5 >= elm.obsPos.y) ||
            (this.player[1].playerPos.x + this.player[1].playerDim.w + 5 >= elm.obsPos.x &&
            this.player[1].playerPos.x - 5 <= elm.obsPos.x + 121 &&
            this.player[1].playerPos.y - 5 <= elm.obsPos.y + 70 &&
            this.player[1].playerPos.y + this.player[1].playerDim.h + 5 >= elm.obsPos.y)) {
            // If a collision occurs, a live is lost
            this.lostLive()
            if (this.lives <= 0) {
                // When the lives reach zero, the game end
                clearInterval(this.interval)
                this.clearScreen()
                this.gameOverScreen()
            }
        }
    },

    lostLive() {
        // When a live is lost. A small pause in the interval
        clearInterval(this.interval)
        this.clearScreen() // Clean screen and show a balck screen in miliseconds
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, this.canvasSize.w, this.canvasSize.h)
        this.lives-- //One less live
        this.lives > 0 ? this.sound("./sounds/Splash.mp3") : null //Before game over, a sound is reproduce when a collision is detected
        this.bckSound.pause()
        this.reset()    //Restart the game
        this.theGame() 
    },

    gameOverScreen() {
        // The game over screen
        this.clearScreen()
        this.ctx.fillStyle = "grey"
        this.ctx.fillRect(0, 0, this.canvasSize.w, this.canvasSize.h)
        //Show a different image from each player, or if are two players
        this.GOImg = new Image()
        this.player.length == 2 ? this.GOImg.src = "./images/GOP2.png" : this.player.numPlayer == 2 ? this.GOImg.src = "./images/GO2.png" : this.GOImg.src = "./images/GO1.png"
        // Load the image
        this.GOImg.onload = () => this.ctx.drawImage(this.GOImg, this.canvasSize.w / 2 - this.GOImg.width / 2, this.canvasSize.h / 2 - this.GOImg.height / 2, this.GOImg.width, this.GOImg.height);
        //Stop the background musci and start a sad music
        this.bckSound.pause()
        this.sound("./sounds/GOMusic.wav")
        this.player = undefined
    },

    winScreen() {
        // The win screen
        this.ctx.fillStyle = "green"
        this.ctx.fillRect(0, 0, this.canvasSize.w, this.canvasSize.h)
        // Exisit a finite number of images and one is randomly choosen
        this.winImgArr = ["./images/Win1.png", "./images/Win2.png", "./images/Win3.png", "./images/Win4.png"]
        this.winImg = new Image()
        this.winImg.src = this.winImgArr[Math.floor(Math.random() * this.winImgArr.length)]
        this.winImg.onload = () => this.ctx.drawImage(this.winImg, this.canvasSize.w / 2 - this.winImg.width / 2, this.canvasSize.h / 2 - this.winImg.height / 2, this.winImg.width, this.winImg.height);
        //Stop the background music and start a win music
        this.bckSound.pause()
        this.sound("./sounds/WinMusic.wav")
    },

    clearObst() {
        //When the obstacles leave the screen are removed
        this.obstacles = this.obstacles.filter(elm => elm.obsPos.x >= -121)
    },


    countDown(seconds) {
        //The count down before start
        this.background.draw()
        this.obstacles.forEach(elm => elm.draw(this.framesCounter))
        this.ctx.font = "60px Verdana"
        this.ctx.fillStyle = "white"
        this.ctx.fillText(`Start in: ${seconds}`, this.canvasSize.w /4, this.canvasSize.h / 2)
    },
    
    sound(src) {
        // A method to load and reproduce new sounds
        const audio = new Audio(src)
        audio.volume = 0.5
        audio.play()
    },

    setEventListeners() {
        //Detect when a key is pressed. Load the move and "sing" keys. Load all for the player class but each one works in one setting
        document.onkeydown = evt => {
            if (this.player.length == 2) {
                //For two players, check all the elements
                this.player.forEach(elm => {
                    // Arrow keys code
                    evt.keyCode === this.keys.rightArrow ? elm.move("right") : null
                    evt.keyCode === this.keys.leftArrow ? elm.move("left") : null
                    evt.keyCode === this.keys.upArrow ? elm.move("up") : null
                    evt.keyCode === this.keys.downArrow ? elm.move("down") : null

                    // WASD keys code
                    evt.keyCode === this.keys.dKey ? elm.move("d") : null
                    evt.keyCode === this.keys.aKey ? elm.move("a") : null
                    evt.keyCode === this.keys.wKey ? elm.move("w") : null
                    evt.keyCode === this.keys.sKey ? elm.move("s") : null

                    // The player(s) talk(s)
                    evt.keyCode === this.keys.shiftRigth ? elm.sing("ShiftR") : null
                    evt.keyCode === this.keys.qKey ? elm.sing("q") : null

                })
            } else {
                // Arrow keys code
                evt.keyCode === this.keys.rightArrow ? this.player.move("right") : null
                evt.keyCode === this.keys.leftArrow ? this.player.move("left") : null
                evt.keyCode === this.keys.upArrow ? this.player.move("up") : null
                evt.keyCode === this.keys.downArrow ? this.player.move("down") : null

                // WASD keys code
                evt.keyCode === this.keys.dKey ? this.player.move("d") : null
                evt.keyCode === this.keys.aKey ? this.player.move("a") : null
                evt.keyCode === this.keys.wKey ? this.player.move("w") : null
                evt.keyCode === this.keys.sKey ? this.player.move("s") : null

                // The player talks
                evt.keyCode === this.keys.shiftRigth ? this.player.sing("ShiftR") : null
                evt.keyCode === this.keys.qKey ? this.player.sing("q") : null
            }           
       
        }
    },

    clearScreen() {
        // Clean screen
        this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
    }  

}
