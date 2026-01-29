# Storage Fragmentation Simulator

A visual, interactive educational tool built with React and Material UI that demonstrates how file system fragmentation occurs, its impact on storage, and how allocation strategies and defragmentation work.

![Pikachu](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png)

## 🚀 Features

-   **Interactive Block Map**: Visualize your storage drive as a grid of blocks. Watch files get split up (fragmented) in real-time.
-   **Allocation Strategies**: Experiment with different OS algorithms:
    -   **First Fit**: Fast but messy.
    -   **Best Fit**: Space-efficient but slower.
    -   **Random**: Chaos mode!
-   **Defragmentation**: Click "Defrag" to watch the simulator reorganize blocks into perfect contiguous order.
-   **Educational Notes**: A detailed "Help / Notes" section answering key questions about storage physics.
-   **Metrics**: Track fragmentation percentage, largest free block, and simulated access costs.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite
-   **UI Library**: Material UI (MUI), Bootstrap
-   **Language**: JavaScript React
-   **Analysis**: Custom algorithms for `Alloc` and `Defrag` logic.

## 🏃‍♂️ How to Run

1.  Clone the repository:
    ```bash
    git clone https://github.com/aadi761/fullstack-exp2.git
    cd fullstack-exp2
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📝 Concepts Covered

-   **Fragmentation**: Non-contiguous file storage.
-   **Seek Time**: The performance penalty of scattered data.
-   **Defragmentation**: Compaction and consolidation.
-   **File Systems**: How OSs manage free space.

---
*Created for Full Stack Experiment 2*
