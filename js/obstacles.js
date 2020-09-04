class Obstacle {
    // Generate obstacles in an X and an Y position.
    constructor(ctx, posX, posY){
        this.ctx = ctx
        this.obsPos = {
            x: posX,
            y: posY
        }
        this.obsSize = {
            w: 127,
            h: 70
        }
        //Create the image for the obstacle.
        this.img = new Image()
        this.img.src = "./images/car-animate.png"
        this.img.frames = 10
        this.img.framesIndex = 0
    }
    draw(framesCounter) {
           
        this.ctx.drawImage(this.img, this.img.framesIndex * Math.floor(this.img.width / this.img.frames), 0, Math.floor(this.img.width / this.img.frames), this.img.height, this.obsPos.x, this.obsPos.y, this.obsSize.w, this.obsSize.h)
        this.animate(framesCounter)
    }

    animate(framesCounter) {
        // The animation. Move along the sprite width
        if (framesCounter % 10 == 0) {
            this.img.framesIndex++;
        }
        if (this.img.framesIndex > this.img.frames - 1) {
            this.img.framesIndex = 0;
        }
    }
    
    move(positionY) {
        // Move the obstacle. The obstacle only has a right to left move. Each obstacle have a different speed in each highway lane
        this.obsPos.y === positionY.middlePoint[3] -35 ? this.obsPos.x -= 20 : null
        this.obsPos.y === positionY.middlePoint[2] - 35 ? this.obsPos.x -= 25 : null
        this.obsPos.y === positionY.middlePoint[1] - 35 ? this.obsPos.x -= 30 : null
        this.obsPos.y === positionY.middlePoint[0] - 35 ? this.obsPos.x -= 35 : null
       
    }
}
