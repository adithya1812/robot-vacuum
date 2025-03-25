class Node {
  constructor(x, y, parent = null) {
    this.x = x;
    this.y = y;
    this.g = 0; // Cost from start to this node
    this.h = 0; // Heuristic (estimated cost to the goal)
    this.f = 0; // Total cost (g + h)
    this.parent = parent; // Parent node for path reconstruction
  }
}