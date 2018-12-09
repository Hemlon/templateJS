var keys = {};
var letters = {};
var mouseClicked = {}
var showCollisions = false;

var delayObject = function(delay)
{
	this.delay = delay;
	this.delayCount =0;
	this.delayCount =0;
}


var scene = function(name, action) {
	this.name = name;
	this.run = action;
};

var viewCam= function(x,y) {
	this.x = x;
	this.y = y;
};

var math = {
    upper: function(value, limit) { 
        if(value > limit) {
            return limit;      
        }
        else {
        return value;
        }
    },

    lower: function(value, limit) {
        if (value < limit) {
            return limit;
        }
        else {
            return value;
        }
    },

    between: function (value, lowlimit, upplimit) {
        value = this.upper(value, upplimit);
        value = this.lower(value, lowlimit);
        return value;
    },

    randInt: function (low, high) {return Math.round(low+Math.random()*   (high-low),0);}
};

var motion = {
	angle: 0,
	freq: {},
	set: function(object, angle, speed)
	{
	  	object.x += speed *Math.cos(angle*Math.PI/180);
		object.y += speed *Math.sin(angle*Math.PI/180);
	},

	follow: function(follower, x,y, speed) {
		var angle = direction(follower, x, y);
		if (!inBounds(follower, x-1,x+1,y-1,y+1))
			this.set(follower,angle,speed);
	},
	
	away: function(awayer, x,y,speed)
	{
		var angle = direction(awayer, x, y) - 180;
		this.set(awayer,angle,speed);
	},

	circular: function(object, speed, ang)
	{	this.angle += ang;
		if (this.angle >= 360) this.angle = 0;
		this.set(object, this.angle, speed);
	},

	bop: function(object, amp, freq)
	{		
		this.freq += freq;
		if (this.freq >=360) this.freq = 0;
		object.y += amp*Math.sin(this.freq* Math.PI/180);
	}
};

var keepInbounds = function(object, xmin, xmax, ymin, ymax){
    if (object.x < xmin) {object.x = xmax;}
    else if(object.x > xmax)  {object.x = xmin;}
    if (object.y < ymin) {object.y = ymax;}
    else if (object.y > ymax) {object.y = ymin;}
};

var destroyFromList = function(itemList) 
{
     var count = itemList.length;
    for (var i = 0 ; i < count; i++)
   {
        if (itemList[i].toBeDestroyed === true)
        {        
            itemList.splice(i, 1);
            i--;
            count--;
        }
    }
    return itemList;  
};

var inBounds = function(object, xmin, xmax, ymin, ymax){
    var inside = false;
    if(object.x >= xmin && object.x <=xmax)
    {
        if(object.y >= ymin && object.y <= ymax)
        {
            inside = true;
        }
    }
    return inside;
};


var destroyOutOfBounds = function(itemList, xmin, xmax, ymin, ymax){
    for (var i = 0 ; i < itemList.length; i++)
    {
        if (inBounds(itemList[i], xmin, xmax, ymin, ymax) === false)
        {
            itemList[i].toBeDestroyed = true;
        }
        else
        {
            itemList[i].toBeDestroyed = false;
        }
    }

    var count = itemList.length;
    for (var i = 0 ; i < count; i++)
    {
        if (itemList[i].toBeDestroyed === true)
        {         
            itemList.splice(i, 1);
            i--;
            count--;
        }
    }
    return itemList;
};

var direction = function (from, x,y){
	dy = y - from.y;
	dx = x - from.x;
	var angle = 0;
	if(dx !== 0)
	{
	     angle = Math.atan(dy/dx)*180/Math.PI;
	}
	if (dx < 0)
		angle = 180 + angle;
	return angle;
};

var collide = function(object, object2)
{
	return inBounds(object, object2.x - object2.size/2, object2.x + object2.size/2,object2.y - object2.size/2, object2.y + object2.size/2);
};

var bgObjects = function(assets, room, width, height, blockSize)
{	
	this.assets = assets;
	this.room = room;
	this.width = width;
	this.height = height;
	this.name = "";

	this.blockSize = blockSize;
	this.draw = function()
	{	
           		 for (var i = 0 ; i < this.height; i++) 
            		{
               	 	for (var j = 0; j < this.width; j++)
               	 	{
                   		var picIndex = this.room[this.width*i + j];
                   		image(this.assets[picIndex], j*this.blockSize, i*this.blockSize,this.blockSize,this.blockSize);
                		}
          		  }	
	};
};

var drawManager = {

    drawCount:0,
    drawList:[],
    depth:[],

    draw: function() {

    var keys = Object.keys(this.drawList);

    for(var i = 0; i < keys.length; i++)
    {
       	this.depth[i] = this.drawList[keys[i]].depth;
    }

  	 keys = insertionSort(this.depth, keys);
    	 var index = 0;

   		while (this.drawList[keys[index]] != undefined)
    		{  
       			this.drawList[keys[index]].draw();
        			index++;
   		}
   
    }
};


var mazeBgObjects =function(assets, room, width, height, blockSize) 
{	
	this.assets = assets;
	this.room = room;
	this.width = width;
	this.height = height;
	this.name = "";
	this.blockSize = blockSize;

           		for (var i = 0 ; i < this.height; i++) 
            		{
               	 	for (var j = 0; j < this.width; j++)
               	 	{
                   		var picIndex = this.room[this.width*i + j];
			this.name = "B" + (13*i+j).toString();
                   		drawManager.drawList[this.name] = new gameObject(this.assets[picIndex],j*this.blockSize, i*this.blockSize, this.blockSize, this.blockSize*2, i*this.blockSize);
                		}
          		  }
		
};

var gameObject = function(img,x,y,width,height, depth) {
 	this.img = img;
 	this.x = x;
 	this.y = y;
 	this.width = width;
 	this.height = height;
 	this.depth = depth;
 	this.toBeDestroyed = false;
 	this.visible = true;
 	this.draw = function() {
    		if (this.visible == true)
     		image(this.img, this.x, this.y,this.width, this.height);
 	};
};


function spawnObjects(objectList, object, objectWidth, width, height, delay)
{
        	if (delay.delayCount < delay.delay)
        		{
           		delay.delayCount++;
        		}
       	 else {
        		var x = math.randInt(0,width)*objectWidth;
       		var y = math.randInt(0,height)*objectWidth;
        		objectList[objectList.length] = new object(x,y,objectWidth);
          		delay.delayCount= 0;
       	 }
};

var delayControl = function(delay) {

	this.alert= false;
	this.delay = delay;
	this.delayCount = 0;

	this.run = function() {
		if (this.delayCount < this.delay)
		{
			this.delayCount += 1;
			this.alert = false;
		}
		else
		{
			this.delayCount = 0;
			this.alert = true;
		}
	};

	this.reset = function () {
		this.delayCount = 0;
		this.alert = false;
	};

	this.setDelay = function (delay) {
		this.delay = delay;
	};

};

var animation = function(img, totalframes,framewidth, frameheight) {

	this.offset = 0;
	this.currentFrame = 0;
	this.spriteSheet = loadImage(img);
	this.frameWidth = framewidth;
	this.frameHeight = frameheight;
	this.endFrame = totalframes;
	this.x = 0;
	this.y = 0;
        this.width = framewidth;
        this.height = frameheight;    
	this.on = true;
	this.delayControl = new delayControl(1);
	this.framePic = this.spriteSheet.get(this.offset + this.currentFrame*this.frameWidth, 0, this.frameWidth, this.frameHeight);
	
	this.setFrame = function (frameNumber) {
		this.currentFrame = frameNumber;
		this.framePic = this.spriteSheet.get(this.offset + this.currentFrame*this.frameWidth, 0, this.frameWidth, this.frameHeight);
		image(this.framePic,this.x,this.y, this.width, this.height);
	};

	this.animate = function(x,y,framerate) {	
		this.x = x;
		this.y = y;
                this.setFrame(this.currentFrame);
		this.delayControl.setDelay(framerate);
		
		if (this.on) {
			this.delayControl.run();		
			}
		else
		{
			this.delayControl.reset();
		}

		if (this.delayControl.alert)
		{
			this.currentFrame += 1;
			if (this.currentFrame >= this.endFrame)
			{
				this.currentFrame = 0;
			} 
		
			this.framePic = this.spriteSheet.get(this.offset + this.currentFrame*this.frameWidth, 0, this.frameWidth, this.frameHeight);
		}
                
                
		image(this.framePic,this.x,this.y, this.width, this.height);

	};

	this.stop = function() {
		this.on = false;

	};
	this.start = function() {
		this.on = true;

	};
       
};

animation.prototype.setSize = function(width, height)
{
        this.width = width;
        this.height = height;
}


var inBoundsOf = function(x,y, obj) {
        if (x < obj.x + obj.width && x > obj.x && y > obj.y && y < obj.y + obj.height)
        {  
	return true;
        }
        else
        { 
	return false;
        }
};

var drawTextRect = function(x,y,width, height, label, textSize, backcolor, forecolor)
{
         this.font = "Comic Sans MS";
         fill(backcolor);
         rect(x,y,width,height);
         fill(forecolor);
         textAlign(CENTER,CENTER);
         textFont(this.font, textSize);
         text(label,x, y, width, height);
};

var drawButtons = function(button)
{
     for (var i =0;i < button.length ;i++)
     {
         drawTextRect(button[i].x, button[i].y, button[i].width, button[i].height, button[i].label, button[i].textSize, button[i].backColor, button[i].foreColor);
     }
};

var drawTextBoxes = function(textBox) {
    var white = color(255, 255, 255);
    var grey = color(207, 207, 207);
    for (var i = 0 ; i < textBox.length; i++) {
     if (textBox[i].isFocused)
    {
        drawTextRect(textBox[i].x,textBox[i].y,textBox[i].width,textBox[i].height,textBox[i].label, button[i].textSize,white, textBox[i].foreColor);
    }
    else if (!textBox[i].isFocused)
    {
        drawTextRect(textBox[i].x,textBox[i].y,textBox[i].width,textBox[i].height,textBox[i].label, button[i].textSize,textBox[i].backColor, textBox[i].foreColor);
    }
    }
};

function textBoxFunction(textBox) {

    for (var i = 0; i < textBox.length; i++)
    {
    if (textBox[i].isFocused)
        {   
     if (keyCode === BACKSPACE){
        textBox[i].label = textBox[i].label.substring(0,textBox[i].label.length-1);
     }
     else if (keyCode === ENTER) {
         textBox[i].enter();
    }
     else
    {
    var chr = key;//String.fromCharCode(key);
    textBox[i].label += chr;
    }
    	keyCode = "";
    }
    }
};

function textBoxFocus(textBox)
{
 	for (var j = 0 ; j < textBox.length; j++)
  	 {	
         		textBox[j].isFocused = false;
        		if (inBoundsOf(mouseX, mouseY, textBox[j]))
			{
           		textBox[j].clicked();
        			}
	}
};

var textBox = function(x,y,text,backcolor, forecolor)
{
	this.x = x;
	this.y = y;
	this.height = 50;
	this.width = 200;
	this.textSize = 30;
	this.label = text;
	this.backColor = backcolor;
	this.foreColor = forecolor;
	this.isFocused = false;
	this.clicked = function() {this.isFocused=true;};
	this.enter = function() {};
};

var button = function(x,y,text,backcolor, forecolor)
{
	this.x = x;
	this.y = y;
	this.height = 50;
	this.width = 200;
	this.textSize = 30;
	this.label = text;
	this.backColor = backcolor;
	this.foreColor = forecolor;
	this.isFocused = false;
	this.clicked = function() {this.isFocused=true;};
	this.enter = function() {};	
};

function buttonFocus(buttons)
{
    for (var i = 0; i < buttons.length; i++)
    {
        if (inBoundsOf(mouseX, mouseY, buttons[i])) {
            buttons[i].clicked();
        }
    }

};

function keyPressedFunction()
{
  keys[keyCode] = true;
  
  letters[key] = true;
}

function keyReleasedFunction()
{
   keys[keyCode] = false; 
     
   letters[key] = false;
}



var animatedText =  function (sometext, framerate,x,y, spacing) {
		this.chars = sometext.split('');
		this.delaycontrol = new delayControl(framerate);
		this.currentChar = 0;
		this.isFinished = false;
		this.x = x;
		this.y = y;
		this.message = "";
		this.run = function () {
			this.delaycontrol.run();

			if( !this.isFinished)
				text(this.message, this.x + this.currentChar,this.y);

			if (this.delaycontrol.alert)
			{		
				if (this.currentChar >= this.chars.length)
				{
				this.isFinished = true;
				}
				else
				{
				this.message += this.chars[this.currentChar];
				this.x += 8;
				this.currentChar+=1;
				}
			}
		};

		this.show = function () {
			if (this.isFinished)
				text(this.message , this.x, this.y);
		}
};


var animateAllText = {
	currentText:0,
	run: function(animatedTexts) 
	{
		for (let i = 0; i < animatedTexts.length ; i++)
		{
		animatedTexts[i].show();
		}

		if (animatedTexts[this.currentText].isFinished && this.currentText < animatedTexts.length-1)
			this.currentText +=1;
		else
			animatedTexts[this.currentText].run();
	}
};
	

var bound = function(x,y,width, height) {
    this.x=x;
    this.y=y;
    this.height=height;
    this.width=width;
    this.draw = function() {
        if (showCollisions){
			stroke(90,32,233);
        	fill(255, 0, 0,0);
        	rect(this.x, this.y,this.width, this.height);}
    };
};


var insertionSort = function(A,B) {
 var key = 0; var item = 0; var j = 0;
   for (var i = 1; i < A.length; i++)
   {
       key = A[i];
       item = B[i];
       j = i-1;
 
       while (j >= 0 && A[j] > key)
       {
           A[j+1] = A[j];
           B[j+1] = B[j];
           j = j-1;
       }
       
       A[j+1] = key;
       B[j+1] = item;
   }
   return B;
};


var spheric = function() {
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.velocity = 3;
    this.color = color(0, 0, 0);
    this.delayCount = 0;
    this.delay = 0;
    this.toBeDestroyed = false;
    this.draw = function() {
         stroke(204, 151, 37);
        fill(255, 255, 255,0);
         ellipse(this.x, this.y, this.radius*2, this.radius*2);
         stroke(0, 0, 0);
    };
    this.update = function() {
        if (this.delayCount < this.delay) {
            this.delayCount++;
        }
        else
        {
          this.radius += this.velocity;  
        }
        if (this.radius > 200)
        {
            this.toBeDestroyed = true;
        }
    };
};


var mazeBgCollisions = {
    bounds: [],
    base: [],
    side: [],
    leftSide: [],
    thick: 8,
    create: function() {
        var prev = 0; var boundaryWidth  = 0; var boundCount = 0;
        var current = -1; var locx= 0 ; var locy = 0; var makeIt = false;
        
        for (var i = 0; i < roomHeight; i++)
        {
            prev = 0;
            for (var j =0; j < roomWidth; j++)
            { 
            current = roomArrangement[(roomWidth)*i + j];
             //   println(current);
                if (current  === 1 && prev === 0)
                {
                    boundaryWidth = 0;
                    locx = i;
                    locy = j;
                }
                else if (current === 1 && prev === 1)
                {
                    boundaryWidth += 1;
                }
                else if(current === 0 && prev === 1)
                {
                    boundaryWidth +=1;
                this.makeIt(locx, locy, boundaryWidth,boundCount);
                boundCount++;
                }
                
                 prev = current;
                
            }
            if(current === 1){
            boundaryWidth++;
            this.makeIt(locx, locy, boundaryWidth,boundCount);
            boundCount++;}
           
        }
        
        for (var i = 0; i < this.bounds.length; i++)
        {
            this.base[i] = new bound(this.bounds[i].x, this.bounds[i].y+this.bounds[i].height, this.bounds[i].width+this.thick, this.thick);
            this.side[i] = new bound(this.bounds[i].x + this.bounds[i].width, this.bounds[i].y-1*this.thick, this.thick+3,this.bounds[i].height+1.8*this.thick);
            this.leftSide[i] = new bound(this.bounds[i].x-this.thick, this.bounds[i].y-1*this.thick,2*this.thick,this.bounds[i].height+1.8*this.thick);
        }
        
    },
    
    makeIt: function(locx, locy, boundaryWidth, boundCount) {
	    this.bounds[boundCount] = new bound(locy*30-10,locx*30+25,boundaryWidth*30+10,20);
                   boundaryWidth=0;
                   locx = 0;
                   locy = 0;
    },


    draw: function() {
        for (var i = 0; i < this.bounds.length;i++)
         {
            this.bounds[i].color = color(255, 0, 0);
            this.bounds[i].draw();
         }
         
         for (var i = 0; i < this.base.length;i++)
         {
              this.base[i].color = color(255, 252, 224);
              this.base[i].draw();
         }
         
         for (var i = 0; i < this.side.length; i++)
         {
             this.side[i].draw();
             this.leftSide[i].color = color(7, 7, 168);
             this.leftSide[i].draw();
         }
    },
    
};

var bgCollisions = {
    bounds: [],
    base: [],
    side: [],
    leftSide: [],
    addBounds: function(bound) {
	this.bounds[this.bounds.length] = bound;
	},
    create: function() {
 
        for (var i = 0; i < this.bounds.length; i++)
        {
            this.base[i] = new bound(this.bounds[i].x, this.bounds[i].y+10, this.bounds[i].width, this.bounds[i].height+20);
            this.side[i] = new bound(this.bounds[i].x + this.bounds[i].width-9, this.bounds[i].y+1, 20,25);
            this.leftSide[i] = new bound(this.bounds[i].x-12, this.bounds[i].y+1, 20,25);
        }
        
        this.leftSide.splice(this.bounds.length, 1);
        this.side.splice(this.bounds.length,1); 
    },
    
    draw: function() {
        for (var i = 0; i < this.bounds.length;i++)
         {
            this.bounds[i].draw();
         }
         
         for (var i = 0; i < this.base.length;i++)
         {
              this.base[i].color = color(156, 29, 29);
              this.base[i].draw();
         }
         
         for (var i = 0; i < this.side.length; i++)
         {
             this.side[i].draw();
             this.leftSide[i].draw();
         }
    },
    
};


var projectile = function() {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.velocity = 3;
    this.size = 5;
    this.update = function() {
        this.x += this.velocity*Math.cos(this.angle*Math.PI/180);
        this.y += this.velocity*Math.sin(this.angle*Math.PI/180);
    };
    this.draw = function() {
        ellipse(this.x, this.y, this.size,this.size);
    };
};


var gameDuration = {
    gameTime:0, 
    duration: 60,
    interval: 1000,
set: function(duration, interval) {
    this.gameTime = 0;
    this.duration = duration;
    this.interval = interval;
},
update: function(callback) {
    this.gameTime++;
if (this.gameTime > this.interval)
{
     this.gameTime = 0;
   if (this.duration > 0)
   {
       this.duration--;
   }
   else
   {
        callback();
        this.gameTime = this.interval + 10;
   }
   
}
},
draw: function(font, fontsize,color, x,y) {
       textFont(font);
       textSize(fontsize);
       fill(color);
       text(this.duration, x,y); 
}
};

var drawTriangle = function(centreX, centreY, angle, size) {
var angles = [];
angles[0] = angle;
angles[1] = angle - 120;
angles[2] = angle + 120;
var p = [];
for (var i = 0 ; i < 3; i++)
{
    p[2*i] = size*Math.cos(angles[i]*Math.PI/180);
    p[2*i+1] = size*Math.sin(angles[i]*Math.PI/180);
}
triangle(centreX + 1.5*p[0], centreY + 1.5*p[1], centreX + p[2], centreY + p[3], centreX + p[4], centreY + p[5]);
};


