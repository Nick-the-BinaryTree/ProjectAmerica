function toScore(){
    console.log("score");
    $("#yourScore").text("Your Score: " + currentScore);
    $(".game").hide();
    $(".scoreBoard").show();
    inGame=false;
    $(".returnOption").click(function(){
        resetGame();
        backToMenu();
    });
}

function backToMenu(){
    $(".scoreBoard").hide();
    $(".pregame").show();
    $(".eraChoice").hide();
    $(".settings").hide();
    $(".startContainer").show();
    gameSetup(); //The cycle never ends! What is life?
}

function resetGame(){
    currentScore = 0;
    questionTime=0;
    timeElapsed = 0;
    categories=[];
    askedQuestions=[];
    $(document.body).css('background-image','url(img/HomeInTheWoods.jpg)');
}