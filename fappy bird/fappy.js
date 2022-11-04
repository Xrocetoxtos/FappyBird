//Fappy Bird

class Explosion
{
	constructor (_posX,_posY,_frameNo)
	{
		this.posX=_posX;
		this.posY=_posY;
		this.frameNo=_frameNo;
		this.counter=0;
		this.counterMax=5;
		this.running=false;
	}
	
	setup(_posX,_posY)
	{
		this.posX=_posX;
		this.posY=_posY;
		this.frameNo=0;
		this.counter=0;
		this.running=true;
	}
	
	count()
	{
		if(this.running==false)
			return;
		
		this.counter+=1;
		if(this.counter>this.counterMax)
		{
			this.frameNo+=1;
			if(this.frameNo> 4)
				this.hide();
			this.counter=0;
		}
	}
	
	hide()
	{
		this.frameNo=0;
		this.posX=-500;
		this.posY=-500;
		this.running=false;
	}	
}

class Enemy
{
	
	constructor(_x,_y,_speed,_tooFast)
	{
		this.xPos=_x;
		this.yPos=_y;
		this.speed=_speed
		this.tooFast=_tooFast;
	}
	
	move()
	{
		this.xPos-=this.speed;
		if(this.outOfBounds()== false)
			return;

		this.resetEnemy();
		if(this.speed<=15)
		{
			this.speed+=1;
			return;
		}
		this.speed=10;
		this.tooFast=true;
	}

	outOfBounds()
	{
		if(this.xPos<-50)
			return true;
		return false;
	}
		
	draw()
	{
		context.drawImage(niels,this.xPos,this.yPos,50,50);
	}
	
	collision(x,y)
	{
		if(this.xPos>= x && this.xPos<=x+50)
		{
			if(this.yPos>=y-50 && this.yPos<=y+50)
				return true;
		}
		return false;
	}
	
	resetEnemy()
	{
		this.xPos=800;
		this.yPos = Math.floor(Math.random() * 350);
	}
}

class Projectiel
{
	constructor()
	{
		this.resetProjectile();
	}
	
	resetProjectile()
	{
		this.x=-300;
		this.y=0;
		this.moving=false;
		this.speed=30;
	}
	
	setup(_x,_y)
	{
		this.moving=true;
		this.x=_x;
		this.y=_y;
		console.log("projectiel onderweg.");
	}
	
	move()
	{
		if(this.moving==false)
			return;
		
		this.x+=this.speed;
		console.log("projectiel ", this.x, this.y);
		if(this.x>=610)
			this.resetProjectile();
	}
	
	collision(_x, _y)
	{
		if(this.x<=_x)
			return false;
		if(this.y<_y-2) 
			return false;
		if(this.y>_y+50)
			return false;
		return true;
	}
}

window.onload = function() 
{
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
	
    var niels = new Image();
    niels.src = 'niels.png';
	var enemy = new Image();
    enemy.src = 'niels.png';
	var projectiel = new Image();
	projectiel.src = 'projectiel.png';    
	var exp1 = new Image();
	exp1.src = 'explosion1.png';
	var exp2 = new Image();
	exp2.src = 'explosion2.png';
	var exp3 = new Image();
	exp3.src = 'explosion3.png';
	var exp4 = new Image();
	exp4.src = 'explosion4.png';
	var exp5 = new Image();
	exp5.src = 'explosion5.png';
	explosions = [exp1, exp2, exp3, exp4,exp5];
	
	var backgroundImage = new Image();
	backgroundImage.src='bground.png';
	
    var x = 100;
    var y = 150;

	var scoreForHealth=3;
    
    var t = Date.now();
    let speed = 300;
    
	climbing=false;
	pressSpace=false;
	timer=0;
	timerEnd=15;

	var vijand = new Enemy(500,0,5,false);
	let lijst = [vijand];
	
	var explosion = new Explosion();
	var explosion2 = new Explosion();
	
	var health = 10;
	var dead = false;
	
	var ammo=3;
	var score=0;
	let projectielen = [new Projectiel(), new Projectiel(), new Projectiel()]
	var enterUp=true;

	var started=false;
	
	function damage()
	{
		health-=1;
		if(health<=0)
		{
			health=0;
			alert("dead");
			score=0;
		}
	}
	
	function heal()
	{
		health+=1;
		if(health>=10)
			health=10;
	}
	
	function drawHealthBar()
	{
		context.beginPath();
		context.rect(480, 10,102, 10);
		context.strokeStyle = "grey";
		context.fillStyle = "blagreyck";
		context.fill();
		context.stroke();
		
		if(health<=0)
			return;
		
		context.beginPath();
		context.rect(481, 11,health*10, 8);
		context.strokeStyle = "red";
		context.fillStyle = "red";
		context.fill();
		context.stroke();
	}
	
	function runExplosions()
	{
		if(explosion.running==true)
		{
			explosion.count();
			context.drawImage(explosions[explosion.frameNo],explosion.posX,explosion.posY,50,50);
		}
		if(explosion2.running==true)
		{
			explosion2.count();
			context.drawImage(explosions[explosion2.frameNo],explosion2.posX,explosion2.posY,25,25);
		}
	}
	
	function shoot()
	{
		if(ammo<1)
			return;
		
		projectielen[3-ammo].setup(x+50,y+25);
		ammo-=1; 
	}

	function drawScore()
	{
		context.fillStyle = 'white';
		context.fillText("Score: " + score, 480, 35); 
	}
	
    function draw() 
	{
		if(dead==true)
			return;
		
		//knoppen indrukken en loslaten
		window.addEventListener('keydown', function (e) 
		{
			if(e.key == " ") 
			{
				if(started==false)
					started=true;
				if(climbing==false && pressSpace==false)
				{
					climbing=true;
					pressSpace=true;
					timer=0;
				}
			}
			if(e.key == "Enter")
				enterUp=false;
			
		}, false);	
		
		window.addEventListener('keyup', function (e) 
		{
			if(e.key == " ") 
			{
				climbing=false;
				pressSpace=false;
			}
			if(e.key == "Enter") 
			{
				if(enterUp==false)
				{
					shoot();
					enterUp=true;
				}
			}
		}, false);

		// tellertje of je blijft stijgen
		if(climbing==true)
		{
			timer+=1;
			if(timer>=timerEnd)
				climbing=false;
		}

		//tijd bijhouden voor framerate.
        var timePassed = (Date.now() - t) / 1000;
        t = Date.now();

		//verversen scherm
        context.clearRect(x,y,50,50); //positie niels
        context.clearRect(vijand.xPos,vijand.yPos,50,50); //positie vijand
       
		//teken achtergrond en niels
		context.drawImage(backgroundImage,0,0,600,400);
		context.drawImage(niels,x,y,50,50);

		if (started==true)
		{
			//omhoog
			if(climbing==true)
			{	
				if(y>0)
					y-=(speed*timePassed);
				else
					damage();
			}
			//zwaartekracht
			else
			{
				if(y+60 < 400) 
					y+=(speed*timePassed*0.8);
				else
					damage();
			}
		
			//Enemies
			newEnemy=false;
			for(let i=0; i<lijst.length; i++)
			{
				context.drawImage(enemy,lijst[i].xPos,lijst[i].yPos,50,50);
				if(lijst[i].collision(x,y))
				{
					explosion.setup(x,y);
					damage();
					lijst[i].resetEnemy();
				}
				lijst[i].move();
				if(lijst[i].tooFast==true)
					newEnemy=true;
			}
			if(newEnemy==true)
			{
				let newX = Math.floor(Math.random() * 300) + 800;
				let newY = Math.floor(Math.random() * 350);
				let newSpeed = 10;
				
				lijst.push(new Enemy(newX,newY,newSpeed,false));
				for(let i=0; i<lijst.length; i++)
				{
					lijst[i].speed=10;
					lijst[i].tooFast=false;
				}
			}
			
			//projectielen
			ammo=0;
			for(let i=0; i<projectielen.length; i++)
			{
				if(projectielen[i].moving==true)
				{
					projectielen[i].move();
					for(let j=0; j<lijst.length;j++)
					{
						if (projectielen[i].collision(lijst[j].xPos, lijst[j].yPos))
						{
							score++;
							if(score%scoreForHealth == 0)
								heal();
							explosion2.setup(lijst[j].xPos, lijst[j].yPos); 

							lijst[j].resetEnemy();
							projectielen[i].resetProjectile();
						}
					}
					context.drawImage(projectiel,projectielen[i].x,projectielen[i].y,10,3);
				}
				else
					ammo++;
			}	
		}
		drawScore();	
		runExplosions();
		drawHealthBar();
        window.requestAnimationFrame(draw);
    }
    draw();
}