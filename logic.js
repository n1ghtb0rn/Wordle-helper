let words = [];

let yellowAtCorrectSpot = false;

const WORD_LENGTH = 5;

let grayLetters = [];
let greenLetters = ["", "", "", "", ""];
let yellowLetters = ["", "", "", "", ""];

//User input
let greenInputs = [];
let yellowInputs = [];
let grayInputs = [];

const initiate = () => {

    let greenLettersDiv = document.getElementById("green-letters");

    for (let i = 0; i < 5; i++) {
        let greenInput = document.createElement("input");
        greenInput.setAttribute("type", "text");
        greenInput.style.width = "30px";
        greenInput.style.height = "30px";
        greenInput.style.textAlign = "center";
        greenInput.style.fontFamily = "Arial";
        greenInput.style.fontWeight = "bold";
        greenInput.style.fontSize = "20px";
        greenInput.style.margin = "5px";
        greenInput.style.borderRadius = "10px";

        greenInput.setAttribute("value", "");
        

        greenInput.addEventListener("input", (event) => {

            if (event.data) {
                greenInput.value = event.data[0].toUpperCase();
            }

        });

        greenLettersDiv.appendChild(greenInput);
        greenInputs.push(greenInput);
    }

    let yellowLettersDiv = document.getElementById("yellow-letters");

    for (let i = 0; i < 5; i++) {
        let yellowInput = document.createElement("input");
        yellowInput.setAttribute("type", "text");
        yellowInput.style.width = "30px";
        yellowInput.style.height = "30px";
        yellowInput.style.textAlign = "center";
        yellowInput.style.fontFamily = "Arial";
        yellowInput.style.fontWeight = "bold";
        yellowInput.style.fontSize = "20px";
        yellowInput.style.margin = "5px";
        yellowInput.style.borderRadius = "10px";

        yellowInput.setAttribute("value", "");
        

        yellowInput.addEventListener("input", (event) => {

            if (event.data) {
                yellowInput.value = event.data[0].toUpperCase();
            }

        });

        yellowLettersDiv.appendChild(yellowInput);
        yellowInputs.push(yellowInput);
    }

    let grayLettersDiv = document.getElementById("gray-letters");

    const grayBoxes = 30;

    let count = 0;
    for (let i = 0; i < grayBoxes; i++) {
        let grayInput = document.createElement("input");
        grayInput.setAttribute("type", "text");
        grayInput.style.width = "30px";
        grayInput.style.height = "30px";
        grayInput.style.textAlign = "center";
        grayInput.style.fontFamily = "Arial";
        grayInput.style.fontWeight = "bold";
        grayInput.style.fontSize = "20px";
        grayInput.style.margin = "5px";
        grayInput.style.borderRadius = "10px";

        grayInput.setAttribute("value", "");
        

        grayInput.addEventListener("input", (event) => {

            if (event.data) {
                grayInput.value = event.data[0].toUpperCase();
            }

        });

        grayLettersDiv.appendChild(grayInput);
        grayInputs.push(grayInput);

        const grayBoxesPerRow = 10;

        count++;
        if (count >= grayBoxesPerRow) {
            let br = document.createElement("br");
            grayLettersDiv.append(br);
            count = 0;
        }
    }

    let file = document.getElementById("readfile");
    file.addEventListener("change", function () {
        var reader = new FileReader();
        reader.onload = function (progressEvent) {
            
            //console.log(this.result);
            words = this.result.split(/\n/);
            document.getElementById("ready-button").style.visibility = "visible";
            
        };
        reader.readAsText(this.files[0]);


    });
};

const ready = () => {

    for (let i = 0; i < 5; i++) {
        greenLetters[i] = greenInputs[i].value.toLowerCase();
        yellowLetters[i] = yellowInputs[i].value.toLowerCase();
    }

    for (let i = 0; i < grayInputs.length; i++) {
        if (grayInputs[i].value != "") {
            grayLetters.push(grayInputs[i].value.toLowerCase());
        }
    }

    let wordsDiv = document.getElementById("words");
    wordsDiv.innerHTML = "";

    let check1 = document.getElementById("check1");
    yellowAtCorrectSpot = check1.checked;

    //First filter - Gray letters
    let grayFilter = getGrayFilter();

    //Second filter - Green letters
    let greenFilter = getGreenFilter(grayFilter);

    //Third filter
    let yellowFilter = getYellowFilterUnsorted(greenFilter);

    //Fourth filter (if yellow letters are at correct spot)
    if (yellowAtCorrectSpot) {
        yellowFilter = getYellowFilterSorted(yellowFilter);
    }

    const WORDS_PER_LINE = 5;

    let count = 0;

    let rowDiv;



    for (let word of yellowFilter) {

        if (count == 0) {
            rowDiv = document.createElement("div");
            rowDiv.style.display = "flex";
            rowDiv.style.flexDirection = "row";
            wordsDiv.appendChild(rowDiv);
        }

        let p = document.createElement("p");
        p.innerHTML = word.toUpperCase();
        p.style.fontSize = "20px";
        p.style.fontWeight = "bold";
        p.style.fontFamily = "Arial";
        p.style.margin = "10px";
        p.style.borderStyle = "solid";
        p.style.borderWidth = "1px";
        p.style.borderRadius = "10px";
        p.style.padding = "5px";
        p.style.width = "80px";
        p.style.textAlign = "center";
        rowDiv.appendChild(p);

        count++;
        if (count >= WORDS_PER_LINE) {
            count = 0;
        }
    }

};

const getGrayFilter = () => {

    let grayFilter = [];

    for (let currentWord of words) {

        let wordValid = true;

        for (let i = 0; i < grayLetters.length; i++) {
            let grayLetter = grayLetters[i];
            if (currentWord.includes(grayLetter)) {
                wordValid = false;
                break; //break the inner loop
            }
        }

        if (wordValid) {
            grayFilter.push(currentWord);
        }
    }

    return grayFilter;
};

const getGreenFilter = (grayFilter) => {

    let greenFilter = [];

    for (let currentWord of grayFilter) {

        let greenMatches = true;

        let count = 0;
        for (let i = 0; i < WORD_LENGTH; i++) {
            
            if (greenLetters[i] == "") {
                count++;
                continue;
            }

            if (greenLetters[i] != currentWord[i]) {
                greenMatches = false;
            }
            
        }

        if (greenMatches || count == 5) {
            greenFilter.push(currentWord);
        }

    }

    return greenFilter;
};

class YellowLetter {
    constructor(char, count) {
        this.char = char;
        this.count = count;
    }
}

const getYellowFilterUnsorted = (greenFilter) => {

    let yellowFilter = [];

    let checkedLetters = [];
    let yellowLettersObjects = [];

    for (let i = 0; i < yellowLetters.length; i++) {

        let currentChar = yellowLetters[i];

        if (currentChar == "") {
            continue;
        }

        if (checkedLetters.includes(currentChar)) {
            continue;
        }
        else {
            checkedLetters.push(currentChar);
        }
        
        let letterCount = 1;

        for (let j = 0; j < yellowLetters.length; j++) {

            let otherChar = yellowLetters[j];

            if (i == j || otherChar == "") {
                continue;
            }

            if (currentChar == otherChar) {
                letterCount++;
            }

        }

        let yellowLetterObj = new YellowLetter(currentChar, letterCount);
        yellowLettersObjects.push(yellowLetterObj);

    }

    for (let word of greenFilter) {

        let validWord = true;
        
        for (let yellowObj of yellowLettersObjects) {

            let split = word.split(yellowObj.char);
            if (split.length-1 != yellowObj.count) {
                validWord = false;

                break;
            }

        }

        if (validWord) {
            yellowFilter.push(word);
        }


    }

    return yellowFilter;
};

const getYellowFilterSorted = (oldArray) => {

    let yellowFilter = [];

    for (let word of oldArray) {

        let wordValid = true;

        for (let i = 0; i < word.length; i++) {

            let currentChar = yellowLetters[i];

            if (currentChar == "") {
                continue;
            }

            if (word[i] == currentChar ) {
                wordValid = false;
                break;
            }

        }

        if (wordValid) {
            yellowFilter.push(word);
        }

    }

    return yellowFilter;

};

