var images = [];
var enemySpawner;
var bulletSpawner;
var collisionChecker;

var level1 = function() {
	this.preload = function()
	{
		images[0] = loadImage("pics/pokemon.png");       
	};

	this.setup = function()
	{  
		showCollision = true;
		resizeCanvas(400,400);	
		bulletSpawner = new spawnManager(0);
		enemySpawner = new spawnManager(50); //set enemy spawn delay to 50
	    collisionChecker = new collisionManager();
	};

	this.draw = function() 
	{
		background(200, 240, 255);	
		
		//handle the collision of the bulles and enemy
		var pair = collisionChecker.check(bulletSpawner.gameObj, enemySpawner.gameObj);
		if (pair)
			handleCollision(pair);
		
		//spawn a pokemon!!!
		var ypos = math.randInt(100,150);
		var pokemon = new enemy(images[0],400,ypos,-1,30);
		enemySpawner.spawn(pokemon);	
		enemySpawner.update();
		enemySpawner.destroyOutOfBounds(-100,500,0,400);
		
		//handle the bullets
		bulletSpawner.update();
		bulletSpawner.destroyOutOfBounds(-100,500,0,400);
	};
};

var enemy = function (img, x,y,velocity,size) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.size = size;
	this.bound = new bound(this.x, this.y, this.size,this.size);
    this.isDead = false;
    this.toBeDestroyed = false;
    this.image = img;
    	
    this.update = function() {	
        if (this.isDead === true) {
            this.y += 4;
        }	
        this.x += this.velocity;	
        image(this.image, this.x, this.y, this.size,this.size);
		drawBoundUpdate(this); 
    };   
};

var bullet = function(startx, starty, destx, desty, velocity, size) {
    this.x = startx;
    this.y = starty;
    this.velocity = velocity;
    this.destX = destx;
    this.destY = desty;
    this.size = size;	
    this.angle = calcAngle(this.x, this.y, destx, desty);	
    this.update = function() 	
	{
		motion.set(this, this.angle, this.velocity);
		ellipse(this.x,this.y, this.size, this.size);
	};
};


function handleCollision(pair)
{
	if (pair[1].isDead == false)
	{
	pair[0].toBeDestroyed = true;
	pair[1].toBeDestroyed = true;
	pair[1].isDead = true;
	bulletSpawner.destroyFromList(); 
	}
}

function mousePressed() {
    if (mouseButton === LEFT)
	{
       var b = new bullet(200,400,mouseX, mouseY, 10,16);
	   if(bulletSpawner)
			bulletSpawner.spawn(b);
    }
};

function mouseReleased() {
 
};
