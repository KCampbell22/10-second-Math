

$(document).ready(function(){
    var currentQuestion;
    var interval;
    var timeLeft = 10;
    var score = 0;
    var range = $("#Range").val();
    var highScore = 0;
    var output = $('.value-range')
    output.html(range);

    $('#Range').on('change', function() {
        output.html(this.value);

    })

    var operators = []
    
    function getOperators() {
        $('.mode').map(function(i,ele) {
            if ($(ele).prop('checked') === true) {
                operators.push($(ele).val());
                // remove repeatd operators
                operators.sort();
                // remove duplicates
                operators.forEach(function(item, index) {
                    if (item === operators[index + 1]) {
                        operators.splice(index + 1, 1);
                    }
                });
            }
        })
    }

   



        
        

   


    var updateTimeLeft = function (amount) {
      timeLeft += amount;
      $('#time-left').text(timeLeft);
    };
    
    var updateScore = function (amount) {
      score += amount;
      $('#score').text(score);
    };

    var updateHighScore = function (amount) {
        highScore = amount;
        $('#highScore').text(highScore);
        }
        
    var startGame = function () {
      if (!interval) {
        if (timeLeft === 0) {
          updateTimeLeft(10);
          getOperators();
          updateScore(-score);
        }
        interval = setInterval(function () {
          updateTimeLeft(-1);
          if (timeLeft === 0) {
            clearInterval(interval);
            interval = undefined;
            updateHighScore(score);
            if (score > highScore) {
              updateHighScore(score);
            }
          }
        }, 1000);  
      }
    };
    

    var randomNumberGenerator = function (size) {
      return Math.ceil(Math.random() * size);
    };

    var randomOperator = function () {    
        getOperators();
        return operators[Math.floor(Math.random() * operators.length)];
    }
    
    var questionGenerator = function () {

      var question = {};

      // higher random number is the first number

      var num1 = randomNumberGenerator(range);
      var num2 = randomNumberGenerator(range);
      var num3 = num1 * num2;
      var ranOperator = randomOperator()
        // for '/' the first number must be divisible evenly by the second number

       switch (ranOperator) {
        case '+':
            question.answer = num1 + num2;
            question.equation = `${String(num1)} + ${String(num2)}`

            break;
        case '-': switch(true) {
            case num1 < num2:
                question.answer = num2 - num1;
                question.equation = `${String(num1)} - ${String(num2)}`

                break;
            case num1 > num2:
                question.answer = num1 - num2;
                question.equation = `${String(num1)} - ${String(num2)}`

                break;
        }
            break;
        case '*':
            question.answer = num1 * num2;
            question.equation = `${String(num1)} * ${String(num2)}`

            break;
        case '/': switch(true) {
            //positive and whole numbers
            case num1 % num2 === 0:
                question.answer = num1 / num2;
                question.equation = `${String(num1)} / ${String(num2)}`

                break;

        }
            break;
            
                
        }
        

        if(ranOperator === '/' && num1 < num2 && num2 % num1 !== 0) {
            num1 = randomNumberGenerator(range);
            num2 = randomNumberGenerator(range);

            question.answer = num1 / num2;

            question.equation = `${String(num1)} / ${String(num2)}`
            
        }
            


        
    
        
    ;

    // divide must not have a remainder
    if (ranOperator === '/' && num1 % num2 !== 0) {
        questionGenerator();
    }

    return question;
        
            



     
    };

    
    var renderNewQuestion = function () {
      currentQuestion = questionGenerator();
      $('#equation').text(currentQuestion.equation);  
    
    };
    
    var checkAnswer = function (userInput, answer) {
      if (userInput === answer) {
        renderNewQuestion();
        $('#user-input').val('');
        updateTimeLeft(+1);
        updateScore(+1);
      }
    };
    
    $('#user-input').on('keyup', function () {
      startGame();
      checkAnswer(Number($(this).val()), currentQuestion.answer);
    });

    getOperators();
    renderNewQuestion();
  });