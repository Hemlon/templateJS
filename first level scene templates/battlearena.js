
var keyPress ={};
var bg; //for storing the background image
var hero = []; //for storing the hero
var viewport; //viewport that follows the hero in what fullscene is off
var bgMusic; //for storing the music
var heroSpawner;
var bulletSpawner;
var collisionChecker;
var coinSpawner;

var level1 = function()
{
this.preload = function()
{
	bg = loadImage("pics/background.png"); //load in the background picture
	bgMusic = loadSound("music/background"); //load in the mp3
		
	heroSpawner = new spawnManager(0);
	hero[0] = new platformer("p1",340,400,30);	//create a platforming character
	hero[0].image["idleRight"] = new animation("pics/fhero_idle_right.png", 4,16,16);
	hero[0].image["walkRight"] = new animation("pics/fhero_walk_right.png", 4,16,16);	
	heroSpawner.spawn(hero[0]);
	
	hero[1] = new platformer("p2",500,360,30);	//create a platforming character
	hero[1].image["idleRight"] = new animation("pics/fhero_idle_right.png", 4,16,16);
	hero[1].image["walkRight"] = new animation("pics/fhero_walk_right.png", 4,16,16);	
	heroSpawner.spawn(hero[1]);
	
	coinSpawner = new spawnManager(0);
	
	for (var count = 0 ; count < 4; count++)
	{
		coinSpawner.spawn(new coin(152+count*30,393));
	}
	
	bulletSpawner = new spawnManager(0);
	collisionChecker = new collisionManager();
};

this.setup = function()
{
	//switches between fullscene to viewport
	showCollisions = true; //set to true when working on the project
	
	resizeCanvas(1250,630);	
	noSmooth();	//nice pixel art
	
	//adding bounds to the background for the character to walk on
	bgCollisions.addBounds(new bound(310,415,300,5));
	bgCollisions.addBounds(new bound(120,415,150,5));
	//add more bounds here
		
	bgCollisions.create();//don't touch this...
	
	//creating viewport and setting the mouse position
	viewport = new viewCam(0, 0);
	drawMousePos.setView(viewport);
	
	//set music to loop and play it
	bgMusic.loop();
	bgMusic.play();
};

this.draw = function()
{	
	checkInput();//checks the key input.
	image(bg, 0,0); //draw background

	var pair = collisionChecker.check(bulletSpawner.gameObj,heroSpawner.gameObj);
	if (pair)
		handleCollision(pair);
	
	pair = collisionChecker.check(coinSpawner.gameObj,heroSpawner.gameObj);
	if (pair)
		coinCollision(pair);
	
	//teleporting the player for testing purposes
	teleportToMouse(hero[0], viewport);	
	bgCollisions.draw();//draw the collision bounds		
	heroSpawner.update();
	bulletSpawner.update();
	coinSpawner.update();
	drawMousePos.draw(); //draw the mouse position
		
};

};

var handleCollision = function(pair)
{
	if(pair[0].name != pair[1].name)
	{
		pair[0].toBeDestroyed = true;
		pair[1].health -= 3;
		bulletSpawner.destroyFromList();	
	}
}

var coinCollision = function(pair)
{
	pair[0].toBeDestroyed = true;
	coinSpawner.destroyFromList();
	pair[1].score+=1;
}

var checkInput = function (){
	
	if (keyPress[RIGHT_ARROW])
	{
		hero[0].push(0);	//push the hero left
	}
	if(keyPress[UP_ARROW])
	{
		hero[0].jump(); //hero jumps
	}
	if(keyPress[ENTER])
	{
		hero[0].shoot();
	}
	
	if (keyPress[65])
	{
		hero[1].push(0);	//push the hero left
	}
	if(keyPress[87])
	{
		hero[1].jump(); //hero jumps
	}
	if(keyPress[81])
	{
		hero[1].shoot();
	}
};

var platformer = function (name, x,y, size) {
	this.name = name;
    this.x = x; 
	this.y = y;
	this.width = size; //length and width of sprite
	this.height = size;
	this.bound = new bound(this.x, this.y, this.width, this.height);
	
    this.maxVelocity = 4; //maximum veloctiy allowed
	this.velocity = new vector(0,this.maxVelocity);
    this.accel = 0.2; //acceleration  value
	this.damping = 0.9; //rate of slowing down
	
	this.animSpeed = 20; //sprite animation speed
    this.animationSeq = "idleRight"; //starting animation spritesheet
	this.faceDirection = "right" //facing direction
	this.image = {}; //a place to store all animation spritesheets

	//gravity and jumping
	this.gravity = 0.08; //gravity strength
    this.isGravity = true; //whether gravity is off or not
	this.jumpStrength = 5; //strength of the heros jump
    this.isJumping = false; //whether the hero is in a jump state
    this.canJump = false; //whether hero can jump
    this.isInAir = true; //whether hero is in the air
    this.visible = true; //whether the hero is visible
	this.health = 30;
	this.score = 0;
	
    this.update = function() 
	{				
		updatePlatformer(this);//don't touch this...
	   	//start programming here	
		if (this.velocity.x > 0.05)
			{
			this.faceDirection = "right";
			this.animationSeq = "walkRight";
			this.animSpeed = 10;		
			}
			
		if (this.faceDirection == "right" && Math.abs(this.velocity.x) <= 0.05)
			this.animationSeq = "idleRight";
		
		if (this.health < 0)
		{
			this.health = 0;
			this.isDead = true;
			
		}
		
		drawBoundUpdate(this);
		//drawing is done at the end
		if(this.visible) //if visible is true draw hero at the right size;
		{	
			this.image[this.animationSeq].setSize(this.width, this.height);
			this.image[this.animationSeq].animate(this.x,this.y,this.animSpeed);
			fill(255,0,0);
			rect(this.x, this.y - 10, this.health, 5);
			text(this.score, this.x+12, this.y - 15);
		} 
	
		
    };
      
    this.jump = function()
	{
        if(this.canJump === true){
			this.isJumping = true;}
    };

	this.push = function(angle)
	{
		this.velocity.set(angle, this.accel);
	};

	this.shoot = function()
	{		
		bulletSpawner.spawn(new bullet(this.name,this.x,this.y+4,5,4));
	}	
};

var bullet = function(name, x,y, size, speed)
{
	this.name= name;
	this.x = x;
	this.y = y;
	this.size = size;
	this.speed = speed;
	this.bound = new bound(this.x, this.y, this.size, this.size);
	this.update = function()
	{ 
		this.x += this.speed;
		drawBoundUpdate(this);
		ellipse(this.x, this.y, this.size, this.size);
	};
};

var coin = function(x,y)
{
	this.x = x; 
	this.y = y;
	this.size = 16;
	this.bound = new bound(this.x, this.y, this.size, this.size);
	this.pic = new animation("pics/coin_anim.png", 10,44,40);
	this.update = function ()
	{
		this.pic.setSize(16,16);
		this.pic.animate(this.x, this.y, 3);
		drawBound(this.bound);
	}

}



function keyPressed()
{
	keyPress[keyCode] = true;
}

function keyReleased()
{
	keyPress[keyCode] = false;
}

