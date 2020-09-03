class Background {
    // Create the background image. The class has two methods for this, with and without images.
    constructor(ctx, canvasSize, highwayLaneNumber, lives) {
        this.ctx = ctx
        this.canvasSize = canvasSize
        this.highwayLaneNumber = highwayLaneNumber
        this.lives = lives
    }

    draw() {
        //The grass
        this.grassH = 50
        this.imgGrass = new Image()
        this.imgGrass.src = "./images/grass.png"
        // The asset must be adjusted to fill all the canvas width. The pattern option is used.
        this.grassPattern = this.ctx.createPattern(this.imgGrass, "repeat")
        this.ctx.fillStyle = this.grassPattern;
        this.ctx.fillRect(0, 0, this.canvasSize.w, this.grassH);
        this.ctx.fillRect(0, this.canvasSize.h - this.grassH, this.canvasSize.w, this.canvasSize.h)
       
        //The white lines bewtween the grass and the road
        this.ctx.fillStyle = 'white';
        this.whiteL = 10
        this.ctx.fillRect(0, 50, this.canvasSize.w, this.whiteL);
        this.ctx.fillRect(0, this.canvasSize.h - 60, this.canvasSize.w, this.whiteL);
        
        // The road, drawing different highway lanes
        //Highway lane dimensions. All is referred and automated in case to change the dimensions or the number of highway lanes.
        this.highwayLaneH = (this.canvasSize.h - this.grassH * 2 - this.whiteL * 2) / this.highwayLaneNumber // The dimension of each highway lane
        //Creation of the separation of the highway lanes  using an array.
        this.highwayLaneSeparation = []
        for (let i = 0; i < this.highwayLaneNumber; i++) {
            this.highwayLaneSeparation[i] = this.highwayLaneH * i + this.grassH + this.whiteL
        }       
        // The pattern for each highwaylane
        this.imgRoad = new Image()
        this.imgRoad.src = "./images/road-tile.png"
        this.roadPattern = this.ctx.createPattern(this.imgRoad, "repeat")
        this.ctx.fillStyle = this.roadPattern
        this.highwayLaneSeparation.forEach(elm => {
            this.ctx.fillStyle = this.roadPattern
            this.ctx.fillRect(0, elm, this.canvasSize.w, this.highwayLaneH)    
        })
        this.highwayLaneDivision = 4 //A yellow line bewteen highway lanes to separate each one
        // Draw each line separation
        this.highwayLaneSeparation.forEach(element => {
            this.ctx.fillStyle = 'yellow';
            this.ctx.fillRect(0, element, this.canvasSize.w, this.highwayLaneDivision);
        });
        //Draw the dashed line in the middle of the higway lane
        this.highwayLaneSeparation.forEach(elm => {
            this.ctx.beginPath()
            this.ctx.setLineDash([40, 20])
            this.ctx.strokeStyle = 'white'
            this.ctx.lineWidth = 6
            this.ctx.moveTo(0, elm + this.highwayLaneH / 2)
            this.ctx.lineTo(this.canvasSize.w, elm + this.highwayLaneH / 2)
            this.ctx.stroke()
        })

        //Draw the lives. Using a different image for each number of lives
        this.imgLives = new Image()
        if (this.lives === 3) {
            this.imgLives.src = "./images/Lives-3.png"
        } else if (this.lives === 2) {
            this.imgLives.src = "./images/Lives-2.png"
        } else if (this.lives === 1) {
            this.imgLives.src = "./images/Lives-1.png"
        }
       this.ctx.drawImage(this.imgLives, 5, 0, 440, 50)


    }

    highwayLanePosition() {
        // Exports the highway lanes position for use later. Invoke the draw method to not repeat the calculations
        this.draw()
        this.highwayLane = {
            middlePoint : this.highwayLaneSeparation.map(elm => elm + this.highwayLaneH / 2), //The middlepoint. The obstacles appear from this point
            height: this.highwayLaneH, // The height
            position: this.highwayLaneSeparation // The position on the canvas
        }
        return this.highwayLane    //The complete object
    }

    drawOld() {
        // drawOld is a previous version of the background that draw the background with rectangles on the canvas
        //The green lines
        this.ctx.fillStyle = 'green';
        this.greenH = 50
        this.ctx.fillRect(0, 0, this.canvasSize.w, this.greenH);
        this.ctx.fillRect(0, this.canvasSize.h - this.greenH, this.canvasSize.w, this.greenH);

        //The white lines
        this.ctx.fillStyle = 'white';
        this.whiteL = 10
        this.ctx.fillRect(0, 50, this.canvasSize.w, this.whiteL);
        this.ctx.fillRect(0, this.canvasSize.h - 60, this.canvasSize.w, this.whiteL);

        // The road, drawing different highway lanes
        //Highway lane dimensions. All is referred and automated in case to change the dimensions or the number of highway lanes.
        this.highwayLaneH = (this.canvasSize.h - this.greenH * 2 - this.whiteL * 2) / this.highwayLaneNumber // The dimension of each one
        //The road, one rectangle
        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(0, this.greenH + this.whiteL, this.canvasSize.w, this.canvasSize.h - this.greenH * 2 - this.whiteL * 2);
        //Creation of the separation of the highway lanes using an array
        this.highwayLaneSeparation = []
        for (let i = 0; i < this.highwayLaneNumber; i++) {
            this.highwayLaneSeparation[i] = this.highwayLaneH * (i + 1) + this.greenH + this.whiteL
        }
        this.highwayLaneDivision = 4 //A yellow line bewteen highway lanes to separate each one
        // Draw each line separation
        for (let i = 0; i < this.highwayLaneDivision - 1; i++){
            this.ctx.fillStyle = 'yellow';
            this.ctx.fillRect(0, this.highwayLaneSeparation[i], this.canvasSize.w, 5);
        };
        //Draw the dashed line in the higway lane
        this.highwayLaneSeparation.forEach(elm => {
            this.ctx.beginPath()
            this.ctx.setLineDash([40, 20])
            this.ctx.strokeStyle = 'white'
            this.ctx.lineWidth = 6
            this.ctx.moveTo(0, elm - this.highwayLaneH / 2)
            this.ctx.lineTo(this.canvasSize.w, elm - this.highwayLaneH / 2)
            this.ctx.stroke()
        })

        // Show a text to indicate that the game is not start yet
        this.ctx.font = "50px Verdana"
        this.ctx.fillStyle = "black"
        this.ctx.fillText("Loading the elements...", this.canvasSize.w / 4, this.canvasSize.h / 2 - 5)

        //The live counter in the version without images
        this.ctx.fillStyle = "black"
        this.ctx.font = "50px Verdana"
        this.ctx.fillText(`Lives: ${this.lives}`, 10, 40)
    }
}


