
//Sizing
var marginX = window.innerWidth/4;
var marginY = window.innerHeight/4;
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

//controls scoring 
var deduction = 0.1; //percent deduction for wrong answers
var stdScore = 100; //score for question without bonuses or deductions

//keeps track of score
var currentScore=0;

//keeps track of the number of wrong answers for each question
var numWrong=0;

//Timer
var timeElapsed=0;
//true during gameplay, for timer use
var inGame;


//Set to false at the start of question, true when correct: control gameplay
var q1=false;
var q2=false;

//controls question number
var qSet = 1;
//Temporary question control. count1 is odd, count2 is even
/*var count1=-1;
var count2=0;
*/
//Question Limit
var qLimit;

//Game settings
var selection; //[era id string, battles boolean, inventions boolean, elections boolean, court boolean, other boolean, length string]

//JSON with all data being used in the game (Created from master set with selection settings)
var gameEvents;


$(document).ready(function(){
    gameSetup();
    
});

function gameSetup(){
    $(".eraOption").hide();

    $(".create").click(function(){

        $(".mainContainer").hide();
        $(".eraOption").show();

        $(".eraOption").click(function(){
        
            var era = this.id;
            
            $(".eraOption").hide();
            $(".settings").show();
        
            $(".goButton").click(function(){
                var battles = $('#battles')[0].checked;
                var inventions = $('#inventions')[0].checked;
                var elections = $('#elections')[0].checked;
                var court = $('#court')[0].checked;
                var other = $('#other')[0].checked;
                var length = $('input[name="length"]:checked', '#lengthForm').val();
                
                setQuestionLimit(length);
                
                selection = [era, battles, inventions, elections, court, other, length];
            
                $(".pregame").hide();
                $(".game").show();
            
                eraBackground(era);
                
               gameEvents = getEvents();
                
                gameStart();
            });
        });
    });

}

function getEvents(){ //NOT DONE
    //Create data set for game from master set
    var master;
    
    $.getJSON("json/USHistory.json", function(json){
        console.log(json);
        master = JSON.parse(json);
        console.log(master);
        
    });
    
    //Era data set
    var era;
    
    //Dot notation shortcut possible here?
    if(selection[0]==="era1"){
        //Set newEvents = to JSON Object only containing that era
        era = master.era1;
    }
    else if(selection[0]==="era2"){
        era = master.era2;
    }
    else if(selection[0]==="era3"){
        era = master.era3;
    }
    else if(selection[0]==="era4"){
        era = master.era4;
    }
    else if(selection[0]==="era5"){
        era = master.era5;
    }
    
    //Remove subsets not needed?
    var newCopy = era;
    
    return newCopy;
}


function setQuestionLimit(lengthSelect){
    var limit = lengthSelect;
    
    if(limit==="quick"){
        qLimit = 10;
    }
    else if(limit==="medium"){
        qLimit = 20;
    }
    else if(limit==="long"){
        qLimit = 30;
    }
    else{
        qLimit = -1; //Code to use every event
    }
}

function eraBackground(era){
    
    var ranImage = Math.floor(Math.random()*3)+1; //Random selection from 3 possible backgrounds
    
    if(era === "era1"){
        if(ranImage === 1){
            $(document.body).css('background-image','url(img/era1/CrossingDelaware.jpg)');
        }
        else if(ranImage === 2){
            $(document.body).css('background-image','url(img/era1/DeclarationOfIndependence.jpg)');
        }
        else{
            $(document.body).css('background-image','url(img/era1/SurrenderOfGeneralBurgoyne.jpg)');
        }
    }
    else if(era === "era2"){
        if(ranImage === 1){
            $(document.body).css('background-image','url(img/era2/AndrewJackson.jpg)');
        }
        else if(ranImage === 2){
            $(document.body).css('background-image','url(img/era2/EmigrantsCrossingThePlains.jpg)');
        }
        else{
            $(document.body).css('background-image','url(img/era2/HenryClay.jpg)');
        }
    }
    else if(era === "era3"){
        if(ranImage === 1){
            $(document.body).css('background-image','url(img/era3/Gettysburg.jpg)');
        }
        else if(ranImage === 2){
            $(document.body).css('background-image','url(img/era3/McKinley.png)');
        }
        else{
            $(document.body).css('background-image','url(img/era3/SouthManchuriaRailway.jpg)');
        }
    }
    else if(era === "era4"){
        if(ranImage === 1){
            $(document.body).css('background-image','url(img/era4/Coca-Cola.jpg)');
        }
        else if(ranImage === 2){
            $(document.body).css('background-image','url(img/era4/Coolidge.jpg)');
        }
        else{
            $(document.body).css('background-image','url(img/era4/FlagRaising.jpg)');
        }
    }
    else if(era === "era5"){
        if(ranImage === 1){
            $(document.body).css('background-image','url(img/era5/Nixon-Johnson.jpg)');
        }
        else if(ranImage === 2){
            $(document.body).css('background-image','url(img/era5/Reagan.jpg)');
        }
        else{
            $(document.body).css('background-image','url(img/era5/Beatles.jpg)');
        }
    }
}

function gameStart(){
    inGame =true;
    startTimer();
    questionSetup();
}


function dragManager(){
    
        $( ".option" ).draggable({
            containment: "window",
            scroll: false
        });
    
        q1=false;
        q2=false;

    $(".answerBox1").droppable({
        accept: ".optionA",
        activeClass:"answerBox1Active",
        tolerance: "touch",
        drop: function(event, ui) {
            if(isCorrect("#"+ui.draggable.attr("id"))){
                q1=true;
                $("#"+ui.draggable.attr("id")).draggable( "destroy" );
                $(this).addClass( "answerBox1Dropped" )
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $(this)
                    });
                if(q2){ //If other question was also answered correctly, go to next set
                    questionSetup();
                }

            }
            else{
                $("#"+ui.draggable.attr("id")).draggable({ revert: "valid" });
                numWrong++;
            }

      }
      });

      $(".answerBox2").droppable({
        accept: ".optionB",
        activeClass:"answerBox2Active",
        drop: function(event, ui) {
            if(isCorrect("#"+ui.draggable.attr("id"))){
                q2=true;
                $("#"+ui.draggable.attr("id")).draggable( "destroy" );
                $(this).addClass( "answerBox2Dropped" )
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $(this)
                    });
                if(q1){
                    questionSetup();
                }

            }
            else{
                $("#"+ui.draggable.attr("id")).draggable({ revert: "valid" });
                numWrong++;
            }

        }
    });
}

//temporary implementation for testing. 
//returns array of form: [q1, correct, wrong, wrong, wrong, q2, correct, wrong,]
/*function getQuestion(){
    qSet++;
    //everything after this is temporary
    count1+=2;
    count2+=2;
    return ["q"+count1,"c"+count1,"w"+count1,"w"+count1,"w"+count1,"q"+count2,"c"+count2,"w"+count2,"w"+count2,"w"+count2]; //Remember to keep the qSet increments but not this

}
*/
function getEvent(){
    //Get event from new JSON object of only selected event types
    var event;
    return event;
}

function getFalseAnswers(correct){
    //Return array of randomly selected wrong answers from other events
    //Run 200 random num generation searches for answers in same category (battles, court, etc) ex: check event number 4 to see if already used. Randomly generate next event number to check
    //If none found (repeats or none available), run 100 searches in other available categories
    //If none found, hide extra answer bubble
    //Remember to make an array of already used answers and compare to avoid repeats
    //Make sure none match parameter correct too
    var falseAnswers=[];
    return falseAnswers;
}

function questionSetup(){

    $(".answerBox1").removeClass( "answerBox1Dropped" );
    $(".answerBox2").removeClass( "answerBox2Dropped" );

    var addScore=0;
    if(qSet>1){
       addScore = calculateScore(numWrong);
    }

    updateScore(addScore);
    numWrong=0;
    
    if(qSet <= qLimit){
        
        var event = getEvent();
        
        //Put name of event at top
        //Setup question boxes and correct answer bubbles
        
        var wrongAnswers = getFalseAnswers(event);
        
        //Check if there is a second question set for event
        /*
        
        var qa = getQuestion();
        $('#questionBox td').eq(0).html(qa[0]);

        $('#questionBox td').eq(2).html(qa[5]);

        $( "#a1" ).html(qa[1]);
        $( "#a2" ).html(qa[2]);
        $( "#a3" ).html(qa[3]);
        $( "#a4" ).html(qa[4]);
        $( "#b1" ).html(qa[6]);
        $( "#b2" ).html(qa[7]);
        $( "#b3" ).html(qa[8]);
        $( "#b4" ).html(qa[9]);
        */

        setBlock("#a1");
        setBlock("#a2");
        setBlock("#a3");
        setBlock("#a4");
        setBlock("#b1");
        setBlock("#b2");
        setBlock("#b3");
        setBlock("#b4")
        //$(".option").each(animateDiv);
        console.log("MarginX " + marginX);
        console.log("MarginY " + marginY);

        dragManager(); 
    }
    else{
        toScore();
    }
}

//called once at start of game
function startTimer(){
    $( "p.timeText" ).html("Time: "+timeElapsed);
    var timer= setInterval(function() {
    timeElapsed++;
    if(inGame){
        $( "p.timeText" ).html("Time: "+timeElapsed);
    }
    }, 1000);
}



function isCorrect(ans){
    //temporary implementation 
    return $(ans).hasClass("correct");
}

function toScore(){
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
    $(".eraOption").hide();
    $(".settings").hide();
    $(".mainContainer").show();
    selection = gameSetup(); //The cycle never ends! What is life?
}

function resetGame(){
    currentScore = 0;
    qSet = 0;
    count1=-1;
    count2=0;
    timeElapsed = 0;
    
    $(document.body).css('background-image','url(img/HomeInTheWoods.jpg)');
}

function setBlock(tile) {
    var x = genX();
    var y = genY();
    var XArr = getXPositions();
    var YArr = getYPositions();
    while(checkOverlap(x,y)){
        x=genX();
        y=genY();
    }
    
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
    var y = Math.floor(Math.random() * (window.innerHeight-marginY*2.5))+marginY;
return y;
}

function calculateScore(numWrong){
     var score = stdScore - (stdScore * deduction * numWrong);
     //time will also be factored in somehow 
     return score;
 
 }

function updateScore(newScore){
  
    
   currentScore+=newScore;
   $( "p.scoreText" ).html("Score: "+currentScore);
}

//checks overlap given point and arrays of previous x and y positions
function checkOverlap(xCoor, yCoor){
    xArr = getXPositions();
    yArr = getYPositions();
    for(var i=0;i<xArr.length;i++){
        if(willOverlap(xCoor,xArr[i], yCoor,yArr[i])){
            return true;
        }
    }
    
    return false;

}



//calculates distance between two top left corners, compares that with diagonal
function willOverlap(x1,x2,y1,y2){
    var d = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    return (d<getAnswerSize());
}

//calculates diagonal of answer bubble. also multiplies by 1.25. because reasons. this number may end up having to change.
function getAnswerSize(){
      var w=$("#a1").width();
      var h=$("#a1").height();
      var dist = Math.sqrt((h*h) + (w*w));
      return dist*1.25;

}


//returns array with numeric values of x positions of all answer bubbles 
function getXPositions(){
    var XPos =[];
    XPos.push($("#a1").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#a2").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#a3").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#a4").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#b1").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#b2").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#b3").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#b4").css("left").replace(/[^-\d\.]/g, ''));
    return XPos;

}

//same but y
function getYPositions(){
    var YPos =[];
    YPos.push($("#a1").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#a2").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#a3").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#a4").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#b1").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#b2").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#b3").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#b4").css("top").replace(/[^-\d\.]/g, ''));
    return YPos;

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
