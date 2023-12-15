// Get the ASCII container element from the document
const container = document.getElementById("asciiContainer");
// const container = document.querySelector("body");


// Define the characters used for ASCII shading
// const density = "Ñ@#W$9876543210?!abc;:+=-,._";
// Define the characters used for ASCII shading
const density = "Ñ@#W$9".split('')//  "█▓▓▒░ ".split('')

// Set the number of rows and columns for the ASCII grid
const rows = 200;
const cols = 200;

// Loop to initialize the ASCII grid with spans and line breaks
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    // Create a new span element for each ASCII character
    const span = document.createElement("span");
    // Append the span to the container
    container.appendChild(span);
  }
  // After each row, append a line break to start a new line
  container.appendChild(document.createElement("br"));
}

// Select all span elements in the container (representing each ASCII character)
const chars = container.querySelectorAll("span");

// Initialize a frame counter for animation
let frame = 0;

// Define the colors used for ASCII shading
// const colors = "Ñ@#W$9876543210?!abc;:+=-,._ ";
// Define the colors used for ASCII shading
const colors = [
  "rgb(0, 50, 0)",   // Dark Green
  "rgb(0, 100, 0)",  // Medium Dark Green
  "rgb(0, 150, 0)",  // Medium Green
  "rgb(0, 200, 0)",  // Medium Light Green
  "rgb(0, 255, 0)",  // Light Green
  "rgb(127, 255, 127)",  // Lighter Green
  "rgb(192, 255, 192)"  // Lightest Green
];
// Define the rule for the ant's behavior

// Define the rule for the ant's behavior
const rule = ['R1', 'R2', 'N', 'U', 'R2', 'R1', 'L2'];

// Initialize the ant's position and direction
let antDir = 4;

// Initialize game state with random values based on colors
let currentState = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => Math.floor(Math.random() * colors.length)));
// Initialize the ant's position
let antX = 50// Math.floor(cols / 2);
let antY = 50// Math.floor(rows / 2);

const colorDensityRatio = Math.floor(density.length/colors.length)
// Function to calculate new state and ant's direction based on current color and rule
function main(x, y, state) {
  const color = state[y][x];
  const turn = rule[color % rule.length];
  

  switch (turn) {
    case 'N': antDir = 0; break; // Up
    case 'R1': antDir = (antDir + 1) % 6; break;
    case 'R2': antDir = (antDir + 2) % 6; break;
    case 'U': antDir = (antDir + 3) % 6; break;
    case 'L2': antDir = (antDir + 4) % 6; break;
    case 'L1': antDir = (antDir + 5) % 6; break;
    case 'S': antDir = 6; break; // No movement
  }

  console.log("PRE", "antX", antX, "antY" , antY , "antDir", antDir, "rows", rows, "turn", turn, "color", color, "state", state[y][x])

  // Update the ant's position based on the new direction
  switch (antDir) {
    case 0: console.log("case 0"); break
    case 1: antX = (antX + 1) % cols; antY = (antY - 1 + rows) % rows; console.log("case 1"); break; // Up-Right
    case 2: antX = (antX + 1) % cols; console.log("case 2"); break; // Down-Right
    case 3: antY = (antY + 1) % rows; console.log("case 3"); break; // Down
    case 4: antX = (antX- 1 + cols) % cols; console.log("case 4"); break; // Down-Left
    // case 5: antX = (antX - 1 + cols) % cols; antY = (antY - 1 + rows) % rows; console.log("case 5"); break; // Up-Left
    case 5:antY = (antY - 1 + rows) % rows; console.log("case 6"); break; // Up
  }

  state[y][x] = (color + 1) % colors.length;
  console.log("POST", density[(colorDensityRatio*color) % density.length],  "antX", antX, "antY", antY, "color", color, "turn", turn, "antDir", antDir, "state", state[y][x])
  chars[antY * cols + antX].textContent = density[color] //density[(colorDensityRatio*color) % density.length]
  // chars[antY * cols + antX].style.backgroundColor =  colors[color];

  return colors[color];
}

// Function to count live neighbors for a cell
function countNeighbors(x, y, state) {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        count += state[ny][nx] ? 1 : 0;
      }
    }
  }
  return count;
}

// Function to update each frame of the animation
function updateFrame() {
  updateStats() // Update stats
  // updateMatrixDisplay() // Update matrix display

 // Initialize the next state of the game
 let nextState = currentState.map((row) => [...row]);


    currentState = nextState;

    main(antX, antY, currentState)
  // Increment the frame counter
  frame++;
  // Request the next frame of the animation
  requestAnimationFrame(updateFrame);
}
const timeEl = document.getElementById('time')
const fpsEl = document.getElementById('fps')
const frameEl = document.getElementById('frame')
const aliveEl = document.getElementById('alive')
const matrixEl = document.getElementById('matrix')

// Function to update stats
function updateStats() {
  // Calculate the number of alive cells
  let aliveCells = currentState.flat().filter(x => x).length;

  // Get the current time
  let currentTime = new Date().toLocaleTimeString();

  // Calculate FPS (frames per second)
  let fps = frame / ((Date.now() - startTime) / 1000);

  // Update the content of the respective elements
timeEl.textContent = `Time: ${currentTime}`;
fpsEl.textContent   = `FPS: ${fps.toFixed(2)}`;
frameEl.textContent = `Frame: ${frame}`;
aliveEl.textContent  = `Alive Cells: ${aliveCells}`;
}

// Function to update matrix display
function updateMatrixDisplay() {
  // Convert the matrix to a string
  let matrixString = currentState.map(row => row.map(cell => cell ? '1' : '0').join(' ')).join('\n');
  // Update the content of the matrix element
  matrixEl.textContent = matrixString;
}

// Initialize a start time for FPS calculation
let startTime = Date.now();

// Call the updateStats function whenever the game state changes
// For example, you might call it in your main game loop


// Start the animation
updateFrame();