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

let pause = false;
const STEPSIZE = 3;
const JUMPHEIGHT = 120;
const MAX_VELOCITY = 5;
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
let friction = 0.38;
let jumpCounter =0;
document.getElementById("fricVal").textContent = friction;
document.getElementById('friction').value = friction*100;
document.getElementById("termVal").textContent = terminal_velocity_x;
document.getElementById('terminal').value = terminal_velocity_x*5;
let acceleration =1.2;
let isJumping = false;
let timer = 0;
let lastTick =0;
class HitBox {
    constructor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
    }
    }


class Pattern {

  constructor() {
    this.platforms = [];
    this.enemies = [];
    
  }

  generatePattern(lastPattern,currentPosition) {
    
    if(lastPattern == null) {
      // generate 3 plattforms 
       
      for(let i = 0; i < 3; i++) {
        let yValue = Math.random() * screen.height;
        
        this.platforms.push(new Plattform(currentPosition.x += 20,yValue,100,20,1));
      }
    }
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

class Coin {


  constructor(x,y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    let orgColor = ctx.fillStyle;
    ctx.fillStyle = "#fe003a";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 40, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = orgColor;
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
        this.changeX = 0;
        this.changeY = 0;
    }

    move(x) {
        this.x += x;
        this.velocity.x = this.x - this.lastX;
        this.lastX = this.x;
        this.box.x = this.x;
        this.box.x = this.x;
        
    }

    oscilate() 
    {
        this.time = (this.time+0.01)
        this.x =Math.sin(this.time)*130*sgn(this.speed)+this.startX
        this.changeX = this.lastX - this.x;

        this.velocity.x = this.x - this.lastX;
        this.lastX = this.x;
        this.box.x = this.x;
    }

}

class InputHandler {
  keysDown = new Object();
  constructor() {
      for(let i =0; i< 120;i++) {
        this.keysDown[String.fromCharCode(i)] = false;
      }
  }
  keyDown(key) {

    this.keysDown[key] = true;
  }

  keyUp(key) {
    this.keysDown[key] = false;
  } 

}


class Controller {
    
    constructor() {
    }


    processControls(inputs)
    {
        if(inputs.keysDown['a'])
        {
            movePlayer(-1);
        }
        if(inputs.keysDown['d'])
        {
            movePlayer(1);
        }
        if(inputs.keysDown[' '])
        {
            jump();
        }
        else if(!inputs.keysDown[' ']) {
          isJumping = false;
        }

    } 
 ddd 

}
let player = new Player(20,screen.height-200,40,40,"#ff0f00");
var plattforms = [];
var floors = [];
//let floor = new Plattform(0,screen.height-20,screen.width,screen.width,0);
plattforms.push(new Plattform(420,screen.height-140,140,20,1));
let coin = new Coin(700,200);
plattforms.push(new Plattform(220,screen.height-270,120,10,1));
plattforms.push(new Plattform(720,screen.height-300,120,10,2));

plattforms.push(new Plattform(500,100,5,300,0));
plattforms.push(new Plattform(500,500,100,10,0));

floors.push(new Plattform(0,screen.height-20,800,20));

setInterval(mainLoop,1)
controller = new Controller();
inputHandler = new InputHandler();
function sgn(num)
{
    return num >= 0 ? 1 : -1;
}

function spawnGround(force=false) {
    if((timer - lastTick > 100) || force) {
        floors.push(new Plattform(screen.width, screen.height-20, 300, 20,0));
        lastTick = timer;
    }
}

function handlePlattforms() {
    spawnGround(false);
    for(let i = 0; i < plattforms.length; i++) {
        plattforms[i].move(-1);

    } 
    if(floors.length == 0) {
        spawnGround(true);
    }
    for(let i = 0; i < floors.length; i++) {
        floors[i].move(-4);
    }
}

function drawBox(x,y,w=player.width,h=player.height,color)
{
    let orgColor = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = orgColor;
}

function collision(box1,box2) {
 

 if(box1.x < box2.x + box2.w && box1.x + box1.w > box2.x && box1.y < box2.y + box2.h && box1.y + box1.h > box2.y) {
   return true;
 }


  return false;
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
    let collided = false;
    let allplatforms = floors.concat(plattforms);

    for(let i =0; i < allplatforms.length; i++)
    {
        let res = collision(player.box,allplatforms[i].box);
        
         if(res) {
          collided = true;
          
          if(player.velocity.x > 0) {
            if(player.box.x + player.box.w > allplatforms[i].box.x && player.box.x < allplatforms[i].box.x) {
              player.velocity.x = 0;
              player.x -= 4;
              break;
            } 
          }
          else if(player.velocity.x < 0) {
            if(player.box.x  < allplatforms[i].box.x + allplatforms[i].box.w  && player.box.x + player.box.w > allplatforms[i].box.x + allplatforms[i].box.w) {
                player.velocity.x = 0;
                player.x += 4;
                break;
              } 
          }

          if(player.box.y + player.box.h > allplatforms[i].y && player.box.y + player.box.h < allplatforms[i].box.y + allplatforms[i].box.h) {
            player.y -=   player.box.h + player.box.y - allplatforms[i].box.y; 
            
          player.grounded = true;
          
          player.x -= allplatforms[i].changeX;
          }
          else if(player.box.y < allplatforms[i].y + allplatforms[i].h && player.box.y  > allplatforms[i].box.y) 
          {
            player.y +=  player.y - allplatforms[i].box.y + allplatforms[i].box.h;
            player.velocity.y *= -4;
          }
          
          player.box.x = player.x;
          player.box.y = player.y;
        }  
         
    }
    if(!collided) {
      player.grounded = false;
    } 
    if(player.x <= 0)
    {
        player.x = 0;
        player.velocity.x *= -0.6;
    }
    if(player.x >= screen.width - player.width)
    {
        player.x = screen.width - player.width;
        player.velocity.x *= -0.6;

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
    {
            player.velocity.x -= friction*player.velocity.x;
            if(Math.abs(player.velocity.y) > 0)
                player.velocity.y =0;
    }
    player.applyVelocity();
}

function mainLoop()
{

    if(!pause) { 
    timer +=1
    handlePlattforms();
    physicsEngine();
    collisionDetection();
    render();
    }
      controller.processControls(inputHandler);
    
    }

function movePlayer(direction) {
    let modifier = 1.0;
    if(player.ground) modifier = 0.3;
    player.velocity.x = Math.abs((player.velocity.x + direction*(acceleration)*modifier)) <= terminal_velocity_x ? player.velocity.x + direction*(acceleration)*modifier : terminal_velocity_x*sgn(player.velocity.x);
    

}

function render()
{
    ctx.clearRect(0,0,screen.width,screen.height);
    
    drawBox(player.x,player.y,player.width,player.height,"#f303a3"); 
    plattforms.forEach(element => {
        drawBox(element.x,element.y,element.w,element.h,"#f0af33");
 
    });
    floors.forEach(element => {
        drawBox(element.x,element.y,element.w,element.h,"#0f0ff0");
    });
    coin.draw();
}
function jump()
{
    if(player.grounded && !isJumping)
    {
        isJumping = true;
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
    inputHandler.keyDown(event.key); 
    console.log(event.key.charCodeAt(0));
}

function stopInput(event)
{
    inputHandler.keyUp(event.key);
    
}
