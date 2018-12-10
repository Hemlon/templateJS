
var fullscene = true; //set to true when working on the project
var keyPress = {};

var bg; //for storing the background image
var hero; //for storing the hero
var viewport; //viewport that follows the hero in what fullscene is off
var bgMusic; //for storing the music

var level1 = function()
{
this.preload = function()
{
	bg = loadImage("pics/background.png"); //load in the background picture
	bgMusic = loadSound("music/background"); //load in the mp3
	
	hero = new platformer(340,400,30);	//create a platforming character
	
	//add in the animation for the hero and a reference to it
	hero.image["idleRight"] = new animation("pics/fhero_idle_right.png", 4, 16,16);
	hero.image["walkRight"] = new animation("pics/fhero_walk_right.png", 4,16,16);	
	hero.image["walkLeft"] = new animation("pics/fhero_walk_left.png", 4,16,16);
};

this.setup = function()
{
	//switches between fullscene to viewport
	showCollisions = true; //set to true when working on the project
	if (fullscene)
		resizeCanvas(1250,630);
	else
		resizeCanvas(300,200);
	
	noSmooth();	//nice pixel art
	
	//adding bounds to the background for the character to walk on
	bgCollisions.addBounds(new bound(310,415,300,5));
	bgCollisions.addBounds(new bound(120,415,150,5));
	bgCollisions.addBounds(new bound(570,350,50,5));
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
	
	if(!fullscene)//handles the movement of the viewport let fullscene = false to use
	{	
		motion.follow(viewport, hero.x-100-hero.size, hero.y-150,2);
	}
		
		translate(-viewport.x, -viewport.y);
	
			image(bg, 0,0); //draw background

			//teleporting the player for testing purposes
			teleportToMouse(hero, viewport);	
			bgCollisions.draw();//draw the collision bounds		
			hero.draw(); //update and draw the hero
			drawMousePos.draw(); //draw the mouse position
		
	translate(viewport.x, viewport.y);
};

};

var checkInput = function (){
	if (keyPress[RIGHT_ARROW])
	{
		hero.push(0);	//push the hero left
	}
	if (keyPress[LEFT_ARROW])
	{
		hero.push(180);
	}
	if(keyPress[UP_ARROW])
	{
		hero.jump(); //hero jumps
	}
};

var platformer = function (x,y, size) {
	
    this.x = x; 
	this.y = y;
	this.width = size; //length and width of sprite
	this.height = size;
	
    this.maxVelocity = 4; //maximum veloctiy allowed
	this.velocity = new vector(0,this.maxVelocity);
    this.accel = 0.2; //acceleration  value
	this.damping = 0.9; //rate of slowing down
	
	this.animSpeed = 20; //sprite animation speed
    this.animationSeq = "idleRight"; //starting animation spritesheet
	this.faceDirection = "right" //facing direction
	this.image = {}; //a place to store all animation spritesheets

	//gravity and jumping
	this.gravity = 0.05; //gravity strength
    this.isGravity = true; //whether gravity is off or not
	this.jumpStrength = 20; //strength of the heros jump
    this.isJumping = false; //whether the hero is in a jump state
    this.canJump = false; //whether hero can jump
    this.isInAir = true; //whether hero is in the air
    this.visible = true; //whether the hero is visible

    this.draw = function() 
	{				
		updatePlatformer(this);//don't touch this...
	   	//start programming here	
		if (this.velocity.x > 0.05)
		{
			this.faceDirection = "right";
			this.animationSeq = "walkRight";
			this.animSpeed = 10;		
		}
			
		if (this.velocity.x < 0.05)
		{
			this.faceDirection = "left";
			this.animationSeq = "walkLeft";
			this.animSpeed = 10;		
		}	
			
		if (this.faceDirection == "right" && Math.abs(this.velocity.x) <= 0.05)
			this.animationSeq = "idleRight";
				
		//drawing is done at the end
		if(this.visible) //if visible is true draw hero at the right size;
		{	
			this.image[this.animationSeq].setSize(this.width, this.height);
			this.image[this.animationSeq].animate(this.x,this.y,this.animSpeed);
			drawBound(this);		
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
	
};

function keyPressed()
{
	keyPress[keyCode] = true;
}

function keyReleased()
{
	keyPress[keyCode] = false;
}

