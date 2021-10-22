//Canvas set up
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

//Mouse position


const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(event) {
    let canvasPosition = canvas.getBoundingClientRect();
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    console.log(mouse.x + ' ' + mouse.y)

})
canvas.addEventListener('mouseup', function(event) {
    mouse.click = false;
})
//Player
const playerLeft = new Image();
playerLeft.src = 'src/fish_sprite_left.png';

const playerRight = new Image();
playerRight.src = 'src/fish_sprite_right.png';

const oceanBackground = new Image();
oceanBackground.src = 'src/ocean.jfif'

const bubbleImg = new Image();
bubbleImg.src = 'src/bubble.png'

class Player {
    constructor() {
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 30;
        this.angle = 0;

        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;

        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;

        if (mouse.x != this.x) {
            this.x -= dx/30;
        }
        if (mouse.y != this.y) {
            this.y -= dy/30;
        }
        if (gameFrame % 10 == 0) {
            this.frameX++;
            if (this.frameX > 3) {
                this.frameX = 0;
                this.frameY++;
            }
            if (this.frameY > 2) {
                this.frameY = 0;
            }
        }
    }
    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke();
        }
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (this.x <= mouse.x) {
            ctx.drawImage(playerRight,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                0 - 60,
                0 - 45,
                this.spriteWidth/4,
                this.spriteHeight/4,
                )
        } else {
            ctx.drawImage(playerLeft,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                0 - 60,
                0 - 45,
                this.spriteWidth/4,
                this.spriteHeight/4,
                )
           }
        ctx.restore();
    }

}
const player = new Player();

//Bubble behavior
const bubbleArray = [];
class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.radius = 40;
        this.speed = Math.random() * 5 + 1;
        this.distance = 0;
        this.counted = false;
        this.sound = Math.random() > 0.5 ? 'sound1' : 'sound2';
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw() {
        ctx.drawImage(bubbleImg,
            this.x - 25,
            this.y - 25,
            50,
            50,
        )
    }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'src/bubbles-single1.wav';

const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'src/Plop.ogg';


function handleBubbles() {
    if (gameFrame % 50 == 0) {
        bubbleArray.push(new Bubble());
    }
}
//Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(oceanBackground, 0, 0, canvas.width, canvas.height);
    player.update();
    player.draw();
    handleBubbles();
    gameFrame++;
    for (let i = 0; i < bubbleArray.length; i++) {
        bubbleArray[i].update();
        bubbleArray[i].draw();
        if ((bubbleArray[i].distance < bubbleArray[i].radius + player.radius) && !bubbleArray[i].counted) {
            if (bubbleArray[i].sound == 'sound1') {
                bubblePop1.play();
            } else {
                bubblePop2.play();
            }
            console.log('collission1!!');
            bubbleArray[i].counted = true;
            score++;
        }
        if (bubbleArray[i].y < 0 || bubbleArray[i].counted) {
            bubbleArray.splice(i, 1);
            i--;
        }
    }
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    requestAnimationFrame(animate);
}
animate();