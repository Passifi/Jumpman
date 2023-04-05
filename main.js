const Inputs = {
    LEFT: 1,
    RIGHT: 2,
    JUMP: 3
}

const CollisionType = {
    LEFT: 0,
    RIGHT: 1,
    TOP: 2,
    BOTTOM: 3
}
document.addEventListener('keydown',userInput)
document.addEventListener('keyup', stopInput)
const STEPSIZE = 3;
const JUMPHEIGHT = 120;
const MAX_VELOCITY = 10;
let horizontalDirection = 0;
const screen = document.getElementById("screen");
let touchingTheGround = false;
const ctx = screen.getContext("2d");
const GRAVITY = 0.6; 
let terminal_velocity_x = 4.2;
let terminal_velocity_y = 5;
let x,y;
const SCREEN_WIDTH = screen.width;
const SCREEN_HEIGH = screen.height;
let friction = 0.14;
let jumpCounter =0;
document.getElementById("fricVal").textContent = friction;
document.getElementById('friction').value = friction*100;
document.getElementById("termVal").textContent = terminal_velocity_x;
document.getElementById('terminal').value = terminal_velocity_x*5;
let acceleration =3;
let isJumping = false;


class HitBox {
    constructor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
    }

    
}

class Velocity
{
    constructor(x=0,y=0)
    {
        this.x = x;
        this.y = y;
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
            this.velocity = new Velocity();
            this.grounded = false;
            this.box = new HitBox(this.x,this.y,width,height);
            
        }
    
    applyVelocity() {
        this.x += this.velocity.x;
        if(!this.grounded)
            this.y += this.velocity.y;
        
        if(Math.abs(this.velocity.x) < 0.001)
            this.velocity.x = 0;
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
        this.box = new HitBox(x,y,w,h);
        this.startX = x;
        this.time = 0;
        this.velocity = new Velocity();
        this.lastX = x;
    }

    move() {
        this.x += this.speed;
        if(this.x > SCREEN_WIDTH)
            this.x = 0;
        else if(this.x < 0)
            this.x = SCREEN_WIDTH;
        this.box.x = this.x;
        this.box.y = this.y;
        
    }

    oscilate() 
    {
        this.time = (this.time+0.01)
        
        this.x =Math.sin(this.time)*130*sgn(this.speed)+this.startX
        this.velocity.x = this.x - this.lastX;
        this.lastX = this.x;
        this.box.x = this.x;
    }

}
class Controller {
    
    constructor() {
        this.pressLeft = false;
        this.pressRight = false;
        this.pressJump = false;
        this.lastMovement = null;
        this.jumped = false;
    }

    move(direction)
    {
        if(direction==Inputs.LEFT)
        {
            this.pressLeft = true;
            this.pressRight = false;
        }
        else if(direction=Inputs.RIGHT)
        {
            this.pressRight = true;
            this.pressLeft = false;
        }

    }

    jump()
    {
        this.pressJump = true;
    }

    cancelJump() 
    {
        this.pressJump = false;
        this.jumped = false;
    }

    processControls()
    {
        if(this.pressLeft)
        {
            movePlayer(-1);
        }
        else if(this.pressRight)
        {
            movePlayer(1);
        }
        if(this.pressJump)
        {

            jump();
        }

    } 


}
let player = new Player(20,screen.height-60,40,40,"#ff0f00");
var plattforms = [];
let floor = new Plattform(0,screen.height-20,screen.width,screen.width,0);
plattforms.push(new Plattform(120,340,120,10,-2));

plattforms.push(new Plattform(220,240,120,10,1));
plattforms.push(floor);
setInterval(mainLoop,1)
controller = new Controller();

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

function collision(box1, box2)
{
    
    return (box1.x < box2.x + box2.w && box1.x + box1.w > box2.x && box1.y < box2.y + box2.h && box1.y + box1.h > box2.y  )
}

function sideCollision(box1,box2)
{
    // which is bigger? 
    let overlapLeft = Math.abs(box2.x + box2.w - box1.x);
    let overlapRight = Math.abs(box1.x + box1.w - box2.x);
    let overlapTop = Math.abs(box2.y + box2.h - box2.y); 
    let overlapBottom = Math.abs(box2.y - box1.y + box1.h);
    //console.log(`Left: ${overlapLeft} Right: ${overlapRight}`);
    //console.log(`Top: ${overlapTop} Bottom: ${overlapBottom}`)

    return minOfList(overlapLeft, overlapRight, overlapTop,overlapBottom);

}

function minOfList(x1,x2,x3,x4)
{
    let values = [x1,x2,x3,x4]
    let index = 0
    let smallestValue = values[0]
    for(let i =1; i < values.length; i++)
    {
        if(values[i] < smallestValue)
        {
            index = i;
            smallestValue = values[i];
        }
    }
    return index; 
}

function collisionDetection() 
{
    player.box.x = player.x;
    player.box.y = player.y;

    player.grounded = false;
    for(let i =0; i < plattforms.length; i++)
    {
        if(collision(player.box, plattforms[i].box))
        {
            console.log(sideCollision(player.box,plattforms[i].box));
            if(sideCollision(player.box,plattforms[i].box) == CollisionType.LEFT || sideCollision(player.box,plattforms[i].box) == CollisionType.RIGHT )
            {
                player.velocity.x *= -0.8;
                continue;
            }   
            if(player.velocity.y < 0)
                player.velocity.y *= -1
            else
                player.grounded = true;
        }
        if(player.grounded)
        {
            player.x += plattforms[i].velocity.x;
            return;
        }
    }
    if(player.x <= 0)
    {
        player.x = 0;
        player.velocity.x *= -2;
    }
    if(player.x >= screen.width - player.width)
    {
        player.x = screen.width - player.width;
        player.velocity.x *= -2;

    }
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

function physicsEngine() 
{
    player.velocity.y = Math.abs((player.velocity.y + 0.001)) <= terminal_velocity_y ? player.velocity.y + GRAVITY : terminal_velocity_y*sgn(player.velocity.y);  
    if(player.grounded)
            player.velocity.x -= friction*player.velocity.x;
    player.applyVelocity();
}

function mainLoop()
{
    collisionDetection();
    physicsEngine();
    render();
    controller.processControls();
}

function movePlayer(direction) {
    player.velocity.x = Math.abs((player.velocity.x + direction*(acceleration))) <= terminal_velocity_x ? player.velocity.x + direction*(acceleration) : terminal_velocity_x*sgn(player.velocity.x);

}

function render()
{
    ctx.clearRect(0,0,screen.width,screen.height);
    
    drawBox(player.x,player.y,player.width,player.height,"#f303a3"); 
    plattforms.forEach(element => {
        drawBox(element.x,element.y,element.w,element.h,"#f0af33");
        if(element.speed != 0)
        element.oscilate();
    });
}
function jump()
{
    if(player.grounded)
    {
        player.y -=42;
        player.velocity.y = -5;
        player.grounded = false;
    }
    else 
    {
        player.velocity.y -= 0.52;
    }
}

function userInput(event) 
{
    if(event.key == 'ArrowRight')
        controller.move(Inputs.RIGHT);
    else  if( event.key == 'ArrowLeft')
       controller.move(Inputs.LEFT);
    else if (event.key == " ")
    {
        controller.jump();
    }
}

function stopInput(event)
{
    if(event.key == 'ArrowRight' || event.key == 'ArrowLeft')
    {
        controller.pressLeft = false;
        controller.pressRight = false;
    }
    else if(event.key == " ")
    {
        controller.cancelJump();
    }
    
}