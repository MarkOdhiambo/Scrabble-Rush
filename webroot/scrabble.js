// Assuming valid_words.json is in the same directory
fetch('dictionary.json')
  .then(response => response.json())
  .then(data => {
    const validWords = data.words;
    
    function isValidWord(word) {
      return validWords.includes(word.toLowerCase());
    }

    // Example usage
    const testWord = 'cat';
    if (isValidWord(testWord)) {
      console.log(`${testWord} is a valid word!`);
    } else {
      console.log(`${testWord} is not a valid word.`);
    }
  })
  .catch(error => console.log('Error:', error));