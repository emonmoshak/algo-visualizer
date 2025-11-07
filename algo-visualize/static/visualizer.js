// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Select DOM Elements ---
    const barContainer = document.getElementById("barContainer");
    const newArrayBtn = document.getElementById("newArrayBtn");
    const sortBtn = document.getElementById("sortBtn");
    const algoSelect = document.getElementById("algoSelect");

    // --- NEW: Select Sliders ---
    const speedSlider = document.getElementById("speedSlider");
    const barsSlider = document.getElementById("barsSlider");

    // Default array
    let mainArray = [];
    // Flag to prevent functions from running at the same time
    let isSorting = false;

    // --- 2. Generate Random Number ---
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // --- 3. Generate New Array ---
    // UPDATED: Now uses the barsSlider to get the number of bars
    function generateNewArray() {
        if (isSorting) {
            return;
        }

        // Get the number of bars from the slider's value
        const numBars = barsSlider.value;

        mainArray = [];
        for (let i = 0; i < numBars; i++) {
            mainArray.push(randomIntFromInterval(10, 400));
        }

        renderBars(mainArray);
    }

    // --- NEW: Helper function to get animation speed ---
    // We 'invert' the slider value so that a higher slider
    // value means a *faster* animation (less sleep time)
    function getAnimationSpeed() {
        // Max speed (100) = 10ms delay
        // Min speed (10)  = 100ms delay
        return 110 - speedSlider.value;
    }

    // --- 4. Render Bars ---
    function renderBars(array) {
        barContainer.innerHTML = "";

        // --- NEW: Calculate bar width based on number of bars ---
        // This makes the bars fill the container
        const barWidth = 100 / array.length;

        for (let i = 0; i < array.length; i++) {
            const bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.height = `${array[i]}px`;
            // Set the width based on our calculation
            bar.style.width = `${barWidth}%`;
            barContainer.appendChild(bar);
        }
    }

    function renderMergeSortBars(array, startIndex) {
        const bars = document.getElementsByClassName("bar");
        for (let i = 0; i < array.length; i++) {
            if (bars[startIndex + i]) {
                bars[startIndex + i].style.height = `${array[i]}px`;
                bars[startIndex + i].classList.add("bar-compare");
            }
        }
    }


    // --- 5. Event Listeners ---
    newArrayBtn.addEventListener("click", function() {
        generateNewArray();
    });

    // --- NEW: Add event listener for the bars slider ---
    // This generates a new array *as* you move the slider
    barsSlider.addEventListener("input", function() {
        generateNewArray();
    });

    sortBtn.addEventListener("click", async function() {
        if (isSorting) {
            return;
        }
        isSorting = true;
        disableControls();

        try {
            if (algoSelect.value === "bubble") {
                await bubbleSort(mainArray);
            }
            else if (algoSelect.value === "selection") {
                await selectionSort(mainArray);
            }
            else if (algoSelect.value === "merge") {
                mainArray = await mergeSort(mainArray, 0);
            }

            await markAllSorted();
        }
        catch (error) {
            console.error("An error occurred during sorting:", error);
        }
        finally {
            isSorting = false;
            enableControls();
        }
    });

    // --- 6. Initial Load ---
    generateNewArray();
    enableControls();

    // --- 7. Helper "Sleep" Function ---
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- 8. Control Disabling/Enabling Functions ---
    function disableControls() {
        sortBtn.disabled = true;
        newArrayBtn.disabled = true;
        algoSelect.disabled = true;
        // --- NEW: Disable sliders ---
        barsSlider.disabled = true;
        speedSlider.disabled = true;
    }

    function enableControls() {
        sortBtn.disabled = false;
        newArrayBtn.disabled = false;
        algoSelect.disabled = false;
        // --- NEW: Enable sliders ---
        barsSlider.disabled = false;
        speedSlider.disabled = false;
    }

    // --- 9. Mark All Sorted Function ---
    async function markAllSorted() {
        const bars = Array.from(document.getElementsByClassName("bar"));
        for (let i = 0; i < bars.length; i++) {
            if (bars[i]) {
                // Read speed from our new helper function
                await sleep(getAnimationSpeed() / 5); // Make green wave extra fast
                bars[i].classList.remove("bar-compare");
                bars[i].classList.add("bar-sorted");
            }
        }
    }

    // --- 10. Bubble Sort Algorithm ---
    async function bubbleSort(array) {
        const animationSpeed = getAnimationSpeed();
        const n = array.length;
        const bars = document.getElementsByClassName("bar");
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                if (!isSorting) return;
                bars[j].classList.add("bar-compare");
                bars[j + 1].classList.add("bar-compare");
                await sleep(animationSpeed);
                if (array[j] > array[j + 1]) {
                    swapped = true;
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    bars[j].style.height = `${array[j]}px`;
                    bars[j + 1].style.height = `${array[j + 1]}px`;
                }
                bars[j].classList.remove("bar-compare");
                bars[j + 1].classList.remove("bar-compare");
            }
            if (bars[n - i - 1]) bars[n - i - 1].classList.add("bar-sorted");
            if (!swapped) break;
        }
        // Mark any remaining
        for (let i = 0; i < n; i++) {
            if (bars[i] && !bars[i].classList.contains("bar-sorted")) {
                bars[i].classList.add("bar-sorted");
            }
        }
    }

    // --- 11. Selection Sort Algorithm ---
    async function selectionSort(array) {
        const animationSpeed = getAnimationSpeed();
        const n = array.length;
        const bars = document.getElementsByClassName("bar");
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            if (bars[minIndex]) bars[minIndex].classList.add("bar-compare");
            for (let j = i + 1; j < n; j++) {
                if (!isSorting) return;
                if (bars[j]) bars[j].classList.add("bar-compare");
                await sleep(animationSpeed);
                if (array[j] < array[minIndex]) {
                    if (bars[minIndex]) bars[minIndex].classList.remove("bar-compare");
                    minIndex = j;
                    if (bars[minIndex]) bars[minIndex].classList.add("bar-compare");
                } else {
                    if (bars[j]) bars[j].classList.remove("bar-compare");
                }
            }
            if (bars[minIndex]) bars[minIndex].classList.remove("bar-compare");
            if (minIndex !== i) {
                [array[i], array[minIndex]] = [array[minIndex], array[i]];
                if (bars[i]) bars[i].style.height = `${array[i]}px`;
                if (bars[minIndex]) bars[minIndex].style.height = `${array[minIndex]}px`;
            }
            if (bars[i]) bars[i].classList.add("bar-sorted");
        }
        if (bars[n - 1]) bars[n - 1].classList.add("bar-sorted");
    }

    // --- 12. Merge Sort Algorithm ---
    async function mergeSort(array, startIndex) {
        if (!isSorting) return array;
        const n = array.length;
        if (n <= 1) return array;
        const mid = Math.floor(n / 2);
        const leftArray = array.slice(0, mid);
        const rightArray = array.slice(mid);
        const sortedLeft = await mergeSort(leftArray, startIndex);
        const sortedRight = await mergeSort(rightArray, startIndex + mid);
        return await merge(sortedLeft, sortedRight, startIndex);
    }

    // --- 13. Merge Helper Function ---
    async function merge(leftArray, rightArray, startIndex) {
        if (!isSorting) return [];
        const animationSpeed = getAnimationSpeed();
        const sortedArray = [];
        let leftIndex = 0;
        let rightIndex = 0;
        while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
            if (leftArray[leftIndex] < rightArray[rightIndex]) {
                sortedArray.push(leftArray[leftIndex++]);
            } else {
                sortedArray.push(rightArray[rightIndex++]);
            }
        }
        while (leftIndex < leftArray.length) {
            sortedArray.push(leftArray[leftIndex++]);
        }
        while (rightIndex < rightArray.length) {
            sortedArray.push(rightArray[rightIndex++]);
        }
        await sleep(animationSpeed);
        renderMergeSortBars(sortedArray, startIndex);
        await sleep(animationSpeed * 2);

        const bars = document.getElementsByClassName("bar");
        for (let i = 0; i < sortedArray.length; i++) {
            if (bars[startIndex + i]) {
                bars[startIndex + i].classList.remove("bar-compare");
            }
        }
        return sortedArray;
    }

});
