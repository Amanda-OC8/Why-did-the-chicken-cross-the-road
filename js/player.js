class Player {
    // Create the player, can be of two types, both with the same dimensions
    constructor(ctx, posX, posY,  canvasSize, numPlayer, imgName) {
        this.ctx = ctx
        this.playerPos = {
            x: posX,
            y: posY
        }
        this.playerDim = {
            w : 50,
            h : 50
        }
        this.canvasSize = canvasSize
        this.numPlayer = numPlayer
        // The properties to load the image and the information to animate them
        this.img = new Image()
        this.img.src = imgName  
        //The frame information for the animation
        this.img.frames = 7
        this.img.framesIndex = 0
    }
    draw(framesCounter) {
        // Draw the player, considering the frame position, to animate the image
        this.ctx.drawImage(this.img, this.img.framesIndex * Math.floor(this.img.width / this.img.frames) ,0 ,Math.floor(this.img.width / this.img.frames), this.img.height, this.playerPos.x, this.playerPos.y, this.playerDim.w, this.playerDim.h)

        this.animate(framesCounter)
    }
    
    move(dir) {
        // Move of each player. Player 1 use arrow keys. Player 2 use WASD keys
        // Only move inside the canvas
        if (this.numPlayer == 1) {
            // Arrow key control
            this.playerPos.x + this.playerDim.w + 6 <= this.canvasSize.w && dir === "right" ? this.playerPos.x += 15 : null
            this.playerPos.x - 5 >= 0 && dir === "left" ? this.playerPos.x -= 15 : null
            this.playerPos.y - 8 >= 0 && dir === "up" ? this.playerPos.y -= 15 : null
            this.playerPos.y + this.playerDim.h + 8 <= this.canvasSize.h && dir === "down" ? this.playerPos.y += 15 : null
        }
        if (this.numPlayer == 2) {
            // WASD key control
            this.playerPos.x + this.playerDim.w + 6 <= this.canvasSize.w && dir === "d" ? this.playerPos.x += 15 : null
            this.playerPos.x - 5 >= 0 && dir === "a" ? this.playerPos.x -= 15 : null
            this.playerPos.y - 8 >= 0 && dir === "w" ? this.playerPos.y -= 15 : null
            this.playerPos.y + this.playerDim.h + 8 <= this.canvasSize.h && dir === "s" ? this.playerPos.y += 15 : null
        }
    }

    animate(framesCounter) {
        // The animation. Move along the sprite width
        if (framesCounter % 5 == 0) {
            this.img.framesIndex++;
        }
        if (this.img.framesIndex > this.img.frames - 1) {
            this.img.framesIndex = 0;
        }
    }

    isWin() {
        // Win condition: the player reachs the superior side of the canvas
       return this.playerPos.y <= 0
    }

    sing(talk) {
        // The players sings. Each player has a different sound and key, based on their control
        if (this.numPlayer == 1 && talk === "ShiftR") {
            const audio = new Audio("./sounds/quiquiriqui.wav")
            audio.volume = 0.5
            audio.play()
        } 
        if (this.numPlayer == 2 && talk === "q") {
            const audio = new Audio("./sounds/chip.wav")
            audio.volume = 1
            audio.play()
        }
    }
}