
class App {
  constructor() {
    const shuffle = document.querySelector('#shuffle');
    const letter1 = document.querySelector('#letter1');
    const letter2 = document.querySelector('#letter2');
    const letter3 = document.querySelector('#letter3');
    const letter4 = document.querySelector('#letter4');
    const letter5 = document.querySelector('#letter5');
    const letter6 = document.querySelector('#letter6');
    const letter7 = document.querySelector('#letter7');

    const count1 = document.querySelector('#count1');
    const count2 = document.querySelector('#count2');
    const count3 = document.querySelector('#count3');
    const count4 = document.querySelector('#count4');
    const count5 = document.querySelector('#count5');
    const count6 = document.querySelector('#count6');
    const count7 = document.querySelector('#count7');
    const score = document.querySelector("#score");

    const sound = document.getElementById('button-sound');
    const enter = document.getElementById('enter-sound');
    const audioPlayer = document.getElementById('audioPlayer');

    let scoreVal = 0;

    const letters = [letter1, letter2, letter3, letter4, letter5, letter6, letter7];
    const counts = [count1, count2, count3, count4, count5, count6, count7];
    let tileArr=[];

    let playmode=true;

    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
    const alphabet = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ];

    const scrabbleScores = {
      a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5, l: 1, 
      m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4, w: 4, x: 8, 
      y: 4, z: 10
    };
    // Scrabble letter distribution (frequency of each letter in the set)
    const scrabbleTiles = {
      a: 9, b: 2, c: 2, d: 4, e: 12, f: 2, g: 3, h: 2, i: 9, j: 1,
      k: 1, l: 4, m: 2, n: 6, o: 8, p: 2, q: 1, r: 6, s: 4, t: 6,
      u: 4, v: 2, w: 2, x: 1, y: 2, z: 1
    };


    const inputs = document.querySelectorAll('.input-box');


    inputs.forEach((input, index) => {
      // Handle input for each field (focus on the next input when a character is entered)
      input.addEventListener('input', () => {
        if(playmode==true){
          audioPlayer.play();
        }
        if (input.value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      // Handle Enter key event for collecting the values
      input.addEventListener('keydown', (event) => {
        if(playmode==true){
        // Check if Enter key was pressed
        if (event.key === "Enter") {
          const inputValues = [];

          // Collect values from all input boxes
          inputs.forEach(input => {
            inputValues.push(input.value);
          });

          // Removing blank spaces from the array.
          const cleanInput = inputValues.filter(item => item);
          const inputlength=cleanInput.length;
          let bonus=false;
          if(inputlength>=4)
          {
            bonus=true;
          }else{
            bonus=false;
          }

          //console.log(bonus);
          
          // Making word from array.
          const wordFormed = cleanInput.join('');

          inputs.forEach(input => input.value = '');
          // Move the focus back to the first input box after submission
          inputs[0].focus();
          //console.log(tileArr);
          
          enter.play();
          // Assuming valid_words.json is in the same directory
        fetch('dictionary.json')
        .then(response => response.json())
        .then(data => {
        const validWords = data;
        const validWordsSet = new Set(validWords);

        function isValidWord(word) {
            return validWordsSet.has(word.toLowerCase());
        }

        if (matchArrays(cleanInput,tileArr)){ 
            if(isValidWord(wordFormed))
              {
            let currCount=arrayCount(cleanInput);
            if(bonus==true){
              let bonuscount=currCount*2;
              scoreVal+=bonuscount;
              score.textContent = `${scoreVal}`;
              showBonusAttained();
              getRandomTiles();
            }else if(bonus==false){
              scoreVal+=currCount;
              //console.log(scoreVal);
              score.textContent = `${scoreVal}`;
              getRandomTiles();
            }
            }
            else{
              console.log("Word doesn't exist.")
            }
          }else{
            console.log("word doesn't match.")
          }
        // Example usage
        // const testWord = 'cat';
        // if (isValidWord(testWord)) {
        //     console.log(`${testWord} is a valid word!`);
        // } else {
        //     console.log(`${testWord} is not a valid word.`);
        // }
        })
        .catch(error => console.log('Error:', error));
          // test if the tileArr and input
 
        }
        }
        // Handle Backspace key event for deleting values
        if (event.key === "Backspace") {
          if (input.value === "") {
            // Move focus to the previous input if the current one is empty
            if (index > 0) {
              inputs[index - 1].focus();
            }
          }
        }
      });
    });

    // Function to change text and animate
    function showBonusAttained() {

      // Add animation class to trigger the visual effects
      score.classList.add('bonus-attained');
      score.classList.add('flashing');  // Optional: Add flashing effect for emphasis

      // Remove animation class after a short delay to reset for next time
      setTimeout(() => {
        score.classList.remove('bonus-attained');
        score.classList.remove('flashing');
      }, 2000);  // After 2 seconds, reset the styles
    }

    let playbool=false;
    // In webroot/app.js
    window.addEventListener('message', (event) => {
      if (event.data.type === 'devvit-message') {
        const { message } = event.data;
        console.log('Received from Devvit:', event);
        if(playbool==false) {
          start();
          playbool=true;
        }
        
      }
    });
    function start() {
      playGame();
    };
    
    function startTimer(duration, display) {
      var timer = duration, minutes, seconds;
      
      const clock = setInterval(function () {

          minutes = parseInt(timer / 60, 10)
          seconds = parseInt(timer % 60, 10);
  
          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;
  
          display.textContent = minutes + ":" + seconds;
          if (--timer < 0) {
              timer = 0;  
              playmode=false;     
              clearInterval(clock)      
              audioPlayer.pause(); // Pause the current audio
              //audioPlayer.currentTime = 0; // Reset to the start
              window.parent?.postMessage(
                { type: 'setCounter', data: { newCounter: Number(scoreVal) } },
                '*'
              );
              // timer = duration; // uncomment this line to reset timer automatically after reaching 0
          }
      }, 1000);
    }
    

    // Function to check if a word can be formed from selected tiles
    function canFormWord(word, tiles) {
      const letterCount = {};
      
      // Count the occurrences of each letter in tiles
      tiles.forEach(letter => {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
      });

      // Check if the word can be formed
      for (const letter of word) {
        if (letterCount[letter] > 0) {
          letterCount[letter]--;
        } else {
          return false; // If any letter is missing, return false
        }
      }
      
      return true; // Word can be formed
    }
    
    // Function to get a randomized selection of tiles (for 7 tiles)
    function getRandomTiles(numTiles = 7) {
      const pool = [];
      
      // Create a pool of letters based on their frequency
      for (const letter in scrabbleTiles) {
        for (let i = 0; i < scrabbleTiles[letter]; i++) {
          pool.push(letter);
        }
      }

      // Shuffle the pool and pick the number of tiles desired
      const shuffled = pool.sort(() => Math.random() - 0.5);  // Shuffle array
      const selectedTiles = shuffled.slice(0, numTiles);  // Take first `numTiles` letters
      let deck= shuffleArray(selectedTiles)

      for(let i=0;i<7;i++){
        letters[i].textContent=deck[i];
        counts[i].textContent=scrabbleScores[deck[i]];
      }

      tileArr= deck;
      return deck;
    }

    window.onload = function () {
      playGame();
    };
    

    function playGame(){
      var time = 150, // your time in seconds here
      display = document.querySelector('#timer');
      startTimer(time, display);
      getRandomTiles();
    }

    // Take in an array and shuffles
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function pickTiles() {
      let arr=[];
      for(let i=0;i<2;i++){
        let p = Math.floor(Math.random() * vowels.length);
        let v = vowels[p];
        arr.push(v);
      }
      for(let i=0;i<2;i++){
        let q = Math.floor(Math.random() * consonants.length);
        let c = consonants[q];
        arr.push(c);
      }
      for(let i=0;i<3;i++){
        let a = Math.floor(Math.random() * alphabet.length);
        let ap = alphabet[a];
        arr.push(ap);
      }
      let deck= shuffleArray(arr)

      for(let i=0;i<7;i++){
        letters[i].textContent=deck[i];
        counts[i].textContent=scrabbleScores[deck[i]];
      }

      tileArr= deck;
      return deck;
    }

    function matchArrays(arr1, arr2copy) {
      let arr2=[...arr2copy];
      // Loop through the smaller array
      return arr1.every(item1 => {
          // Check if the item exists in the larger array
          const matchIndex = arr2.indexOf(item1);
          if (matchIndex !== -1) {
              // Remove the matched item from arr2 to prevent duplicate matches
              arr2.splice(matchIndex, 1);
              return true; // Item is matched
              
          }
          return false; // Item is not matched
      });
    }

    function arrayCount(arr){
      let wordCount=0;
      arr.forEach(item=>{
        wordCount+=scrabbleScores[item]
      })
      return wordCount;
    }


    shuffle.addEventListener('click', () => {
      getRandomTiles();
      sound.play();
    });

  }
}

new App();
