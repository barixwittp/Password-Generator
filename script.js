const inputSlider = document.querySelector("[data-length_slider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passworddisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#Uppercase");
const lowercaseCheck = document.querySelector("#Lowercase");
const numberCheck = document.querySelector("#Numbers");
const symbolCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate_button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const stringg = `# $ % & * + - / : ; < = > ? @ ^ _ | ~ \` ! " ' ( ) [ ] < © ® ™ € £ ¥ ₹ ¢ ° µ § ¶ † ‡ • · • ¤ ₩ ₱ ÷ × ¶ → ← ↑ ↓ ↔ ↕ ↵ ⇐ ⇑ ⇒ ⇓ ⇔ ⇕ ∞ ∑ ∆ ∇ ∫ ∴ ∵ ∂ ∅ ∇ ∞ ≠ ≈ ≡ ≤ ≥ ± √ ∝ ∞ ∞ ′ ‵ • ‣ ⁂ ⁎ ⁑ ⁖ ⁗ ⁅ ⁆ ⌂ ⌐ ⌠ ⌡ ⌢ ⌣ ⌦ ⌧ ⌫ ♠ ♣ ♥ ♦ ♭ ♯ ♪ ♫ ♬ « » ′ ″ ‴ ‽ ‾ ‿ ‛ ‟`;

let password = "";
let passwordLength = 10;  // Default password length
let checkCount = 0;  // Initialized checkbox count
setIndicator("#ccc")

handleSlider();  // Initialize the slider display

// Function to update the slider and display the password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"
}

// Set the strength indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 20px${color}`;
}


// Random integer generator between min and max (inclusive)
function getRandInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random number
function getRandomNumber(){
    return getRandInt(0, 9);
}

// Generate random lowercase letter
function generateLowerCase(){
    return String.fromCharCode(getRandInt(97, 122));  // 97 to 122 for lowercase a-z
}

// Generate random uppercase letter
function generateUpperCase(){
    return String.fromCharCode(getRandInt(65, 90));  // 65 to 90 for uppercase A-Z
}

// Generate random symbol from the stringg
function generateSymbol(){
    const randIndex = getRandInt(0, stringg.length - 1);
    return stringg.charAt(randIndex);
}

// Function to calculate password strength based on length and checkbox selections
function calcStrength(){
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numberCheck.checked;
    let hasSym = symbolCheck.checked;

    // Set strength based on conditions
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");  // Green for strong
    } else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");  // Yellow for medium
    } else {
        setIndicator("#f00");  // Red for weak
    }
}

// Function to copy the password to the clipboard
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    }
    catch{
        copyMsg.innerText = "Failed to copy!";
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Handle checkbox changes and adjust password length
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // If the password length is less than the number of selected options, adjust the length
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

// Attach event listeners to all checkboxes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// Slider event listener for adjusting password length
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// Event listener for the copy button
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

// Fisher-Yates shuffle algorithm for shuffling the generated password
function shufflePassword(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array.join('');
}

// Event listener for generating the password when the button is clicked
generateBtn.addEventListener('click', () => {

    // Ensure at least one checkbox is selected
    if (checkCount <= 0) {
        return;
    }

    // Adjust password length if needed
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Clear the old password
    password = "";

    // Create an array of functions based on selected checkboxes
    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numberCheck.checked) {
        funcArr.push(getRandomNumber);
    }
    if (symbolCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // Generate at least one character from each selected checkbox option
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Generate remaining characters randomly based on selected options
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randFuncIndex = getRandInt(0, funcArr.length - 1);
        password += funcArr[randFuncIndex]();
    }

    // Shuffle the generated password
    password = shufflePassword(password.split(''));

    // Display the generated password in the UI
    passwordDisplay.value = password;

    // Calculate and display the password strength
    calcStrength();
});
