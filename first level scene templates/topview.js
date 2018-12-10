
var players = [];
var keyPress = {};
var shipPic;
var sounds = {};
var playerSpawner = new spawnManager();
var projectileSpawner = new spawnManager();
var collisionChecker = new collisionManager();
var pause = false;

var level1 = function() {
	
	this.preload = function()
	{
		sounds["shoot"] = loadSound("music/shoot");	
		shipPic = loadImage("pics/ship2.png");
	};

	this.setup = function()
	{
		resizeCanvas(650, 650);  // set size of canvas
		// add your code here ...
		background(255, 0, 0);
		rectMode(CENTER);
		players[0] = new ship("p1",shipPic,100,100,0);
		players[1] = new ship("p2",shipPic, 200,200,0);
		playerSpawner = new spawnManager();
		playerSpawner.spawn(players[0]);
		playerSpawner.spawn(players[1]);
		projectileSpawner = new spawnManager(30);
		
	};
	
	this.draw = function() 
	{
		if(!pause){
			background(0, 0, 0);
			checkInput();
			
			var pair = collisionChecker.check(playerSpawner.gameObj, projectileSpawner.gameObj);
			if (pair)
			{
				if(pair[0].name != pair[1].name)
				{
					pause = true;
				}
			}
				
		projectileSpawner.destroyOutOfBounds(0,400,0,400);
		projectileSpawner.destroyFromList();
		playerSpawner.update();
		projectileSpawner.update();
		}
    
	};
};

var ship = function (name,img,x,y,angle) 
{
	this.name = name;
    this.x = x;
    this.y = y;
	this.size = 20;	
	this.damping = 1;
	this.accel = 0.1;
    this.angle = angle;
    this.maxVelocity = 2;
	this.velocity = new vector(this.angle,this.maxVelocity);
	this.velocity.x = 0; this.velocity.y = 0;
	
    this.bound = new bound(this.x-this.size.x/2, this.y-this.size.x/2, this.size, this.size);
    this.turnRate = 4;
    this.color = color(255, 0, 0);
    this.img = img;

    this.update = function() 
	{
	   motion.move(this, this.damping);
	   this.draw();
	   drawBoundUpdate(this);
	};
	
	this.accelerate = function ()
	{
		this.velocity.set(this.angle, this.accel);
	};
	
	this.deaccelerate = function ()
	{
		this.velocity.set(this.angle , -this.accel);
	};
	
	this.shoot = function () 
	{
		fill(this.color);
		//var angle = calcAngle(this.x, this.y, mouseX, mouseY);
		projectileSpawner.spawn(new bullet(this.name,this.x, this.y, this.angle, 5, 5));
	};
	
    this.turnLeft= function() 
	{
		this.angle += this.turnRate;
	};
    
	this.turnRight= function() 
	{
		this.angle -= this.turnRate;
	};

    this.draw = function() 
	{
		fill(this.color);
		//drawTriangle(this.x, this.y, this.angle, this.size);	//for debugging suppose
		push();
			translate(this.x, this.y);
			rotate(-1*math.toRad(this.angle-90));
			translate(-this.x,-this.y);
			rectMode(CENTER);
			image(this.img, this.x-this.size/2, this.y-this.size/2, this.size, this.size);	
		pop();
	};

};

var bullet = function(name, x,y,angle, size, velocity) {
	this.name = name;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.velocity = velocity;
    this.size = size;
	this.bound = new bound(this.x, this.y, this.size, this.size);
	
    this.update = function() {
        motion.set(this, this.angle, this.velocity);	
        ellipse(this.x, this.y, this.size,this.size);
		drawBoundUpdate(this);
    };
};


var checkInput = function () {
	
        if (keyPress[RIGHT_ARROW]) 
        {
			players[0].turnRight();
        }
        if (keyPress[LEFT_ARROW])
        {
			players[0].turnLeft();
        }
        if (keyPress[UP_ARROW])
        {
			players[0].accelerate();
        }
        if (keyPress[DOWN_ARROW]){
			players[0].deaccelerate();
        }
        if (keyPress[ENTER])
        {
			players[0].shoot();			
        }
};


keyPressed = function() {
	keyPress[keyCode] = true;
};

keyReleased = function() {
	keyPress[keyCode] = false;
};