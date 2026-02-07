import { useState, useEffect } from 'react'
import './App.css'

function App() {
  
 const size = 50;

 //state for grid, holds the numbers in a 2D array
  const [grid, setGrid] = useState(
    Array.from({ length: size }, () => Array(size).fill(null))
  );

  //state for flash grid, holds the booleans for the flash effect, set to true when a particular cell is clicked
  //if grid[row][col] is true, the cell will flash yellow
  const [cellFlash, setCellFlash] = useState(() =>
    Array.from({ length: size }, () => Array(size).fill(false))
  );

  // const [fibonacciFlash, setFibonacciSequence] = useState([1, 1, 2, 3, 5]);

  // Runs every time grid changes (useful for debugging)
  //we will also use this for the fibonacci check later on
  useEffect(() => {
    console.log("Updated grid:", grid);
  }, [grid]);


  //function to handle cell click
  const handleCellClick = (rowIndex, colIndex) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      
      // Copy only the row we are changing (important!)
      newGrid[rowIndex] = [...newGrid[rowIndex]];

      //loop for increasing whole row
      for (let c = 0; c < size; c++) {
        newGrid[c] = [...newGrid[c]];
        newGrid[rowIndex][c] += 1;
      }

      //loop for increasing whole column
      for (let r = 0; r < size; r++) {
        newGrid[r] = [...newGrid[r]];
        newGrid[r][colIndex] += 1;
      }

      // decrease the clicked cell by 1 to counteract the update to the row and column
      newGrid[rowIndex][colIndex] -= 1;

      return newGrid;
    });

  setCellFlash((prevFlash) => {
      const newFlash = [...prevFlash];

      //loop for flashing rows
      for (let c = 0; c < size; c++) {
        newFlash[rowIndex][c] = true;
      }
      //loop for flashing columns
      for (let r = 0; r < size; r++) {
        newFlash[r] = [...newFlash[r]];
        newFlash[r][colIndex] = true;
      }

      return newFlash;
    });

    // Turn flash off after a short delay
    setTimeout(() => {
      setCellFlash((prevFlash) => {
        const newFlash = [...prevFlash];
          for (let c = 0; c < size; c++) {
        newFlash[rowIndex][c] = false;
      }
      for (let r = 0; r < size; r++) {
        // copy each row before changing its column value
        newFlash[r] = [...newFlash[r]];
        newFlash[r][colIndex] = false;
      }
        return newFlash;
      });
    }, 200);

  }

  //to reset board
  const resetBoard = () => {
    setGrid(Array.from({ length: size }, () => Array(size).fill(null)));
  }

  // const fibonacciClear = () => {
  //   //check for 5 consecutive numbers in the fibonacci sequence
  //   for (let i = 0; i < size; i++) {
  //     for (let j = 0; j < size; j++) {
  //       if (grid[i][j] === 1 && grid[i][j + 1] === 1 && grid[i][j + 2] === 2 && grid[i][j + 3] === 3 && grid[i][j + 4] === 5) {
  //         //clear the cells
  //         setGrid((prevGrid) => {
  //           const newGrid = [...prevGrid];
  //           newGrid[i][j] = null;
  //           newGrid[i][j + 1] = null;
  //           newGrid[i][j + 2] = null;
  //           newGrid[i][j + 3] = null;
  //           newGrid[i][j + 4] = null;
  //           return newGrid;
  //         });
  //       }
  //     }
  //   }
  // }

return (
  <div>
    <h2>Fibonacci Cells</h2>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 25px)`,
        gridTemplateRows: `repeat(${size}, 25px)`,
        gap: "2px",
      }}
    >
      {/*mapping the grid to the correct size, nested mapping for rows and columns*/}
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            style={{
              width: "35px",
              height: "35px",
              border: "2px solid #0c011398",
              cursor: "pointer",
              userSelect: "none",

              //flash effect
              backgroundColor: cellFlash[rowIndex][colIndex] ? "#f1d116ff" : "#a744e4ff",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "12px",
            }}
          >
            {cell}
          </div>
        ))
      )}
    </div>
<div style={{padding: "20px"}}>
    <button onClick={resetBoard}>Reset</button>
</div>

      {/* OPTIONAL: Display the grid array for debugging */}
      {/* <pre style={{ color: "white" }}>{JSON.stringify(grid, null, 2)}</pre> */}

  </div>
  );
}
export default App;
