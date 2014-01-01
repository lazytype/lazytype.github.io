// screen size variables
var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;		
var NUM_PARTICLES = 200;
var backgroundX = 0;
var body = $('body')[0];
var clock = 0;
var spaces = 0;
var canvas = document.getElementById('MainCanvas');
var c = canvas.getContext('2d');
var snowCanvas = document.getElementById('SnowCanvas');

var CorgiState = {
  STAND: 1,
  RUN: 2,
  JUMP: 3,
};

var particles = [];
var deadParticles = [];
Particle = function(x, y) {
  this.init = function(x, y) {
    this.colorFraction = Math.random();
    this.x = Math.round(x + 60 * Math.random() - 40);
    this.y = Math.round(y + 40 * this.colorFraction + 40);
    
    this.life = 100;
    this.drawn = false;
  };
  
  this.init(x, y);

  if (particles.length < NUM_PARTICLES) {
    particles.push(this);
  }
  
  this.clear = function() {
    c.clearRect(this.clearX, this.clearY, 3, 3);
  }
  
  this.draw = function() {
    if (this.drawn) {
      this.clear();
    }
    
    var fraction;
    if (Math.sin(this.colorFraction * 8 * Math.PI) > 0){
      fraction = this.colorFraction / 25;
    } else {
      fraction = .3 + (this.colorFraction - .5) / 25;
    }


    var s =  'rgba(' + hsvToRgb(fraction, 1, 1) + ',127)';
    c.fillStyle = s;
    c.fillRect(this.x, this.y, 3, 3);

    this.clearX = this.x;
    this.clearY = this.y;
    
    this.drawn = true;
    this.life--;
  }
};

CorgiImage = function() {
  this.drawn = false;
  this.left = new Image();
  this.right = new Image();
  this.left.pos = 0;
  this.right.pos = 0;
  this.left.index = 0;
  this.right.index = 0;
  
  this.left.nextFrame = function() {
    this.pos += this.frameWidth;
    this.index += 1;
    
    if (this.index >= this.frames) {
      this.pos = 0;
      this.index = 0;	
    }
  };

  this.right.nextFrame = this.left.nextFrame;
  
  this.draw = function() {
    if (!this.drawn) {
      this.clear();
    }
    else {
      this.drawn = true;
    }
    
    this.clearX = this.x;
    this.clearY = this.y;
    c.drawImage(
      this.left, this.left.pos, 0,
      this.left.frameWidth, this.left.height,
      this.x, this.y,
      this.left.frameWidth, this.left.height
    );
    c.drawImage(
      this.right, this.right.pos, 0,
      this.right.frameWidth, this.right.height,
      this.x + this.left.frameWidth, this.y,
      this.right.frameWidth, this.right.height
    );
  };
  
  this.clear = function() {
    c.clearRect(
      this.clearX,
      this.clearY, 
      this.left.frameWidth + this.right.frameWidth,
      this.left.height
    );
  }
  
  this.begin = function() {    
    corgi.left.src = 'CorgiButtRight.png';
    corgi.right.src = 'CorgiHeadRight.png';
    corgi.left.frames = 2;
    corgi.right.frames = 4;
    
    $(corgi.left).load(function() {
      corgi.left.frameWidth = corgi.left.width / corgi.left.frames;
      $(corgi.right).load(function() {
        $(this).unbind();
        corgi.right.frameWidth = corgi.right.width / corgi.right.frames;
      });
    });
  
    $(corgi.right).load(function() {
      corgi.right.frameWidth = corgi.right.width / corgi.right.frames;
      $(corgi.left).load(function() {
        $(this).unbind();
        corgi.left.frameWidth = corgi.left.width / corgi.left.frames;
      });
    });
  };
};

$(document).ready(function() {
  StartMove();
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  //snowCanvas.width = SCREEN_WIDTH;
  //snowCanvas.height = SCREEN_HEIGHT;
  corgi = new CorgiImage();

  corgi.x = SCREEN_WIDTH / 2 - 88;
  corgi.y = SCREEN_HEIGHT / 2 - 60;
  corgi.begin();
  
  /*var myAudio2 = new Audio('bells.ogg');
  myAudio2.defaultPlaybackRate = .8;
  myAudio2.volume = .05;
  myAudio2.load();
  document.body.appendChild(myAudio2);
  myAudio2.addEventListener('ended', function() {
    this.currentTime = 1;
    this.play();
  }, false);
  myAudio2.play();*/
  //snowInit();
  tick();
 
});

function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function drawParticles() {
  if (particles.length < NUM_PARTICLES) {
    new Particle(corgi.x, corgi.y);
  }
  
  for (var i=0; i<particles.length; i++) {
    var particle = particles[i];
    if (particle.life == 0) {
      particle.clear();
      particle.init(corgi.x, corgi.y);
    }
    particles[i].x -= 1;
    particles[i].draw();
  }
}

function tick() {  
  clock = 1 + clock % 800;

  if (clock % (10 * corgi.right.frames) == 0) {
    corgi.left.nextFrame();
  }
  if (clock % (10 * corgi.left.frames) == 0) {
    corgi.right.nextFrame();
  }
  corgi.draw();
  
  if (spaces > 0 && clock % 50 == 0) {
    spaces--;
    corgi.y += 20;
  }
  
  if (clock % 80 == 0) {
    corgi.y += 2;
  }
  if (clock % 80 == 20) {
    //corgi.x += 60;
    //backgroundX -= 60;
    corgi.y -= 4;
  }
  if (clock % 80 == 40) {
    //corgi.x += 60;
    //backgroundX -= 60;
    corgi.y -= 2;
  }
  if (clock % 80 == 60) {
    //corgi.x += 20;
    //backgroundX -= 20;
    corgi.y += 4;
  }

  if (corgi.x > canvas.width + 200) {
    //corgi.x = -180;
  }

  drawParticles();
  setTimeout(tick, 1);
}

function StartMove() {
  var cssBGImage=new Image();
  cssBGImage.src="background.png";

  window.cssMaxWidth=cssBGImage.width;
  window.cssXPos=0;
  setInterval("MoveBackGround()",12);
}

function MoveBackGround() {
  window.cssXPos=window.cssXPos-5;
  if (window.cssXPos>=SCREEN_WIDTH) {
    window.cssXPos=0;
  }
  toMove=$('body')[0];
  toMove.style.backgroundPosition = window.cssXPos+"px 0px";
}

function snowInit(){
  // Now the emitter
  var emitter = Object.create(rectangleEmitter);
  emitter.setCanvas(snowCanvas);
  emitter.setBlastZone(0, -50, snowCanvas.width, snowCanvas.height);
  emitter.particle = snow;
  emitter.runAhead(60);
  emitter.start(20);
};


// fireworks stuffs begin here

// when animating on canvas, it is best to use requestAnimationFrame instead of setTimeout or setInterval
// not supported in all browsers though and sometimes needs a prefix, so we need a shim
window.requestAnimFrame = ( function() {
  return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ) {
          window.setTimeout( callback, 1000 / 60 );
        };
})();

// now we will setup our basic variables for the demo
var fireCanvas = document.getElementById( 'FireCanvas' ),
    ctx = fireCanvas.getContext( '2d' ),
    // full screen dimensions
    cw = window.innerWidth,
    ch = window.innerHeight,
    // firework collection
    fireworks = [],
    // particle collection
    fireParticles = [],
    // starting hue
    hue = 120,
    // when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
    limiterTotal = 5,
    limiterTick = 0,
    // this will time the auto launches of fireworks, one launch per 80 loop ticks
    timerTotal = 6,
    timerTick = 0;
    //mousedown = false,
    // mouse x coordinate,
    //mx,
    // mouse y coordinate
    //my;
    
// set canvas dimensions
fireCanvas.width = cw ;
fireCanvas.height = ch ;
ctx.scale(3,3);

// now we are going to setup our function placeholders for the entire demo

// get a random number within a range
function random( min, max ) {
  return Math.random() * ( max - min ) + min;
}

// calculate the distance between two points
function calculateDistance( p1x, p1y, p2x, p2y ) {
  var xDistance = p1x - p2x,
      yDistance = p1y - p2y;
  return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

// create firework
function Firework( sx, sy, tx, ty ) {
  // actual coordinates
  this.x = sx;
  this.y = sy;
  // starting coordinates
  this.sx = sx;
  this.sy = sy;
  // target coordinates
  this.tx = tx;
  this.ty = ty;
  // distance from starting point to target
  this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
  this.distanceTraveled = 0;
  // track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
  this.coordinates = [];
  this.coordinateCount = 3;
  // populate initial coordinate collection with the current coordinates
  while( this.coordinateCount-- ) {
    this.coordinates.push( [ this.x, this.y ] );
  }
  this.angle = Math.atan2( ty - sy, tx - sx );
  this.speed = 2;
  this.acceleration = 1.05;
  this.brightness = random( 50, 70 );
  // circle target indicator radius
  this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function( index ) {
  // remove last item in coordinates array
  this.coordinates.pop();
  // add current coordinates to the start of the array
  this.coordinates.unshift( [ this.x, this.y ] );
  
  // cycle the circle target indicator radius
  if( this.targetRadius < 8 ) {
    this.targetRadius += 0.3;
  } else {
    this.targetRadius = 1;
  }
  
  // speed up the firework
  this.speed *= this.acceleration;
  
  // get the current velocities based on angle and speed
  var vx = Math.cos( this.angle ) * this.speed,
      vy = Math.sin( this.angle ) * this.speed;
  // how far will the firework have traveled with velocities applied?
  this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );
  
  // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
  if( this.distanceTraveled >= this.distanceToTarget ) {
    createFireParticles( this.tx, this.ty );
    // remove the firework, use the index passed into the update function to determine which to remove
    fireworks.splice( index, 1 );
  } else {
    // target not reached, keep traveling
    this.x += vx;
    this.y += vy;
  }
}

// draw firework
Firework.prototype.draw = function() {
  ctx.beginPath();
  // move to the last tracked coordinate in the set, then draw a line to the current x and y
  ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
  ctx.lineTo( this.x, this.y );
  ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
  ctx.stroke();
  
  ctx.beginPath();
  // draw the target for this firework with a pulsing circle
  ctx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
  ctx.stroke();
}

// create particle
function FireParticle( x, y ) {
  this.x = x;
  this.y = y;
  // track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
  this.coordinates = [];
  this.coordinateCount = 5;
  while( this.coordinateCount-- ) {
    this.coordinates.push( [ this.x, this.y ] );
  }
  // set a random angle in all possible directions, in radians
  this.angle = random( 0, Math.PI * 2 );
  this.speed = random( 1, 10 );
  // friction will slow the particle down
  this.friction = 0.95;
  // gravity will be applied and pull the particle down
  this.gravity = 1;
  // set the hue to a random number +-20 of the overall hue variable
  this.hue = random( hue - 20, hue + 20 );
  this.brightness = random( 50, 80 );
  this.alpha = 1;
  // set how fast the particle fades out
  this.decay = random( 0.015, 0.03 );
}

// update particle
FireParticle.prototype.update = function( index ) {
  // remove last item in coordinates array
  this.coordinates.pop();
  // add current coordinates to the start of the array
  this.coordinates.unshift( [ this.x, this.y ] );
  // slow down the particle
  this.speed *= this.friction;
  // apply velocity
  this.x += Math.cos( this.angle ) * this.speed;
  this.y += Math.sin( this.angle ) * this.speed + this.gravity;
  // fade out the particle
  this.alpha -= this.decay;
  
  // remove the particle once the alpha is low enough, based on the passed in index
  if( this.alpha <= this.decay ) {
    fireParticles.splice( index, 1 );
  }
}

// draw particle
FireParticle.prototype.draw = function() {
  ctx. beginPath();
  // move to the last tracked coordinates in the set, then draw a line to the current x and y
  ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
  ctx.lineTo( this.x, this.y );
  ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
  ctx.stroke();
}

// create particle group/explosion
function createFireParticles( x, y ) {
  // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
  var particleCount = 30;
  while( particleCount-- ) {
    fireParticles.push( new FireParticle( x, y ) );
  }
}

// main demo loop
function loop() {
  // this function will run endlessly with requestAnimationFrame
  requestAnimFrame( loop );
  
  // increase the hue to get different colored fireworks over time
  hue += 0.5;
  
  // normally, clearRect() would be used to clear the canvas
  // we want to create a trailing effect though
  // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
  ctx.globalCompositeOperation = 'destination-out';
  // decrease the alpha property to create more prominent trails
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect( 0, 0, cw, ch );
  // change the composite operation back to our main mode
  // lighter creates bright highlight points as the fireworks and particles overlap each other
  ctx.globalCompositeOperation = 'lighter';
  
  // loop over each firework, draw it, update it
  var i = fireworks.length;
  while( i-- ) {
    fireworks[ i ].draw();
    fireworks[ i ].update( i );
  }
  
  // loop over each particle, draw it, update it
  var i = fireParticles.length;
  while( i-- ) {
    fireParticles[ i ].draw();
    fireParticles[ i ].update( i );
  }
  
  // launch fireworks automatically to random coordinates, when the mouse isn't down
  if( timerTick >= timerTotal ) {
      // start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
      var tcw = cw / 3;
      var tch = ch / 3;


      fireworks.push( new Firework( tcw / 2, tch, random( 0, tcw ), random( 0, tch / 2 ) ) );
      timerTick = 0;
  } else {
    timerTick++;
  }
  
  // limit the rate at which fireworks get launched when mouse is down
  if( limiterTick >= limiterTotal ) {

  } else {
    limiterTick++;
  }
}

// once the window loads, we are ready for some fireworks!
window.onload = loop;


