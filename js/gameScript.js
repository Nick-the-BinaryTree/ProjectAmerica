var marginX = window.innerWidth/4;
var marginY = window.innerHeight/5;
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

//controls scoring 
var deduction = 0.1; //percent deduction for wrong answers
var speedBonus = 0.05; //percent bonus for each second left
var stdScore = 100; //score for question without bonuses or deductions

//time per question, in seconds
var timeLen=10;
//keeps track of score
var currentScore=0;

$(document).ready(function(){
    setBlock("#a1");
    setBlock("#a2");
    setBlock("#a3");
    setBlock("#a4");
    setBlock("#b1");
    setBlock("#b2");
    setBlock("#b3");
    setBlock("#b4");
    console.log("MarginX " + marginX);
    console.log("MarginY " + marginY);

    
});

function startTimer(){
    var counter= timeLen;
    $( "p.timeText" ).html("Time: "+counter);
    var timer= setInterval(function() {
    counter--;
    if(counter < 0) {
        nextQuestion();
        clearInterval(timer);
    } 
    else {
        $( "p.timeText" ).html("Time: "+counter);
    }
}, 1000);

}

function nextQuestion(){
    //will eventually be implemented. for now exists only to test timer
    console.log("next question!");
}

function setBlock(tile) {
    var x = genX();
    var y = genY();
    
    $(tile).css({
        "left": x,
        "top": y       
     });
}

function genX() {
    var x = Math.floor(Math.random() * (window.innerWidth-marginX))+2;
    return x;
}

function genY() {
    var y = Math.floor(Math.random() * (window.innerHeight-marginY*2))+marginY;
    return y;
}

function calculateScore(numWrong, secondsLeft){
    var score = stdScore - (stdScore * deduction * numWrong);
    score = score + (score * speedBonus * secondsLeft);
    return score;

}

function updateScore(newScore){
   
    $( "p.scoreText" ).html("Score: "+newScore);
    currentScore+=newScore;
}




