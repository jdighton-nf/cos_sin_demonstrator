const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const width = 800;
const height = 800;

ctx.imageSmoothingEnabled = true;

ctx.fillStyle = 'white';
ctx.fillRect(0,0, width, height);

function clear_screen(){
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
}

class CoordField {
    // normalize coords for human people (0,00 is dead center
    constructor(width, height) {
        this.center = [width / 2, height / 2]
    }
    translate(x, y){

        let x_out = 0;
        let y_out = 0;

        if (x > 0){
            x_out = this.center[0] + Math.abs(x); 
        }
        if (x < 0){
            x_out = this.center[0] - Math.abs(x); 
        }
        if (x == 0){
            x_out = this.center[0]
        }

        if (y > 0){
            y_out = this.center[1] + Math.abs(y);
        }
        if (y < 0){
            y_out = this.center[1] - Math.abs(y);
        }
        if (y == 0){
            y_out = this.center[1];
        }

        const out = [x_out, y_out];
        
        return out
        
    }
}

class EventHandler {
    constructor(){
        document.addEventListener('keydown', this.handleKeyEvents);
    }
    handleKeyEvents(event){

        if(event.key == 'ArrowLeft'){
            vector.tick_ccw();
        }
        if(event.key == 'ArrowRight'){
            vector.tick_cw();
        }
    }
}

class Vector {
    constructor(mag, theta, ctx, field){
        this.ctx = ctx
        this.field = field
        this.mag = mag;
        this.theta = theta;
        this.x = mag; 
        this.y = 0;
    }
    tick_cw(){
        this.theta += 0.01;
        this.calc();
    }
    calc(){
    
        this.x = Math.cos(this.theta) * this.mag;
        this.y = Math.sin(this.theta) * this.mag;

        if(this.theta > 2 * Math.PI){
            this.theta = 0; 
        }

        this.draw();
    }
    draw(){
        clear_screen();

        // draw outer arc
        ctx.strokeStyle = 'black';
        ctx.lineWidth = '3';
        let coords = this.field.translate(0, 0);
        ctx.beginPath()
        ctx.arc(coords[0], coords[1], this.mag, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath()
        

        // draw rotating line

        ctx.strokeStyle = "black";
        ctx.lineWidth = '3';
        ctx.beginPath()
        coords = this.field.translate(0, 0);
        ctx.moveTo(coords[0], coords[1]);
        coords = this.field.translate(this.x, this.y);
        ctx.lineTo(coords[0], coords[1]);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // draw cos line
        ctx.strokeStyle = "red";
        ctx.lineWidth = '3';
        ctx.beginPath()
        coords = this.field.translate(0, 0)
        ctx.moveTo(coords[0], coords[1]);
        coords = this.field.translate(this.x, 0 );
        ctx.lineTo(coords[0], coords[1]);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // draw sin line
        ctx.strokeStyle = "green";
        ctx.lineWidth = '3';
        ctx.beginPath()
        coords = this.field.translate(0, 0)
        ctx.moveTo(coords[0], coords[1]);
        coords = this.field.translate(0, this.y);
        ctx.lineTo(coords[0], coords[1]);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // floating horizonal reference line
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 1;
        ctx.beginPath()
        coords = this.field.translate(0, this.y);
        ctx.moveTo(coords[0], coords[1]);
        coords = this.field.translate(this.x, this.y);
        ctx.lineTo(coords[0], coords[1]);
        ctx.stroke();
        ctx.closePath()

        // floating verticle reference line
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 1;
        ctx.beginPath()
        coords = this.field.translate(this.x, 0);
        ctx.moveTo(coords[0], coords[1]);
        coords = this.field.translate(this.x, this.y);
        ctx.lineTo(coords[0], coords[1]);
        ctx.stroke();
        ctx.closePath()

        // theta angle reading
        ctx.fillStyle = 'black';
        ctx.font = "20px Arial";
        coords = this.field.translate(20, 20);
        ctx.fillText(`theta ${this.theta.toPrecision(3)}`, coords[0], coords[1]);

        // floating reading for cos
        ctx.fillStyle = 'black';
        ctx.font = "15px Arial";
        coords = this.field.translate((this.x / 2) - 50, -10);
        let cos = (1 / this.mag * this.x).toPrecision(3); 
        ctx.fillText(`cos(theta)= ${cos}`, coords[0], coords[1]);

        // floating reading for sin
        ctx.fillStyle = 'black';
        ctx.font = "15px Arial";
        coords = this.field.translate(-120, (this.y / 2));
        let sin = (1 / this.mag * this.y).toPrecision(3) ;
        ctx.fillText(`sin(theta)= ${sin}`, coords[0], coords[1]);
     

    }

}

let field = new CoordField(width, height);
let vector = new Vector((width / 2 - 25), 0, ctx, field)
//let eventHandler = new EventHandler();

// call vector.tickccw() to advance animation

function run(){
    const FRAMES_PER_SECOND = 30;

const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;
var lastFrameTime = 0;  // the last frame time
function update(time){
    if(time-lastFrameTime < FRAME_MIN_TIME){ 
        requestAnimationFrame(update);
        return; // 
    }
    lastFrameTime = time; 
    
    vector.tick_cw();

    requestAnimationFrame(update);
}

requestAnimationFrame(update); 
}

run()