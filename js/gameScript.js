var marginX = window.innerWidth/4;
var marginY = window.innerHeight/5;
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

//controls scoring 
var deduction = 0.1; //percent deduction for wrong answers
var speedBonus = 0.05; //percent bonus for each second left
var stdScore = 100; //score for question without bonuses or deductions

var timeElapsed=0;
//keeps track of score
var currentScore=0;


$(document).ready(function(){
    startTimer();
    setBlock("#a1");
    setBlock("#a2");
    setBlock("#a3");
    setBlock("#a4");
    setBlock("#b1");
    setBlock("#b2");
    setBlock("#b3");
    setBlock("#b4");
	//$(".option").each(animateDiv);
    console.log("MarginX " + marginX);
    console.log("MarginY " + marginY);
    $( ".option" ).draggable({
        containment: "window",
        scroll: false,
    });


    $(".answerBox1").droppable({
        accept: ".optionA",
        activeClass:"answerBox1Active",
        drop: function(event, ui) {
            if(isCorrect("#"+ui.draggable.attr("id"))){
                $(this).addClass( "answerBox1Dropped" )
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $(this)
                    });

            }
            else{
                setBlock("#"+ui.draggable.attr("id"));
            }

      }
      });

      $(".answerBox2").droppable({
        accept: ".optionB",
        activeClass:"answerBox2Active",
        drop: function(event, ui) {
            if(isCorrect("#"+ui.draggable.attr("id"))){
                $(this).addClass( "answerBox2Dropped" )
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $(this)
                    });

            }
            else{
                setBlock("#"+ui.draggable.attr("id"));
            }

      }
    });
});

//currently set up to be called once at start of game. can be adjusted to pause
//during loading if we can't load quickly enough
function startTimer(){
    var counter=0;
    $( "p.timeText" ).html("Time: "+counter);
    var timer= setInterval(function() {
    counter++;
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

function isCorrect(ans){
    //temporary implementation 
    return $(ans).hasClass("correct");
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

/*http://codepen.io/anon/pen/myyzXV

function animateDiv(){
    var newq = [makeNewPosition()];
    var oldq = $('.option').offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
	
    $('.option').animate({ top: newq[0], left: newq[1] }, speed, function(){
      animateDiv();        
    });
    
};

function makeNewPosition(){
    
    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - 50;
    var w = $(window).width() - 50;
    
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    
    return [nh,nw];    
    
}

function calcSpeed(prev, next) {
    
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    
    var speedModifier = 0.05;

    var speed = Math.ceil(greatest/speedModifier);

    return speed;

}
*/


function calculateScore(numWrong, secondsLeft){
    var score = stdScore - (stdScore * deduction * numWrong);
    //time will also be factored in somehow 
    return score;

}

function updateScore(newScore){
   
    $( "p.scoreText" ).html("Score: "+newScore);
    currentScore+=newScore;
}

