window.onload = init; 

function init()
{
   const divElement =  document.createElement("div");
   divElement.classList.add("canvas-container"); 
   const canvas = document.getElementsByTagName("canvas")[0]; 
   const parent = canvas.parentNode; 
   parent.replaceChild(divElement,canvas);
   const pointContainer = document.createElement("div");
   pointContainer.classList.add("point-speed-container");
   divElement.appendChild(pointContainer);
   pointContainer.innerHTML = `<div>Remain:&nbsp;<span id="point">
                                    50
                        </span>
                     </div>
                     <div>
                        Speed:&nbsp;<span id="speed">
                             2 km/h
                        </span>
                     </div>`
    const div1Element =  document.createElement("div");
    div1Element.classList.add("top-canvas-container");
    divElement.appendChild(div1Element)
    div1Element.appendChild(canvas);
}

const WIDTH = 800;
const HEIGHT = 600;
const LEFT_ARROW = 37;
const UP_ARROW = 38; 
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;

let scl = 20;
let speed = 2;
let canvas; 
let grid;
let snake;
let food;

class Snake 
{
  constructor(x,y)
  {
    this.x = x 
    this.y = y 
    this.xspeed = 1;
    this.yspeed = 0; 
    this.total = 0;  
    this.tail = [];
  } 

  dir(xdir,ydir)
  {
     this.xspeed = xdir;
     this.yspeed = ydir;
  }
  
  show()
  {
    noStroke();
    fill(255); 
    for(let pos of this.tail)
    {
        rect(pos[0],pos[1],scl,scl);
    }
    rect(this.x,this.y,scl,scl);
  }

  update()
  {
      
     if(this.total > this.tail.length)
     {

        this.tail.push([this.x,this.y]);
     }
     else 
     {
        for(let i=0; i< this.tail.length - 1; i++)
        {
            this.tail[i] = this.tail[i+1]; 
        } 
       
        if(this.tail.length >= 1)
        {
            this.tail[this.tail.length-1] = [this.x,this.y];
        }

     }

      this.x = this.x + this.xspeed * speed;
      this.y = this.y + this.yspeed * speed;

      if(this.x < 0)
      {
        this.x = width - scl; 
      }
      else if(this.x > width)
      {
          this.x = 0;
      }

      if(this.y < 0)
      {
        this.y = height - scl; 
      }
      else if(this.y > height)
      {
          this.y = 0;
      }

  }

  death()
  {
    const psc = document.getElementsByClassName("point-speed-container")[0];
     if(this.total == 50)
     {
        noCanvas(); 
        for(let elem of document.querySelectorAll(".point-speed-container > *"))
        {
            psc.removeChild(elem);
        }
        $(".top-canvas-container").remove();
        $(".control").remove();
        psc.innerHTML="<b>You Won!</b>";
     }

     for(let pos of this.tail)
     {
         let d = dist(this.x,this.y,pos[0],pos[1]); 
         if(d < 1)
         {
             noCanvas(); 

             for(let elem of document.querySelectorAll(".point-speed-container > *"))
             {
                 psc.removeChild(elem);
             }
             $(".top-canvas-container").remove();
             $(".control").remove();
             psc.innerHTML = "<b>You Lost!</b>";
         }
     }
  }

  eat(food)
  {
      let d = dist(this.x,this.y,food.x,food.y); 
      if(d < 20)
      {
          const point = document.querySelector("#point"); 
          const speedElem = document.querySelector("#speed");
          this.total++;
          point.textContent = 50 - this.total;
          if(this.total > 5 && this.total < 20)
          {
              speed = 5;
              speedElem.innerText = "5 km/h";
          }
          else if(this.total >= 20 && this.total < 30)
          {
              speed = 10;
              speedElem.innerText = "10 km/h";
          }
          else if(this.total >=30 && this.total < 50)
          {
              speed = 15;
              speedElem.innerText = "15 km/h";
          }
          return true;
      }
      else 
        return false;
  }
    
}

class Food
{
    constructor()
    {
        this.x = random(grid.rows);
        this.y = random(grid.cols);   
    }

    updatePos()
    {
       let xpos = random(grid.rows);
       let ypos = random(grid.cols); 

       this.x = xpos; 
       this.y = ypos; 
    }

    show()
    {
        noStroke();
        fill(255,0,0); 
        rect(this.x,this.y,scl,scl);
    }
}

class Grid
{
    constructor()
    {
        let rows = []; 
        for(let x=0; x < width; x += scl)
        {
            rows.push(x);
        } 
        
        let cols = [];
        for(let y=0; y< height; y += scl)
        {
           cols.push(y);   
        }

      this.rows = rows;
      this.cols = cols;
    }

    show()
    {
        strokeWeight(2);
        stroke(255);
        // line along x-axis
        for(let y=0; y < height; y += scl)
        {
            line(0,y,width,y);
        }

        //line along y-axis 
        for(let x=0; x < width; x += scl)
        {
            line(x,0,x,height);
        }
    }
}

function setup()
{
  canvas = createCanvas(WIDTH,HEIGHT); 
  grid = new Grid(); 
  snake = new Snake(0,height/2,20,20);
  food = new Food(); 
}

function draw()
{
   background(0,200,0);
   //grid.show();
   food.show();
   snake.death();
   snake.show();
   snake.update();
   if(snake.eat(food))
   {
       food.updatePos();
   }
 }

window.onkeydown = (e) =>{
    
    switch(e.which)
    {
        case LEFT_ARROW:
            if(snake.xspeed != 1)
            {
                snake.dir(-1,0);
                snake.update();
            }
            break;
        case UP_ARROW:
            if(snake.yspeed != 1)
            {
                snake.dir(0,-1);
                snake.update();
            }
            break; 
        case RIGHT_ARROW:
            if(snake.xspeed != -1)
            {
                snake.dir(1,0);
                snake.update();
            }
            break; 
        case DOWN_ARROW:
            if(snake.yspeed != -1)
            {
                snake.dir(0,1);
                snake.update();
            }
            break;
    }
}

$(document).ready(e=>{
   $(".control-button").click(e => {
         
         switch(e.target.value)
        {
            case "LEFT_ARROW":
                if(snake.xspeed != 1)
                {
                    snake.dir(-1,0);
                    snake.update();
                }
                break;
            case "UP_ARROW":
                if(snake.yspeed != 1)
                {
                    snake.dir(0,-1);
                    snake.update();
                }
                break; 
            case "RIGHT_ARROW":
                if(snake.xspeed != -1)
                {
                    snake.dir(1,0);
                    snake.update();
                }
                break; 
            case "DOWN_ARROW":
                if(snake.yspeed != -1)
                {
                    snake.dir(0,1);
                    snake.update();
                }
                break;
        }
   });
});


