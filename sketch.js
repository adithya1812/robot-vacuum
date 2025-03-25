let cols = 30;
let rows;
let gridSize;
let numWalls;
let walls = [];
let robot;
let visitedStack = [];
let cleanedAreas = [];
let unreachable = [];
let wall1, wall2, wall3, wall4, surrounded;
let robotImg, brickImg, dirtyImg;
let startScreen = true;
let slider, start;
let distAlr;

function isCleaned(x, y) {
  return cleanedAreas.some((area) => area.x === x && area.y === y);
}

function isFree(x, y) {
  return !walls.some((wall) => wall.x === x && wall.y === y);
}

function restartSketch() {
  window.location.reload();
}

function preload() {
  robotImg = loadImage("robot-vacuum.png");
  brickImg = loadImage("brick.jpeg");
  dirtyImg = loadImage("dirty-floor.jpeg");
  cleanImg = loadImage("clean-floor.jpeg");
  slider = document.getElementById("speed");
  start = document.getElementById("start");
  restart = document.getElementById("restart");
}

function setup() {
  if (windowWidth < 1000) {
    cols = 20
  }
  frameRate(floor(slider.value));
  gridSize = floor(windowWidth / cols);
  rows = floor(windowHeight / gridSize);
  numWalls = floor((rows / 3) + (cols / 3));
  createCanvas(windowWidth, windowHeight);
  robot = new Robot(1, 1);
  slider.style.left = width / 2 - 175 + "px";
  start.style.left = width / 2 - 100 + "px";

  // Generate random walls inside the grid
  for (let i = 0; i < numWalls; i++) {
    let x = floor(random(1, cols - 1));
    let y = floor(random(1, rows - 1));
    walls.push(createVector(x, y));
  }

  // Add screen borders as walls
  for (let i = 0; i < cols; i++) {
    walls.push(createVector(i, 0));
    walls.push(createVector(i, rows - 1));
  }
  for (let j = 0; j < rows; j++) {
    walls.push(createVector(0, j));
    walls.push(createVector(cols - 1, j));
  }
}

function draw() {
  if (startScreen == true) {
    textWrap(WORD);
    background("#778DA9");
    fill("#5E503F");
    textFont("Jersey 20 Charted");
    textSize(52);
    textAlign(CENTER);
    text("Robot Vacuum Simulator", 0, 25, width);
    fill("#E1E0DD");
    textFont("Roboto");
    textSize(24);
    text(
      `This is a simulation of how a robot vacuum would clean a house. Every time the simulation is run, a random floor plan of the house is generated, and the entirety of the housefloor is dirty. The robot vacuum will begin in one corner of the house and clean all the spots it is able to clean. Please choose the speed at which you would like your simulation to be, and press "Start" to begin the simulation`,
      15,
      100,
      width - 25
    );
    text(
      `Speed of simulation: ${floor((5 * slider.value) / 3)}`,
      width / 2,
      360
    );
    text("Slow", width / 2 - 210, 400);
    text("Fast", width / 2 + 210, 400);
  } else {
    background(dirtyImg);

    // Draw walls
    for (let wall of walls) {
      image(brickImg, wall.x * gridSize, wall.y * gridSize, gridSize, gridSize);
    }

    for (let area of cleanedAreas) {
      image(cleanImg, area.x * gridSize, area.y * gridSize, gridSize, gridSize);
    }
    isSurrounded();
    isCleaned(1, 2);
    isFree(1, 2);
    // Update robot and display it
    robot.show();
    robot.update();
  }

  function isSurrounded() {
    if (isCleaned(robot.x + 1, robot.y) || !isFree(robot.x + 1, robot.y)) {
      wall1 = true;
    } else {
      wall1 = false;
    }
    if (isCleaned(robot.x - 1, robot.y) || !isFree(robot.x - 1, robot.y)) {
      wall2 = true;
    } else {
      wall2 = false;
    }
    if (isCleaned(robot.x, robot.y + 1) || !isFree(robot.x, robot.y + 1)) {
      wall3 = true;
    } else {
      wall3 = false;
    }
    if (isCleaned(robot.x, robot.y - 1) || !isFree(robot.x, robot.y - 1)) {
      wall4 = true;
    } else {
      wall4 = false;
    }
    // Check all four directions: left, right, up, down
    if (wall1 && wall2 && wall3 && wall4) {
      surrounded = true;
    } else {
      surrounded = false;
    }
  }
}

function startSim() {
  setup();
  startScreen = false;
  slider.style.display = "none";
  start.style.display = "none";
}
