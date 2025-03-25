class Robot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update() {
    if (!this.findNearestUncleanedSpot()) {
      fill(0);
      rect(width / 2 - 200, height / 2 - 150, 400, 300);
      fill("#FFE81F");
      textAlign(CENTER, CENTER);
      text(
        "All spots in the house have been cleaned, no reachable uncleaned spots left.",
        width / 2 - 190,
        height / 2 - 220,
        380,
        280
      );
      restart.style.display = "inline-block";
      restart.style.left = width / 2 - 100 + "px";
      restart.style.top = height / 2 + 25 + "px";
    }
    //if (millis() == round(millis())) {
    this.actX = this.x * gridSize;
    this.actY = this.y * gridSize;
    this.markCleaned();
    let nearestSpot = this.findNearestUncleanedSpot();
    if (nearestSpot != undefined) {
      this.setPath(nearestSpot); // Store path instead of teleporting
    }
    // }
    if (this.path && this.path.length > 0) {
      this.moveToNextSpot(); // Move step by step
    }
    visitedStack.push(createVector(this.x, this.y));
  }

  // Find the nearest uncleaned spot
  findNearestUncleanedSpot() {
  let minDistance = Infinity;
  let nearestSpot = null;
  let rdist;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!isCleaned(i, j) && isFree(i, j)) {
        let spot = createVector(i, j);
        if (unreachable.some((u) => u.x === spot.x && u.y === spot.y)) {
          continue; // Skip unreachable spots
        }

        // Check if a valid path exists before selecting the spot
        let testPath = this.findPathToSpot(spot);
        if (!testPath || testPath.length === 0) {
          continue; // Skip if there's no valid path
        }

        rdist = dist(this.x, this.y, i, j);
        if (rdist < minDistance) {
          minDistance = rdist;
          nearestSpot = spot;
        }
      }
    }
  }
  return nearestSpot;
}


  // Find the path to the target spot
  findPathToSpot(targetSpot) {
    if (targetSpot.x == this.x && targetSpot.y == this.y) {
      return null;
    }

    // 🚨 Check if the target is already marked as unreachable
    if (unreachable.some((u) => u.x === targetSpot.x && u.y === targetSpot.y)) {
      return null; // Stop trying to reach an already unreachable spot
    }

    let start = new Node(this.x, this.y);
    let goal = new Node(targetSpot.x, targetSpot.y);

    let openList = [];
    let closedList = [];
    let cameFrom = new Map(); // Store parent nodes

    start.g = 0;
    start.h = dist(this.x, this.y, goal.x, goal.y);
    start.f = start.g + start.h;

    openList.push(start);

    while (openList.length > 0) {
      // Get node with lowest f-score
      let currentIndex = 0;
      for (let i = 1; i < openList.length; i++) {
        if (openList[i].f < openList[currentIndex].f) {
          currentIndex = i;
        }
      }
      let current = openList.splice(currentIndex, 1)[0];

      // Check if goal reached
      if (current.x === goal.x && current.y === goal.y) {
        return this.reconstructPath(cameFrom, current);
      }

      closedList.push(current);

      // Get valid neighbors
      let neighbors = [
        new Node(current.x + 1, current.y),
        new Node(current.x - 1, current.y),
        new Node(current.x, current.y + 1),
        new Node(current.x, current.y - 1),
      ];

      for (let neighbor of neighbors) {
        if (
          !isFree(neighbor.x, neighbor.y) ||
          closedList.some((n) => n.x === neighbor.x && n.y === neighbor.y)
        ) {
          continue; // Ignore walls or already visited nodes
        }

        let tentativeG = current.g + 1;
        let existingNode = openList.find(
          (n) => n.x === neighbor.x && n.y === neighbor.y
        );

        if (!existingNode || tentativeG < existingNode.g) {
          cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
          neighbor.g = tentativeG;
          neighbor.h = dist(neighbor.x, neighbor.y, goal.x, goal.y);
          neighbor.f = neighbor.g + neighbor.h;

          if (!existingNode) {
            openList.push(neighbor);
          }
        }
      }
    }

    // 🚨 If no path is found, mark it as unreachable and find another spot
    unreachable.push(targetSpot);
    let nextSpot = this.findNearestUncleanedSpot();
    if (nextSpot) {
      return this.findPathToSpot(nextSpot); // Try another spot
    } else {
      return null;
    }
  }

  reconstructPath(cameFrom, current) {
    let path = [];
    while (cameFrom.has(`${current.x},${current.y}`)) {
      path.push(createVector(current.x, current.y));
      current = cameFrom.get(`${current.x},${current.y}`);
    }

    path.reverse(); // Ensure path is in correct order
    return path;
  }

  setPath(targetSpot) {
    let path = this.findPathToSpot(targetSpot); // Find path to target
    if (path != null && path.length > 0) {
      this.path = path; // Store the path
    } else {
      unreachable.push(targetSpot); // 🚀 Mark spot as unreachable
      let nextSpot = this.findNearestUncleanedSpot();
      if (nextSpot) {
        this.setPath(nextSpot); // Try another spot
      }
    }
  }

  // Move the robot to the next spot on the path
  moveToNextSpot() {
    if (this.path != null && this.path.length > 0) {
      let nextSpot = this.path.shift(); // Get next position
      if (nextSpot) {
        // Ensure it's not undefined
        this.x = nextSpot.x;
        this.y = nextSpot.y;
      }
    }
  }

  markCleaned() {
    let pos = createVector(this.x, this.y);
    if (!isCleaned(this.x, this.y)) {
      cleanedAreas.push(pos);
    }
  }

  show() {
    image(robotImg, this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  }
}
