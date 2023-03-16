document.addEventListener('keydown',userInput)
document.addEventListener('keyup', stopInput)
const STEPSIZE = 3;
const JUMPHEIGHT = 120;
const MAX_VELOCITY = 10;
let horizontalDirection = 0;
const screen = document.getElementById("screen");
let touchingTheGround = false;
const ctx = screen.getContext("2d");
const GRAVITY = 0.7; 
let terminal_velocity_x = 11.2;
let terminal_velocity_y = 152;
let x,y;
const SCREEN_WIDTH = screen.width;
const SCREEN_HEIGH = screen.height;
let friction = 0.84;
let jumpCounter =0;
document.getElementById("fricVal").textContent = friction;
document.getElementById('friction').value = friction*100;
document.getElementById("termVal").textContent = terminal_velocity_x;
document.getElementById('terminal').value = terminal_velocity_x*5;
let acceleration = 12;
let jump = false;
setInterval(mainLoop,1)

class Box {
    constructor(x,y,width,height)
    {
        this.leftBoundary = x;
        this.topBoundary = y;
        this.rightBoundary = x + width;
        this.bottomBoundary = y+height;
        this.width = width/2;
        this.height = height/2;
        this.centerPoint = new Point(x + width/2, y + height/2);
    }

    returnPoints()
    {
        let pointArray = [];
        pointArray.push(new Point(this.leftBoundary, this.topBoundary));
        pointArray.push(new Point(this.rightBoundary, this.topBoundary));
        pointArray.push(new Point(this.leftBoundary, this.bottomBoundary));
        pointArray.push(new Point(this.rightBoundary, this.bottomBoundary));
        return pointArray;
    }

    updateCenter()
    {
        this.centerPoint = new Point(this.x + this.width/2, this.y + this.height/2);
    }
}

class Player {
        constructor(x,y,width,height,color)
        {
            this.x = x;
            this.y = y;
            this.width  = width;
            this.height = height;
            this.color = color;
            this.velocity = 0;
            this.yVelocity = 0;
            this.grounded = false;
            this.box = new Box(this.x,this.y,width,height);
        }

        updateCollisionBox()
        {
            this.box.x = this.x;
            this.box.y = this.y;
            this.box.updateCenter();
        }
}

class Point {
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}

class Plattform {
    constructor(x,y,w,h,speed){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.box = new Box(x,y,w,h);
    }

    updateBox()
    {
        this.box.x = this.x;
        this.box.y = this.y;
        this.box.updateCenter();
    }

    move() {
        this.x += this.speed;
        if(this.x > SCREEN_WIDTH)
            this.x = 0;
        else if(this.x < 0)
            this.x = SCREEN_WIDTH;
        
    }
}
let player = new Player(20,20,40,40,"#ff0f00");
var plattforms = [];
plattforms.push(new Plattform(12,340,90,10,-2));

plattforms.push(new Plattform(120,200,90,10,1));


function sgn(num)
{
    return num >= 0 ? 1 : -1;
}

function drawBox(x,y,w=player.width,h=player.height,color)
{
    let orgColor = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = orgColor;
}

function applyGravity(physObj)
{
    if(!player.grounded)
    {
    physObj.yVelocity += GRAVITY;
    physObj.yVelocity = Math.abs(physObj.yVelocity) >= Math.abs(terminal_velocity_y) ? terminal_velocity_y : physObj.yVelocity;  
    }
    
}

function ejectPlayer()
{
    
}

function applyVelocity(player)
{
    if(player.grounded)
        {
            player.velocity += horizontalDirection*acceleration % terminal_velocity_x;
            player.velocity = Math.abs(player.velocity) > 0 ? player.velocity* friction : 0;
        }
    else {
        player.velocity += horizontalDirection*acceleration % terminal_velocity_x;

        player.velocity = Math.abs(player.velocity) > 0 ? player.velocity* friction : 0;
    }
    
    player.y += player.yVelocity;
    player.x += player.velocity;
}

function jumpUp()
{
    
    if(player.grounded)
    {
        player.grounded = false;
        player.yVelocity = -16.3;
        jumpCounter = 0;
    }
    else {
        if(jumpCounter < 4)
        {
            jumpCounter++;
            player.yVelocity -=1;
        }
    }
}

function pointInside(point, box)
{
    if(point.x > box.leftBoundary && point.x < box.rightBoundary)
    {
        if(point.y > box.topBoundary && point.y < box.bottomBoundary)
        {
            return true;
        }
    }
    return false;
}

function centerPointMethod(box1, box2)
{
    let centerDeltaX = Math.abs(box1.centerPoint.x - box2.centerPoint.x);
    let centerDeltaY = Math.abs(box1.centerPoint.y - box2.centerPoint.y);
    let maxDistanceX = box1.width + box2.width;
    let maxDistanceY = box1.height + box2.height;
    if(centerDeltaX <= maxDistanceX)
    {
        if(centerDeltaY <= maxDistanceY)
        {
            return true;
        }

    }
    return false;
}

function bottomCollide(player, plattform)
{
    if(player.y > plattform.h + plattform.y)
        return 1;
    let overlap = plattform.y - (player.y + player.height);
    console.log(overlap);
    if (overlap <= 0)
        return overlap;
    else 
        return 0;
}

function collisionDetection() 
{
    if(player.x < 0 || player.x + 40 > screen.width)
    {
        xDelta = player.x < 0 ? Math.abs(player.x) : player.x+40 - screen.width;
        player.velocity *= 0.92 * -1;
        player.x += sgn(player.velocity)*xDelta;
    }
    let collisionDetected = false;
    player.updateCollisionBox();
    if(player.y > screen.height- player.height)
    {
        player.grounded = true;
        player.y = screen.height-player.height;
        return;
    }
    for (let i = 0; i < plattforms.length; i++) {
        const element = plattforms[i];
        element.updateBox();
        let pattformBox = element.box;
        collisionDetected = centerPointMethod(player.box,pattformBox);
        
        if(collisionDetected)
        {
            let over = bottomCollide(player,element);
            if (over <= 0)
            {
                player.grounded = true;
                player.y += over; 
            }
            else 
            {
                player.yVelocity *= -0.9;
            }
            return true;
        }

    }

    return false;
    
}

function updateParameter(parName)
{
    if(parName === "friction")
    {
        var value = document.getElementById("friction").value;
        friction = value / 100;
        document.getElementById("fricVal").textContent = friction;
        
    }
    else if(parName === "terminal")
    {
        var value = document.getElementById("terminal").value;
        terminal_velocity_x = value / 5;
        document.getElementById("termVal").textContent = terminal_velocity_x;
    }
    else if(parName === "acceleration")
    {
        var value = document.getElementById("acceleration").value;
        acceleration = value /3;
        document.getElementById("accelVal").textContent = acceleration.toFixed(2);
    }
}

function mainLoop()
{
    ctx.clearRect(0,0,screen.width,screen.height);
    // apply gravity 
    applyGravity(player);
    applyVelocity(player);
    collisionDetection();
    
    
    
   
    
    drawBox(player.x,player.y,player.width,player.height,"#f303a3"); 
    plattforms.forEach(element => {
        drawBox(element.x,element.y,element.w,element.h,"#f0af33");
        element.move();
    });
}

function userInput(event) 
{
    if(event.key == 'ArrowRight')
        horizontalDirection = 1
    else  if( event.key == 'ArrowLeft')
       horizontalDirection =-1;
    else if (event.key == " ")
    {
        if(!jump)
        {
            jump = true;
            jumpUp();
        }
    }
    
    
}

function stopInput(event)
{
    if(event.key == 'ArrowRight' || event.key == 'ArrowLeft')
    {
        horizontalDirection = 0;
    }
    else if(event.key == " ")
    {
        jump = false;
    }
    
}