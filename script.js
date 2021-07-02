const btn = document.querySelector("#submit-btn");
const input = document.querySelector("#file");
const form = document.querySelector("#form");
const output = document.querySelector("#output");
const message = document.querySelector("#message");
const fileBtn = document.querySelector(".file-btn")


const fileReader = new FileReader();
const YOUR_API_KEY = "rfMeXLRjFVp3665m";
const URL = "https://api.textgears.com/spelling?";

input.addEventListener("change", ()=>{
  fileBtn.innerText = input.files[0].name
})

form.addEventListener("submit", (event) => {

  event.preventDefault();
  if (input.files.length === 0) {
    message.innerHTML = "No File Selected!";
    message.classList.add("error")
    return;
  }
  
  message.innerHTML = "";
  const inputFile = input.files[0];


  fileReader.readAsText(inputFile, "UTF-8");
  fileReader.onload = async (event) => {
    let value = event.target.result;
    let cleanString = value.replace(/(\r\n|\n|\r)/gm, " ");
    let result = cleanString.replaceAll(" ", "+");

    try {
      const data = await (
        await fetch(URL + `key=${YOUR_API_KEY}&text=${result}&language=en-GB`)
      ).json();
      const errors = data.response.errors;

      const badBetterWords = {};
      errors.forEach((error) => {
        badBetterWords[error.bad] = error.better;
      });

      // Iterating Every Word
      const words = cleanString.split(" ");
      words.forEach((word) => {
        const textBox = document.createElement("span");
        const spanWord = document.createElement("span");
        const spanSuggestionBox = document.createElement("span");
        let isBad = false;

        textBox.classList.add("text");

        // For Bad Words
        if (word in badBetterWords) {
          // By default hide the suggestion box
          spanWord.addEventListener("click", () => {
            spanSuggestionBox.style.display = "block";
          });
          spanSuggestionBox.style.display = "none";
          spanSuggestionBox.classList.add("suggestions");

          isBad = true;
          spanWord.classList.add("bad-word")

          const ul = document.createElement("ul");

          ul.addEventListener('mouseleave', ()=>{
            spanSuggestionBox.style.display="none"
          })

          // Adding Suggestion
          badBetterWords[word].forEach((betterWord) => {
            const li = document.createElement("li");
            li.addEventListener("click", (event) => {
              spanWord.innerHTML = betterWord;
              spanWord.classList.remove("bad-word")

              spanSuggestionBox.remove();
            });
            li.innerText = betterWord;
            ul.appendChild(li);
          });

          spanSuggestionBox.appendChild(ul);
        }

        spanWord.innerText = word;
        textBox.appendChild(spanWord);
        if (isBad) {
          textBox.appendChild(spanSuggestionBox);
        }
        message.appendChild(textBox);
        message.style.textAlign = "left"
        message.classList.remove("error")


      });
    } catch (err) {
      message.innerHTML = "Error while reading file!";
      message.classList.add("error")
      return;
    }

    // message.innerHTML = event.target.result
  };
  fileReader.onerror = (event) => {
    message.innerHTML = "Error while reading file!";
    message.classList.add("error")
  };
});
