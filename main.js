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
let terminal_velocity_y = 1;
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
}
let player = new Player(20,20,40,40,"#ff0f00");
var plattforms = [];
let floor = new Plattform(0,screen.height-20,screen.width,screen.width,0);
plattforms.push(new Plattform(12,340,90,10,-2));

plattforms.push(new Plattform(120,200,90,10,1));
plattforms.push(floor);
setInterval(mainLoop,1)


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
    console.log(box1);
    console.log(box2);
    return (box1.x < box2.x + box2.w && box1.x + box1.w > box2.x && box1.y < box2.y + box2.h && box1.y + box1.h > box2.y  )
}



function collisionDetection() 
{
    player.box.x = player.x;
    player.box.y = player.y;
    player.grounded = false;
    for(let i =0; i < plattforms.length; i++)
    {
        player.grounded = collision(player.box, plattforms[i].box);
        if(player.grounded)
        {
            console.log("Collided");
            break;
        }
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
    player.velocity.y = (player.velocity.y + 0.001) <= terminal_velocity_y ? player.velocity.y + GRAVITY : terminal_velocity_y;  
    player.applyVelocity();
}

function mainLoop()
{
    // apply gravity 
    physicsEngine();
    collisionDetection();


    //render 
    render();
}

function render()
{
    ctx.clearRect(0,0,screen.width,screen.height);
    
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