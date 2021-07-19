var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score = 0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload() {
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")

  backgroundImg = loadImage("assets/good.jpg")
  //sunAnimation = loadImage("assets/sun.png");

  trex_running = loadAnimation("assets/ramji.png");
  //trex_collided = loadAnimation("assets/trex_collided.png");

  //groundImage = loadImage("assets/base.png");

  cloudImage = loadImage("assets/cloud.png");

  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");

  gameOverImg = loadImage("assets/oops.png");
  restartImg = loadImage("assets/final2.png");
}

function setup() {
  createCanvas(1360, 600);

  //sun = createSprite(width-50,100,10,10);
  //sun.addAnimation("sun", sunAnimation);
  //sun.scale = 0.1

  trex = createSprite(150, 300);
 

  trex.addAnimation("running", trex_running);
  //trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle', -50, 0, 250)
  trex.scale = 0.1
  trex.debug=true

  invisibleGround = createSprite(188, 505, 20000, 10);
  invisibleGround.visible=false;

  ground = createSprite(115, 513,80000,0.1);
  

  //grou
  //ground.velocityX = -(6 + 3*score/100);

  gameOver = createSprite(633, 216);
  gameOver.addImage(gameOverImg);


  restart = createSprite(644, 324);
  restart.addImage(restartImg);

  gameOver.scale = 0.2;
  restart.scale = 0.15;

  gameOver.visible = false;
  restart.visible = false;


  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
 
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: " + score, 30, 50);
  text(mouseX + ',' + mouseY, 33, 23);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    //ground.velocityX = -(6 + 3*score/100);

    if ((touches.length > 0 || keyDown("SPACE")) && trex.y >= height - 240) {
      jumpSound.play()
      trex.velocityY = -10;
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      collidedSound.play()
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    //trex.changeAnimation("collided",trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (touches.length > 0 || keyDown("SPACE")) {
      reset();
      touches = []
    }
  }


  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width + 20, height - 300, 40, 10);
    cloud.y = Math.round(random(100, 220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.6;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 700;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(721, 478);
    obstacle.setCollider('circle', 0, 0, 45)
    // obstacle.debug = true
    obstacle.scale= 0.7;
    obstacle.velocityX = -(6 + 3 * score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 500;
    obstacle.depth = trex.depth;
    trex.depth += 1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  //trex.changeAnimation("running",trex_running);

  score = 0;

}
