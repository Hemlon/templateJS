var scenes = [];
var currentScene = 0;
var sentence = [];
var canvas;
var startButton;

var titlePage = function () 
{
	this.preload = function() {
		sentence[0] = new animatedText("Hello",5, 0,200,20);
		sentence[0].setColor(255,255,255);
	};
	
	this.setup = function() {
		showCollisions = true;
		canvas = createCanvas(400,400);
		startButton = new buttonRect("START", 20,20,100,50);
		startButton.action = function () {
			scenes[1].setup();
			currentScene = 1;
		};
	};

	this.draw = function(){	
		background(0,0,0);
		animateAllText.run(sentence);	
		/*
		var b = new bound(20,20,100,50);
		fill(0,255,0);
		rect(b.x, b.y,b.width,b.height);	
		fill(255,0,0);		
		text("START GAME",b.x+20,b.y+b.height/2,b.width,b.height);*/
		startButton.update();
		
		if (mouseButton == LEFT)
		{
			mouseButton = null;
			startButton.click();
		}
	};
};

function preload() {	
	scenes[0] = new titlePage();
	scenes[1] = new level1();
	
	scenes.forEach((scene, index) => {
		scene.preload();		
	});
};

function setup() {
	scenes[currentScene].setup();
};

function draw() {
	scenes[currentScene].draw();
};