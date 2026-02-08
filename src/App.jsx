import { useState, useEffect } from 'react'
import './App.css'

function App() {
  
 const size = 50;

 //state for grid, holds the numbers in a 2D array
  const [grid, setGrid] = useState(
    Array.from({ length: size }, () => Array(size).fill(null))
  );

  //state for flash grid, holds the flash type for each cell
  //possible values: null (no flash), 'click' (yellow flash), 'fibonacci' (green flash)
  const [flashType, setFlashType] = useState(() =>
    Array.from({ length: size }, () => Array(size).fill(null))
  );



  // Helper function to check if 5 consecutive numbers form a Fibonacci sequence
  const isFibonacciSequence = (nums) => {
    // Check if we have exactly 5 numbers and none are null
    if (nums.length !== 5 || nums.some(n => n === null)) {
      return false;
    }
    
    // Check if each number is the sum of the previous two
    for (let i = 2; i < 5; i++) {
      if (nums[i] !== nums[i-1] + nums[i-2]) {
        return false;
      }
    }
    
    return true;
  };

  // revise for better performance
  // Function to find all Fibonacci sequences in the grid
  const findFibonacciSequences = () => {
    const sequences = [];
    
    // Check all rows (left to right)
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - 5; col++) {
        const nums = grid[row].slice(col, col + 5);
        if (isFibonacciSequence(nums)) {
          sequences.push({
            type: 'row',
            row,
            startCol: col,
            cells: Array.from({ length: 5 }, (_, i) => ({ row, col: col + i }))
          });
        }
      }
    }
    
    // Check all columns (top to bottom)
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - 5; row++) {
        const nums = [];
        for (let i = 0; i < 5; i++) {
          nums.push(grid[row + i][col]);
        }
        if (isFibonacciSequence(nums)) {
          sequences.push({
            type: 'column',
            col,
            startRow: row,
            cells: Array.from({ length: 5 }, (_, i) => ({ row: row + i, col }))
          });
        }
      }
    }
    
    // Check all diagonals (top-left to bottom-right)
    for (let row = 0; row <= size - 5; row++) {
      for (let col = 0; col <= size - 5; col++) {
        const nums = [];
        for (let i = 0; i < 5; i++) {
          nums.push(grid[row + i][col + i]);
        }
        if (isFibonacciSequence(nums)) {
          sequences.push({
            type: 'diagonal-right',
            startRow: row,
            startCol: col,
            cells: Array.from({ length: 5 }, (_, i) => ({ row: row + i, col: col + i }))
          });
        }
      }
    }
    
    // Check all diagonals (top-right to bottom-left)
    for (let row = 0; row <= size - 5; row++) {
      for (let col = 4; col < size; col++) {
        const nums = [];
        for (let i = 0; i < 5; i++) {
          nums.push(grid[row + i][col - i]);
        }
        if (isFibonacciSequence(nums)) {
          sequences.push({
            type: 'diagonal-left',
            startRow: row,
            startCol: col,
            cells: Array.from({ length: 5 }, (_, i) => ({ row: row + i, col: col - i }))
          });
        }
      }
    }
    
    return sequences;
  };

  // Automatically detect Fibonacci sequences whenever grid changes
  useEffect(() => {
    // console.log("Updated grid");
    
    // Find all Fibonacci sequences in the grid
    const sequences = findFibonacciSequences();
    
    if (sequences.length > 0) {
      console.log(`Found ${sequences.length} Fibonacci sequence(s)!`, sequences);
      
      // GREEN flash
      setFlashType((prevFlash) => {
        const newFlash = prevFlash.map(row => [...row]);
        
        sequences.forEach(seq => {
          seq.cells.forEach(({ row, col }) => {
            newFlash[row][col] = 'fibonacci';
          });
        });
        
        return newFlash;
      });
      
      // Clear the flash and reset cells to null after a delay
      setTimeout(() => {
        setFlashType((prevFlash) => {
          const newFlash = prevFlash.map(row => [...row]);
          
          sequences.forEach(seq => {
            seq.cells.forEach(({ row, col }) => {
              newFlash[row][col] = null;
            });
          });
          
          return newFlash;
        });
        
        // Clear the grid cells to null
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map(row => [...row]);
          
          sequences.forEach(seq => {
            seq.cells.forEach(({ row, col }) => {
              newGrid[row][col] = null;
            });
          });
          
          return newGrid;
        });
      }, 500);
    }
  }, [grid]); // Run whenever grid changes



  //Click Interaction Handler
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

    // YELLOW Flash
  setFlashType((prevFlash) => {
      const newFlash = [...prevFlash];

      //loop for flashing rows
      for (let c = 0; c < size; c++) {
        newFlash[rowIndex] = [...newFlash[rowIndex]];
        newFlash[rowIndex][c] = 'click';
      }
      //loop for flashing columns
      for (let r = 0; r < size; r++) {
        newFlash[r] = [...newFlash[r]];
        newFlash[r][colIndex] = 'click';
      }

      return newFlash;
    });

    // Turn flash off after a short delay
    setTimeout(() => {
      setFlashType((prevFlash) => {
        const newFlash = [...prevFlash];
          for (let c = 0; c < size; c++) {
        newFlash[rowIndex] = [...newFlash[rowIndex]];
        newFlash[rowIndex][c] = null;
      }
      for (let r = 0; r < size; r++) {
        // copy each row before changing its column value
        newFlash[r] = [...newFlash[r]];
        newFlash[r][colIndex] = null;
      }
        return newFlash;
      });
    }, 200);

  }

  //to reset board
  const resetBoard = () => {
    setGrid(Array.from({ length: size }, () => Array(size).fill(null)));
  }


return (
  <div>
    <h2 onClick={resetBoard} style={{fontSize: "30px", cursor: "pointer"}}>Fibonacci Cells</h2>
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

              //dynamic background color based on flash type
              backgroundColor: 
                flashType[rowIndex][colIndex] === 'click' ? "#f1d116ff" : // yellow for click
                flashType[rowIndex][colIndex] === 'fibonacci' ? "#1fb31fff" : // green for fibonacci
                "#a744e4ff", // purple default

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
<div style={{padding: "25px", fontSize: "25px"}}>
    <button onClick={resetBoard}>Reset</button>
</div>
  </div>
  );
}
export default App;
