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
                $(this).addClass( "answerBox1Dropped" )
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $(this)
                    });

                setTimeout($("#"+ui.draggable.attr("id")).draggable( "destroy" ),50);
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
                $(this).addClass( "answerBox2Dropped" )
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $(this)
                    });
                setTimeout($("#"+ui.draggable.attr("id")).draggable( "destroy" ),50);
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
 
    $(tile).show(); //In case any were hidden because they contained nothing
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
