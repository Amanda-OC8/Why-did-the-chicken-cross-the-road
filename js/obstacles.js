class Obstacle {
    // Generate obstacles in an X and an Y position.
    constructor(ctx, posX, posY){
        this.ctx = ctx
        this.obsPos = {
            x: posX,
            y: posY
        }
        this.obsSize = {
            w: 121,
            h: 70
        }
        //Create the image for the obstacle.
        this.img = new Image()
        this.img.src = "./images/car-2.png"
    }
    draw() {
        // Draw the obstacle from the image
        this.ctx.drawImage(this.img, this.obsPos.x, this.obsPos.y, this.obsSize.w, this.obsSize.h)
    }

    move() {
        // Move the obstacle. The obstacle only has a right to left move.
        this.obsPos.x -=25
    }
}
