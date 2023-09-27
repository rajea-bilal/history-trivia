// global variables

const btn = document.querySelector('#btn')
let question = document.querySelector('.question')
const formElement = document.querySelector(".answer-options")
const result = document.querySelector(".resultDisplay")
const nextBtn = document.querySelector('.btn')
const scoreDisplay = document.querySelector('.score')
let correctAnswer;
let answerOptions;
let score = 0;


// ?amount=20&category=23&difficulty=medium

const questionParameters = {
  amount: 2,
  category: 23,
  difficulty: "easy",
};

async function retrieveDataFromApi(url, params) {
    try {
    const response = await fetch(`${url}${params}`);

    if (!response.ok) {
        console.error(`Error received: ${response.status}`);
    }

        const data = await response.json();
        return data;
    } catch (error) {
      console.error("Error:", error.message);
    }
}

// from the parameters passed
function composeParameters(params) {
  let paramString = "";
  for (const key in params) {
    const separator = paramString.length === 0 ? "?" : "&";
    paramString += separator + key + "=" + params[key];
  }

  return paramString;
}


// fetch questions data
async function fetchQuestions() {
    try {
    const questionParams = composeParameters(questionParameters);
    // get questions data from api
    const data = await retrieveDataFromApi( "https://opentdb.com/api.php", questionParams );
    return await data;

      } catch (error) {
        console.error("Failed to retrieve weather data:", error.message);
      }
}

async function displayToDom() {

    // clear out the screen from previous rendering
    formElement.innerHTML = `<form class="answer-options"></form>`
    result.textContent = ``
     // get questions data from api
    const questionData = await fetchQuestions();

    const questionsArray = questionData.results
   
    let randomIndex = Math.floor(Math.random() * questionsArray.length)
    let randomQuestion = questionsArray[randomIndex]

        correctAnswer = randomQuestion.correct_answer
        answerOptions = randomQuestion.incorrect_answers
        let inputElement = document.createElement('input')
        inputElement.setAttribute("type", "radio")
        inputElement.setAttribute("value", correctAnswer)
        inputElement.setAttribute("name", "answer")
        inputElement.classList.add('input')

        let labelElement = document.createElement('label')
        labelElement.textContent = correctAnswer
        formElement.appendChild(inputElement)
        formElement.appendChild(labelElement)
        question.textContent = randomQuestion.question
        
        for(let answer of answerOptions) {
       
        // create the radio input
        let inputElement = document.createElement('input')
        inputElement.type = "radio"
        inputElement.value =  answer
        inputElement.name = "answer"
        inputElement.classList.add('input')
        // create the label
        let labelElement = document.createElement('label')
        labelElement.textContent = answer
       
        formElement.appendChild(document.createElement("br"))
        formElement.appendChild(inputElement)
      
        formElement.appendChild(labelElement)

    }
        // answerOptions.textContent = questionObject.incorrect_answers
    
    // update question on screen
    // let questionOne = questionData.results[0].question
    // question.textContent = questionOne
    
    // let answerOptions = questionData.results[0].incorrect_answers
    //     correctAnswer = questionData.results[0].correct_answer


}
    
//form functionality
document.addEventListener("DOMContentLoaded", displayToDom())

    
// grab user's value from the input radio button
formElement.addEventListener("change", (event) => {
    event.preventDefault()

    let selectedAnswer = document.querySelector("input[name='answer']:checked").value
    checkAnswer(selectedAnswer, correctAnswer )

})

function checkAnswer(userAnswer, correctAnswer) {

    if(userAnswer === correctAnswer) {
        result.textContent = "Yippee! you got it right!!"
        score++
        scoreDisplay.textContent = score
    } else {
        result.textContent = "I'm sorry mate, try again..."
    }
}



// to move to the next question
nextBtn.addEventListener('click', displayToDom)



