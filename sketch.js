// 1. Make the initial cell the current cell and mark it as visited
// 2. While there are unvisited cells
//   1. If the current cell has any neighbours which have not been visited
//     1. Choose randomly one of the unvisited neighbours
//     2. Push the current cell to the stack
//     3. Remove the wall between the current cell and the chosen cell
//     4. Make the chosen cell the current cell and mark it as visited
//   2. Else if stack is not empty
//     1. Pop a cell from the stack
//     2. Make it the current cell|

let cols, rows;
let w = 15;
let grid = [];
let current, start, end;
let stack = [];

function setup() {
  // frameRate(5);
  createCanvas(600, 300);
  cols = floor(width / w);
  rows = floor(height / w);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[340];
  start = current;
}

function draw() {
  // background(51);
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  current.visited = true;
  current.highlight();
  let next = current.checkNeighbors();
  if (next) {
    stack.push(current);
    current.inStack = true;
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
    current.inStack = false;
  } else {
    end = current;
  }
}

function removeWalls(current, next) {
  let x = current.i - next.i;
  if (x === 1) {
    current.walls.left = false;
    next.walls.right = false;
  } else if (x === -1) {
    current.walls.right = false;
    next.walls.left = false;
  }

  let y = current.j - next.j;
  if (y === 1) {
    current.walls.top = false;
    next.walls.bottom = false;
  } else if (y === -1) {
    next.walls.top = false;
    current.walls.bottom = false;
  }
}

function Cell(i, j) {
  this.i = i; // colNum
  this.j = j; // rowNum
  this.walls = {
    top: true,
    right: true,
    bottom: true,
    left: true,
  };
  this.visited = false;
  this.inStack = false;

  this.show = function () {
    let x = this.i * w;
    let y = this.j * w;
    // console.log("cell coordinates:", x, y);

    strokeWeight(3);
    stroke(0);

    if (this.walls.top) line(x, y, x + w, y);
    if (this.walls.right) line(x + w, y, x + w, y + w);
    if (this.walls.bottom) line(x + w, y + w, x, y + w);
    if (this.walls.left) line(x, y + w, x, y);

    if (this.visited) {
      noStroke();
      fill(0, 0, 255, 80);
      rect(x, y, w, w);
    }

    if (this.inStack) {
      noStroke();
      fill(255, 0, 255, 80);
      rect(x, y, w, w);
    }
  };

  this.highlight = function () {
    let x = this.i * w;
    let y = this.j * w;

    noStroke();
    fill(0, 255, 0, 200);
    rect(x, y, w, w);
  };

  this.checkNeighbors = function () {
    let neighbors = [];
    const top = grid[index(i, j - 1)];
    const right = grid[index(i + 1, j)];
    const bottom = grid[index(i, j + 1)];
    const left = grid[index(i - 1, j)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      const r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  };
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}
