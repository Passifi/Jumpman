document.addEventListener('keydown',userInput)
document.addEventListener('keyup', stopInput)
const STEPSIZE = 3;
const JUMPHEIGHT = 120;
const MAX_VELOCITY = 10;
let horizontalDirection = 0;
const screen = document.getElementById("screen");
let touchingTheGround = false;
const ctx = screen.getContext("2d");
const GRAVITY = 1; 
const TERMINAL_VELOCITY = 20;
let x,y;
x=20;
y=20;
velocity = 0;
yVelocity = 0;
setInterval(mainLoop,12)

class Plattform {
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    move() {
        this.x += 3;
    }
}

var plattforms = [];
plattforms.push(new Plattform(12,300,90,10));

function sgn(num)
{
    return num >= 0 ? 1 : -1;
}

function drawBox(x,y,w=40,h=40)
{
    
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.fill();
    ctx.closePath();
}

function applyGravity()
{
    yVelocity += GRAVITY;
    yVelocity = sgn(yVelocity)*(Math.abs(yVelocity)%TERMINAL_VELOCITY);
}

function applyVelocity()
{
   
    if(touchingTheGround)
        {
            velocity = Math.abs(velocity) > 0 ? velocity* 0.96 : 0;
        }
    else {
        velocity = Math.abs(velocity) > 0 ? velocity* 0.98 : 0;

    }
    let counterForce = touchingTheGround * -1*(yVelocity);
    
    y += yVelocity + counterForce;
    x += velocity;
    
    
}

function collisionDetection() 
{
    if(x < 0 || x + 40 > screen.width)
    {
        xDelta = x < 0 ? Math.abs(x) : x+40 - screen.width;
        velocity *= 0.92 * -1;
        x += sgn(velocity)*xDelta;

    }
}

function mainLoop()
{
    ctx.clearRect(0,0,screen.width,screen.height);
    // apply gravity 
    collisionDetection();
    if(horizontalDirection == 1)
      velocity = (velocity + 5)%TERMINAL_VELOCITY;
    else if(horizontalDirection==-1)
        velocity = Math.abs(velocity - 5) <= TERMINAL_VELOCITY ? velocity -3 : velocity; 
    applyGravity();
    applyVelocity();
   
    if(y >= screen.height- 40)
        touchingTheGround = true;
    
    drawBox(x,y); 
    plattforms.forEach(element => {
        drawBox(element.x,element.y,element.w,element.h);
        element.move();
    });

}

function userInput(event) 
{
    if(event.key == 'ArrowRight')
        horizontalDirection = 1
    else  if( event.key == 'ArrowLeft')
       horizontalDirection =-1;
    else if (touchingTheGround && event.key == " ")
    {
        y -= 20;
        yVelocity = -100;
        touchingTheGround = false;
    }
}

function stopInput(event)
{
    if(event.key == 'ArrowRight' || event.key == 'ArrowLeft')
    {
        horizontalDirection = 0;
    }
}