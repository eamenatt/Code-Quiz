
//VARIBALE Assignment

var highscoresLink = document.getElementById("highscores");
var remainingTime = document.getElementById("number-of-secs");
var welcomeScreen = document.getElementById("welcome-screen");
var startButton = document.getElementById("start-button");
var quizSection = document.getElementById("quiz-section");
var questionField = document.getElementById("question");
var answersContainer = document.getElementById("answers");
var answerA = document.getElementById("answerA");
var answerB = document.getElementById("answerB");
var answerC = document.getElementById("answerC");
var answerD = document.getElementById("answerD");
var feedbackSeparatorLine = document.getElementById("answer-feedback-separator");
var answerFeedback = document.getElementById("answer-feedback");
var modalHighScores = document.getElementById("highscores-display");
var clearHighScoresButton = document.getElementById("clear-highscores");
var userScoreOutput = document.getElementById("user-score");
var submitScoreButton = document.getElementById("submit-score");
var highScoresArray = [];
var acceptingAnswer;
var interval;
const gameTime = 120;
var userChoice;
var questionNumber = 0;
var score = 0;
var penalty = 5;
var numberOfHighscores = 5;

// Questions Array
var questionSet = [
    {
        question: "Test",
        answers: ["AnswerA", "AnswerB", "AnswerC", "AnswerD",],
        correctChoice: "b",
    },
    {
        question: "Test",
        answers: ["AnswerA", "AnswerB", "AnswerC", "AnswerD",],
        correctChoice: "c",
    },
    {
        question: "Test",
        answers: ["AnswerA", "AnswerB", "AnswerC", "AnswerD",],
        correctChoice: "a",
    },
    {
        question: "Test",
        answers: ["AnswerA", "AnswerB", "AnswerC", "AnswerD",],
        correctChoice: "b",
    },
    {
        question: "Test",
        answers: ["AnswerA", "AnswerB", "AnswerC", "AnswerD",],
        correctChoice: "a",
    },
    {
        question: "Test",
        answers: ["AnswerA", "AnswerB", "AnswerC", "AnswerD",],
        correctChoice: "c",
    },
    {
        question: "Test",
        answers: ["AnswerA", "AnswerB", "AnswerC", "AnswerD",],
        correctChoice: "c",
    },
    {
        question: "Test",
        answers: ["AnswerA", "AnswerB", "AnswerC", "AnswerD",],
        correctChoice: "d",
    },

]

function resetGame() {
    secondsLeft = gameTime;
    userChoice;
    questionNumber = 0;
    score = 0;
}


function displayQuestion(question) {
    answersContainer.querySelectorAll("button").forEach(button => {
        button.classList.remove("hover");
    });
    setTimeout(function () {
        acceptingAnswer = true;
    }, 1000)
    questionField.textContent = question.question;
    answerA.textContent = question.answers[0];
    answerB.textContent = question.answers[1];
    answerC.textContent = question.answers[2];
    answerD.textContent = question.answers[3];
}


// Start buton
function startQuiz() {
    resetGame();
    displayQuestion(questionSet[questionNumber]);
    interval = setInterval(function () {
        displayTime();
        secondsLeft--;
        if (secondsLeft <= 0) {
            endQuiz();
        }
    }, 1000);

}

function endQuiz() {
    score = score + Math.floor(secondsLeft * (score / questionSet.length));
    clearInterval(interval);
    secondsLeft = 0;
    displayTime();
    $("#quiz-section").hide();
    $("#welcome-screen").show();
    userScoreOutput.textContent = "Your score is " + score;
    $("#enter-score").modal("show");
}



function displayHighscores() {

    var highScore = getHighScoreFromLocalDrive();

    if (highScore == null) {
        modalHighScores.innerHTML = "No high scores yet!";
    } else {
        var highScoreDiv = document.createElement("div");
        for (var i = 0; i < highScore.length && i < numberOfHighscores; i++) {
            var paragraph = document.createElement("p");
            paragraph.textContent = (i + 1) + ". Name: " + highScore[i].name + " Score: " + highScore[i].score;
            highScoreDiv.appendChild(paragraph);
        }
        modalHighScores.innerHTML = highScoreDiv.innerHTML;
    }


}


function clearHighScores() {
    localStorage.clear();
    displayHighscores();
}



function displayTime() {
    remainingTime.textContent = secondsLeft;
}

function getHighScoreFromLocalDrive() {
    return JSON.parse(localStorage.getItem('highscore'));
}


// Validation
function handleClick() {

    while (acceptingAnswer) {
        acceptingAnswer = false;
        feedbackSeparatorLine.classList.remove("display-off");
        checkAnswer(questionSet[questionNumber]);
        questionNumber++;
        if (questionNumber < questionSet.length) {
            setTimeout(function () {
                displayQuestion(questionSet[questionNumber]);
            }, 1000);

        } else {
            setTimeout(function () {
                endQuiz();
            }, 1000);

        }

    }

}

// Check if user input is correct, deduct 10 seconds if not.

function checkAnswer(question) {
    if (userChoice === question.correctChoice) {
        score++;
        answerFeedback.textContent = "Correct!";
        answerFeedback.style.color = "green";
    } else {
        answerFeedback.textContent = "Wrong!";
        answerFeedback.style.color = "red";
        if ((secondsLeft - penalty) > 0) {
            secondsLeft -= penalty;
            displayTime();
        } else {
            endQuiz();
        }
    }
    setTimeout(function () {
        answerFeedback.textContent = "";
        feedbackSeparatorLine.classList.add("display-off");
    }, 1000)
}


// Event listeners
// ===============
// Take user answer on multiplce choice question

answerA.addEventListener("click", function () {
    userChoice = "a";
    handleClick();

});

answerB.addEventListener("click", function () {
    userChoice = "b";
    handleClick();

});

answerC.addEventListener("click", function () {
    userChoice = "c";
    handleClick();

});

answerD.addEventListener("click", function () {
    userChoice = "d";
    handleClick();

});

highscoresLink.addEventListener("click", function (event) {
    displayHighscores();
});

// Once the Start quiz button pressed, hide the welcome screen, show the first question and start the quiz

startButton.addEventListener("click", function () {
    $("#welcome-screen").hide();
    $("#quiz-section").show();
    startQuiz();
});


submitScoreButton.addEventListener("click", function () {

    var highScore = getHighScoreFromLocalDrive();
    var highScoreUnchanged = true;

    var name = $("#initials").val();
    if (name.trim() === "") {
        name = "Anonymous";
    }

   
    var i = 0;
    if (highScore === null) {
        highScore = [{ "name": name, "score": score }];
    } else {

        
        while (i < numberOfHighscores && i < highScore.length && highScoreUnchanged) {
            if (score > highScore[i].score) {
                highScore.splice(i, 0, { "name": name, "score": score })
                highScoreUnchanged = false;
            }
            i++;
        }

      
        if (i < numberOfHighscores && highScoreUnchanged) {
            highScore.push({ "name": name, "score": score });
        }
    }

    localStorage.setItem("highscore", JSON.stringify(highScore));
    $("#enter-score").modal("hide");
    displayHighscores();
    $("#highscores-modal").modal("show");

});


clearHighScoresButton.addEventListener("click", function () {
    clearHighScores();
});

answersContainer.addEventListener("mouseover", function (event) {
    var hoveringOver = event.target;
    if (hoveringOver.matches("button")) {
        hoveringOver.classList.add("hover");
    }
});

answersContainer.addEventListener("mouseout", function (event) {
    var hoveringOver = event.target;
    hoveringOver.classList.remove("hover");
});

