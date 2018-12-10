var keyPress = {};
var roomWidth = 13;
var roomHeight = 12;
var blockSize = 30;
var bgImages = [];
var player;
var viewPort;
var mazePlayer = function (img,x,y, size) {
    this.name = genID("P");//all objects should have an id
    this.x = x; this.y = y; this.size = size;
    this.velocity = new vector(0, 2);
    this.accel = 0.4; //rate of acceleration
    this.depth = 0; //for depth sorting
    this.bound = new bound(this.x, this.y, this.size, this.size);
    this.img = img;

    this.update = function() 
    {
		motion.move(this, 0.9); //update movement
		checkMazeBgCollisions(this, mazeBgCollisions);	//so you don't go through walls
     	drawManager.drawList[this.name] = this; //update itself
    }; 

    this.push = function(angle) 
	{
		this.velocity.set(angle, this.accel); //move in a direction at a speed
    }

    this.draw = function() 
	{		 	 	
		//this.bound.draw(this.x, this.y); //draws bounds for debugging
		this.depth = this.y; //used for depth sorting...
		image(this.img, this.x, this.y, this.size,this.size);//draw the image.
	};
};

var level1 = function() {


this.preload = function()
{
	bgImages[0] = loadImage("pics/blank.png");
	bgImages[1] = loadImage("pics/wall.png");
	bgImages[2] = loadImage("pics/wall2.png");

	roomArrangement = [
                    2,0,1,1,1,1,1,1,1,1,2,0,1,
                    2,0,0,0,0,0,0,0,0,0,2,0,2,
                    1,0,1,1,1,1,2,1,2,0,2,0,1,
                    0,0,0,0,0,0,2,0,1,1,1,0,0,
                    2,0,2,1,1,0,2,0,0,0,0,0,2,
                    2,0,1,0,0,0,2,1,0,1,1,1,2,
                    2,1,0,0,2,0,2,0,0,0,0,0,2,
                    2,0,0,1,1,0,1,1,2,1,1,0,2,
                    2,0,2,0,0,0,0,0,2,0,0,0,2,
                    2,0,1,1,2,1,1,0,1,0,1,1,2,
                    2,0,0,0,2,0,0,0,0,0,0,0,2,
                    1,0,1,1,1,1,1,1,1,1,1,0,1
                    ];

	bg = new mazeBgObjects(bgImages, roomArrangement, roomWidth, roomHeight, blockSize);
	mazeBgCollisions.create(blockSize);

	var pic = loadImage("pics/explorer.png");
	player = new mazePlayer(pic, 30,50, blockSize);
	viewPort = new viewCam(player.x, player.y - 200);
};

this.setup = function() 
{		
	noSmooth();
	showCollisions = false;//shows or hide collision bounds for debugging
};

this.draw = function() {
	background(145, 239, 255);
	//motion.follow(player, mouseX, mouseY,2);
	if(keyPress[DOWN_ARROW])
		player.push(270);
	if(keyPress[UP_ARROW])
		player.push(90);
	if(keyPress[LEFT_ARROW])
		player.push(180);
	if(keyPress[RIGHT_ARROW])
		player.push(0);	

	push();
		scale(2);
		motion.follow(viewPort, player.x-80, player.y-80,1.5);
		player.update();
		translate(-viewPort.x, -viewPort.y);
		drawManager.draw();
		mazeBgCollisions.draw();
	pop();
	
};

};

keyPressed = function() {
	keyPress[keyCode] = true;
};

keyReleased = function() {
	keyPress[keyCode] = false; 
};

