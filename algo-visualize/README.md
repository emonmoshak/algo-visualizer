# AlgoVisualizer
#### Video Demo:  https://youtu.be/-Tt-gVdcj2E
#### Description:

"AlgoVisualizer" is a web-based application designed to bring sorting algorithms to life. As a student in CS50, I was fascinated by the concepts of algorithm efficiency in Week 3, but I found it difficult to truly see the difference between how algorithms like Bubble Sort and Merge Sort actually work. Reading pseudocode or seeing a static diagram is one thing, but watching the process unfold in real-time provides a much deeper level of understanding.

This project solves that problem. It's an interactive tool that allows users to select a sorting algorithm (from Bubble Sort, Selection Sort, and Merge Sort), generate a random array of bars, and watch the algorithm sort that array live in their browser.

The user has full control over the visualization. They can:
* **Generate a New Array:** Create a new, randomized set of bars.
* **Select an Algorithm:** Choose which sorting algorithm to visualize.
* **Control the Bar Count:** Use a slider to select a small array (e.g., 10 bars) to see precise steps, or a large array (e.g., 100 bars) to see the "big picture" performance.
* **Control the Speed:** Use a speed slider to make the animation faster or slower, allowing for careful study of each comparison and swap.

This project was built from the ground up, drawing heavily on the lessons from CS50, particularly Week 6 (Python/Flask), Week 7 (SQL, though SQL was not needed here), and Week 8 (HTML, CSS, JavaScript).

---

## Design and Implementation

The project is a **Flask** application, which serves as the simple backend, but the true "brain" of the operation is the **JavaScript** frontend.

### Tech Stack
* **Backend:** Python (Flask)
* **Frontend:** HTML5, CSS3, and modern JavaScript (ES6+)
* **Styling:** The UI was heavily polished to mimic a modern, clean "Shadcn-UI" look, using custom CSS properties, a clean color palette, and custom-built components like the dropdown menu.

### File Structure

* `app.py`: This is the Flask server. Its sole purpose is to configure the application, ensure templates are auto-reloaded, and serve the main `index.html` file when a user visits the root URL (`/`).
* `templates/index.html`: This file provides the skeleton and structure of the entire application. It contains the header, the control panel (with all buttons, sliders, and the custom-built dropdown), and the main `#barContainer` where the bars are rendered.
* `static/styles.css`: This file contains all the styling. It's written from scratch to be clean, responsive, and modern. It handles the "Shadcn-like" styling for all components, including the primary/secondary buttons, the custom-styled sliders, and the polished dropdown menu that replaces the default browser `<select>`. It also defines the all-important classes (`.bar-compare`, `.bar-sorted`) that color the bars during the animation.
* `static/visualizer.js`: This is the most complex and important file in the project. It handles all the application's logic.

### Key Features in `visualizer.js`

#### 1. The Asynchronous Animation Challenge
The biggest design challenge was figuring out how to animate the sorts. A simple `for` loop in JavaScript runs to completion almost instantly, which is useless for a visualization. The solution was to leverage **asynchronous JavaScript**.

* **`async`/`await`:** Every sorting function (`bubbleSort`, `selectionSort`, `mergeSort`) was declared as an `async` function.
* **`sleep()` Helper:** A small helper function `function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }` was created.
* **The Pause:** By placing `await sleep(animationSpeed);` inside the sorting loops (e.g., after a comparison or a swap), I force the algorithm to pause execution. This gives the browser just enough time to re-render the changes to the bars' `height` or `background-color`, creating the illusion of a smooth animation. The speed is dynamically pulled from the "Speed" slider.

#### 2. Custom Dropdown Menu
To achieve the polished UI, the standard `<select>` element was hidden. A custom dropdown was built using a `<button>` (to show the selected value) and a hidden `<div>` (for the options). JavaScript handles the logic for opening/closing the menu, updating the button's text, and setting the value of the *real*, hidden `<select>` element, which is still used to store the state.

#### 3. State Management
To prevent the user from breaking the application, a simple state flag, `isSorting`, was implemented.
* When the "Sort!" button is clicked, `isSorting` is set to `true`, and all controls (buttons, sliders) are disabled.
* A `try...finally` block is wrapped around the entire sorting process.
* No matter what happens (even if an error occurs), the `finally` block runs, setting `isSorting` back to `false` and re-enabling all the controls. This makes the application robust and prevents the user from generating a new array while a sort is still running.

#### 4. Visualizing Merge Sort
Bubble Sort and Selection Sort were "in-place" algorithms, meaning I could modify the main array and swap the heights of the bars directly. Merge Sort, however, is not in-place. It works by creating new, smaller arrays.

The solution was to use a recursive `mergeSort` function that returns a new sorted array. The visualization part happens in the `merge` helper function. As it builds a `sortedArray`, it calls a special `renderMergeSortBars` function that updates the heights of the *original* bars in the DOM, starting at the correct `startIndex`. This correctly visualizes the "merge" part of the algorithm as it sweeps from left to right.
