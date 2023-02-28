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

function sgn(num)
{
    return num > 0 ? 1 : -1;
}

function drawBox(x,y)
{
    
    ctx.beginPath();
    ctx.rect(x,y,40,40);
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
    if(horizontalDirection != 0)
        velocity = (velocity + 1)%MAX_VELOCITY;
    if(touchingTheGround)
        {
            velocity = velocity > 0 ? velocity* 0.9 : 0;
        }
    let counterForce = touchingTheGround * -1*(yVelocity);
    
    y += yVelocity + counterForce;
    x += sgn(horizontalDirection)*velocity;
}

function mainLoop()
{
    ctx.clearRect(0,0,screen.width,screen.height);
    // apply gravity 
    applyGravity();
    applyVelocity();
   
    if(y >= screen.height- 40)
        touchingTheGround = true;
    
    drawBox(x,y); 

}

function userInput(event) 
{
    if(event.key == 'ArrowRight')
        horizontalDirection = 1;
    else  if( event.key == 'ArrowLeft')
        horizontalDirection = -1
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