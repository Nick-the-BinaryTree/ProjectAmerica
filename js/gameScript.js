
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

//for every second less than stdtime you use, you get a score bonus of 5 points
var stdtime=30;
var speedBonus =5;

//time spent on question
var questionTime=0;
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

//current game's categories
var categories=[];

//questions that have been asked
var askedQuestions =[];

//controls follow-up question for battles
var followup=false;

//set to number corresponding to event after questions are set up. 
//always set but only used for battles
var prevEvent;

//creates client
/*
var client = new Client("project-america.herokuapp.com", 80, function(error) { 
    console.log("Error " + error);

}, function(question) { // onQuestionBatch received
    console.log("Received question batch " + question);
    // Show the question
    
    // ... see playgame() for how to submit a response
}, function(section) { // onSection
    console.log("Received section " + section);
    // Change to that section (background, etc.)

}, function() { // onDone
    // Change to scoreboard, we're done
    console.log("Done!");

}, function(scores) { // onScore
    console.log("Received scores " + scores);
    // Update the scores

});
*/

//idk how usernames are gonna work
var username="yay";


$(document).ready(function(){
    gameSetup();
    
});

function gameSetup(){
   /* client.connect(username, function() { 
    console.log("Connected");

    });
    */
    
    $(".create").click(function(){

        $(".startContainer").hide();
        $(".eraChoice").show();

        $(".eraOption").click(function(){
        
            var era = this.id;
            
            $(".eraChoice").hide();
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
                getEvents();
                console.log(gameEvents);
        
            
                $(".pregame").hide();
                $(".game").show();
            
                eraBackground(era);
            

                gameStart();
            });
        });
    });

}


function getEvents(){ //Working! (At least w/ server)
    //Create data set for game from master set

    $.ajax({
        url:"json/USHistory.json",
        dataType:"text",
        async: false,
        success:function(data){
            
            var master = JSON.parse(data);
            
            var era;
            
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
            
            var blankCopy = '{"battles" : [],"inventions" : [],"elections" : [],"court": [], "other" : [] }';

            //console.log(blankCopy);


              
            var newCopy=JSON.parse(blankCopy);
            
            if(selection[1]===true){
                newCopy["battles"] = era.battles;
                categories.push("battles");
            }
            if(selection[2]===true){
                newCopy["inventions"] = era.inventions;
                categories.push("inventions");
            }
            if(selection[3]===true){
                newCopy["elections"] = era.elections;
                categories.push("elections");
            }
            if(selection[4]===true){
                newCopy["court"] = era.court;
                categories.push("court");
            }
            if(selection[5]===true){
                newCopy["other"] = era.other;
                categories.push("other");
            }
    
        gameEvents = newCopy;
        }
    });
}

//returns [category random number, event random number]
function getRanEvent(){
    var ranCategory = Math.floor(Math.random() * categories.length);
    var category = categories[ranCategory];
    var ranEvent = Math.floor(Math.random() * gameEvents[category].length);
    var timeout = 0;
    var timeoutMax = 2000;
    
    while(timeout < 2000 && alreadyAsked(gameEvents[category][ranEvent].name)){
        ranCategory = Math.floor(Math.random() * categories.length);
        category = categories[ranCategory];
        ranEvent = Math.floor(Math.random() * gameEvents[category].length);
        
        timeout++;
    }

    if(timeout > timeoutMax){ //Couldn't get event that wasn't already used - end game
        toScore();
    }
    
    askedQuestions.push(gameEvents[category][ranEvent].name);

    return [ranCategory,ranEvent];

}

function alreadyAsked(event){

    for(var i=0; i<askedQuestions.length;i++){
        if(askedQuestions[i]===event){
            return true;
        }
    }
    return false;
}

//parameter: random number corresponding to category. if follow up, number doesn't matter
function getQuestions(ranCategory){
    if(followup){
        var ranQuest="";
        if(Math.random()<0.5)
            ranQuest="Victor:";
        else
            ranQuest="Loser:";
        return [ranQuest,"Notable Fact:"];

    }
    else{
        if(categories[ranCategory]==="battles"){
            return ["Year:", "Location:"];
        }

        else if(categories[ranCategory]==="inventions"){
            return ["Year:", "Significance:"];
        }

        else if(categories[ranCategory]==="elections"){
            return ["Result:", "Notable Fact:"];
        }

        else if(categories[ranCategory]==="court"){
            return ["Year:","Result:"];
        }

        else if(categories[ranCategory]==="other"){
            return ["Year:","Significance:"];
        }
    }

}
//Correct is the current event whose information is correct for all questions
//Types are ints that specify what kind of false answers to generate
//1 is year, 2 is location, 3 is battle notable, 4 is invention significance, 5 is election notable, 6 is court ruling, 7 is other significance

function genFalseAnswers(questionType, correct){
    var usedAnswers=[];
    var numAnswers = 4; 
    var timeout = 0;
    var timeoutFallback = 1000;
    var timeoutMax = 1500;
    
    if(questionType === 1){ //Year (Works for any type)
        
        usedAnswers.push(correct.year);
            
        while(timeout < timeoutMax && usedAnswers.length < numAnswers){
            
            var potential;
            
            if(timeout < timeoutFallback){
                potential = getRanYear();
            }
            else{
                potential = getFallbackFact();
            }
            
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
            
            timeout++;
        }
        
        if(timeout>timeoutMax){ //If nothing was found in a large number of searches, hide the bubble
            usedAnswers.push(-1);  //Bubble hiding code
        }
        
        var falseAnswers = usedAnswers.splice(1,usedAnswers.length); //Removes first element (correct answer)
        
        return falseAnswers;
    }
    else if(questionType === 2){ //Location (Only called for battles)
        usedAnswers.push(correct.location);
            
        while(timeout < timeoutMax && usedAnswers.length < numAnswers){
                
            var potential;
            
            if(timeout < timeoutFallback){
                potential = getRanLocation();
            }
            else{
                potential = getFallbackFact();
            }
            
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
            
            timeout++;
        }
        
        if(timeout>timeoutMax){ //If nothing was found in a large number of searches, hide the bubble
            usedAnswers.push(-1);  //Bubble hiding code
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
    else if(questionType === 3){ //Battle notable fact
        usedAnswers = correct.notables;
            
        while(timeout < timeoutMax && usedAnswers.length -1< numAnswers){
                
            var potential;
            
            if(timeout<timeoutFallback){
                potential = getRanBatNotable();
            }
            else{ //Normal fact related to question couldn't be found in reasonable amount of searches. Using more general facts.
                potential = getFallbackFact();
            }
            
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
                
            timeout++;
                
        }
        
        if(timeout>timeoutMax){
            usedAnswers.push(-1); 
        }
        
        var falseAnswers = usedAnswers.splice(correct.notables.length-3, usedAnswers.length); //Remove correct notable facts from array
        console.log(falseAnswers.toString());
        console.log(usedAnswers.toString());
        return falseAnswers;
    }
    else if(questionType === 4){ //Invention significance
        usedAnswers.push(correct.significance);
            
        while(timeout < timeoutMax && usedAnswers.length < numAnswers ){
                        
            var potential;
            
            if(timeout<timeoutFallback){
                potential = getRanInvSig();
            }
            else{
                potential = getFallbackFact();
            }
            
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
                
            timeout++;
            
        }
        
        if(timeout>timeoutMax){
                usedAnswers.push(-1); 
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
    else if(questionType === 5){ //Election notable
        usedAnswers = correct.notables;
            
        while(timeout < timeoutMax && usedAnswers.length -1< numAnswers){
                
            var potential;
            
            if(timeout<timeoutFallback){
                potential = getRanElecNotable();
            }
            else{
                potential = getFallbackFact();
            }
                
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
                
            timeout++;
                
        }
        
        if(timeout>timeoutMax){
            usedAnswers.push(-1); 
        }
        
        var falseAnswers = usedAnswers.splice(correct.notables.length-3, usedAnswers.length);
        console.log(falseAnswers.toString());
        console.log(usedAnswers.toString());
        return falseAnswers;
    }
    else if(questionType === 6){ //Court ruling
        usedAnswers.push(correct.ruling);
            
        while(timeout < timeoutMax && usedAnswers.length < numAnswers){
                
            var potential;
            
            if(timeout<timeoutFallback){
                potential = getRanRuling();
            }
            else{
                potential = getFallbackFact();
            }
                
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
                
            timeout++;
                
        }
        
        if(timeout>timeoutMax){
            usedAnswers.push(-1); 
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
    else if(questionType === 7){ //Other significance
        usedAnswers.push(correct.significance);
            
        while(timeout < timeoutMax && usedAnswers.length < numAnswers){
                
            var potential;
            
            if(timeout < timeoutFallback){
                potential = getRanOtherSig();
            }
            else{
                potential = getFallbackFact();
            }
                
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
                
            timeout++;
                
        }
        
        if(timeout>timeoutMax){
            usedAnswers.push(-1); 
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
    
    else if(questionType === 8){ //Battle victor
        usedAnswers.push(correct.result.victor);
            
        while(timeout < timeoutMax && usedAnswers.length < numAnswers){
                
            var potential;
            
            if(timeout < timeoutFallback){
                potential = getRanVictorOrLoser();
            }
            else{
                potential = getFallbackFact();
            }
                
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
                
            timeout++;
                
        }
        
        if(timeout>timeoutMax){
            usedAnswers.push(-1); 
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
    
    else if(questionType === 9){ //Battle loser
        usedAnswers.push(correct.result.loser);
            
        while(timeout < timeoutMax && usedAnswers.length < numAnswers){
                
            var potential;
            
            if(timeout < timeoutFallback){
                potential = getRanVictorOrLoser();
            }
            else{
                potential = getFallbackFact();
            }
                
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
                
            timeout++;
                
        }
        
        if(timeout>timeoutMax){
            usedAnswers.push(-1); 
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
    
    else if(questionType === 10){ //Election result
        usedAnswers.push(correct.result);
            
        while(timeout < timeoutMax && usedAnswers.length < numAnswers){
                
            var potential;
            
            if(timeout < timeoutFallback){
                potential = getRanElecResult();
            }
            else{
                potential = getFallbackFact();
            }
                
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
                
            timeout++;
                
        }
        
        if(timeout>timeoutMax){
            usedAnswers.push(-1); 
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
}


function questionSetup(){

    $(".answerBox1").removeClass( "answerBox1Dropped" );
    $(".answerBox2").removeClass( "answerBox2Dropped" );

    console.log(currentScore);


    var addScore=0;
    var time=0;
    if(qSet>1){
        if(questionTime<stdtime){
            time=stdtime-questionTime;
        }
       addScore = calculateScore(numWrong,time);
    }

    updateScore(addScore);
    numWrong=0;
    questionTime=0;
    
    if(qSet <= qLimit){
        
        setBlock("#a1");
        setBlock("#a2");
        setBlock("#a3");
        setBlock("#a4");
        setBlock("#b1");
        setBlock("#b2");
        setBlock("#b3");
        setBlock("#b4")

        dragManager();
        //Put name of event at top
        //Setup question boxes and correct answer bubbles

        var randoms = getRanEvent(); //randoms[0] is category number, randoms[1] is event number
        var cat= categories[randoms[0]];
        var ranEvent= randoms[1];
        var questions = getQuestions(randoms[0]);
        var falseAnswersA=[];
        var falseAnswersB=[];


        $('#questionBox td').eq(0).html(questions[0]);
        $('#questionBox td').eq(2).html(questions[1]);

        if(followup){


                $("p.eventText").html(gameEvents["battles"][prevEvent].name + ": Set Two");

            if(questions[0]==="Loser:"){
                 $( "#a1" ).html(gameEvents.battles[prevEvent].result.loser);
                 falseAnswersA=genFalseAnswers(9,gameEvents.battles[prevEvent]);

            }
               
            else{
                $( "#a1" ).html(gameEvents.battles[prevEvent].result.victor);
                falseAnswersA=genFalseAnswers(8,gameEvents.battles[prevEvent]);
            }

            addFalseAnswers("#a", falseAnswersA)
            $( "#b1" ).html(gameEvents.battles[prevEvent].notables[Math.floor(Math.random()*gameEvents.battles[prevEvent].notables.length)]); 

            falseAnswersB = genFalseAnswers(3,gameEvents.battles[prevEvent]);
            addFalseAnswers("#b", falseAnswersB);
            followup=false;


        }
        else{


            $("p.eventText").html(gameEvents[cat][ranEvent].name);
        
            var theEvent = gameEvents[cat][ranEvent];

            if(cat==="battles"){ 


                $("p.eventText").html(gameEvents[cat][ranEvent].name); //Set event name at top
        
            
                $( "#a1" ).html(gameEvents[cat][ranEvent].year);

                falseAnswersA=genFalseAnswers(1, theEvent);
                addFalseAnswers("#a", falseAnswersA);
                
                $( "#b1" ).html(gameEvents[cat][ranEvent].location);
            
                falseAnswersB=genFalseAnswers(2, theEvent);
                addFalseAnswers("#b", falseAnswersB);
                followup=true;

             }
            else if(cat==="inventions"){
                $( "#a1" ).html(gameEvents[cat][ranEvent].year);
            
                falseAnswersA=genFalseAnswers(1, theEvent);
                addFalseAnswers("#a", falseAnswersA);
            
                $( "#b1" ).html(gameEvents[cat][ranEvent].significance);
            
                falseAnswersB=genFalseAnswers(4, theEvent);
                addFalseAnswers("#b", falseAnswersB);

            }
            else if(cat==="elections"){
                $( "#a1" ).html(gameEvents[cat][ranEvent].result);
            
                falseAnswersA=genFalseAnswers(10, theEvent);
                addFalseAnswers("#a", falseAnswersA);
                
                $( "#b1" ).html(gameEvents[cat][ranEvent].notables[Math.floor(Math.random()*gameEvents[cat][ranEvent].notables.length)]); 

                falseAnswersB=genFalseAnswers(5, theEvent);
                addFalseAnswers("#b", falseAnswersB);

            }
            else if(cat==="court"){
                $( "#a1" ).html(gameEvents[cat][ranEvent].year);
            
                falseAnswersA=genFalseAnswers(1, theEvent);
                addFalseAnswers("#a", falseAnswersA);
            
                $( "#b1" ).html(gameEvents[cat][ranEvent].ruling);
             
                falseAnswersB=genFalseAnswers(6, theEvent);
                addFalseAnswers("#b", falseAnswersB);

            }

            else if(cat==="other"){
                $( "#a1" ).html(gameEvents[cat][ranEvent].year);
             
                falseAnswersA=genFalseAnswers(1, theEvent);
                addFalseAnswers("#a", falseAnswersA);
             
                $( "#b1" ).html(gameEvents[cat][ranEvent].significance);
             
                falseAnswersB=genFalseAnswers(7, theEvent);
                addFalseAnswers("#b", falseAnswersB);

            }

            console.log(falseAnswersA.toString());
            console.log(falseAnswersB.toString());
            prevEvent= ranEvent;
            qSet++;

        }
        





        
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

       
        //$(".option").each(animateDiv);
        //console.log("MarginX " + marginX);
        //console.log("MarginY " + marginY);

        
    }
    else{
        toScore();
    }
}

function notUsed(potential, usedAnswers){
    for (var i=0;i<usedAnswers.length;i++){ 
        if(potential === usedAnswers[i]){
            return false;
        }
    }
    return true;
}

function addFalseAnswers(AorB, falseAnswers){ //Usage AorB = "#a" or "#b"
    var idStartNum = 2;
    var max = 3; //Number of false answers needed
    var x;
    var hideRemaining = false;

    for(idStartNum, x = 0; x <max; idStartNum++, x++){
        if(hideRemaining){ //Nothing left in array, hide rest of bubbles
            $(AorB+idStartNum).hide();
        }
        else if(falseAnswers[x] === -1){ //Code for nothing found
            $(AorB+idStartNum).hide();
            hideRemaining = true;
        }
        else{
            $(AorB+idStartNum).text(falseAnswers[x]);   
        }
    }
}

function getRanYear(){
    var category = Math.floor(Math.random()*4)+1; //Randomly pick from categories
    var index = Math.floor(Math.random()*gameEvents.battles.length);
    return gameEvents.battles[index].year;
    
    if(category === 1){ //Battle
        var index = Math.floor(Math.random()*gameEvents.battles.length);
        return gameEvents.battles[index].year;
    }
    else if(category === 2){ //Invention
        var index = Math.floor(Math.random()*gameEvents.inventions.length);
        return gameEvents.inventions[index].year;
    }

    else if(category === 3){ //Court Case
        var index = Math.floor(Math.random()*gameEvents.court.length);
        return gameEvents.court[index].year;
    }
    else if(category === 4){ //Other
        var index = Math.floor(Math.random()*gameEvents.other.length);
        return gameEvents.other[index].year;
    }
    
}

function getRanLocation(){
    var index = Math.floor(Math.random()*gameEvents.battles.length);
    return gameEvents.battles[index].location;
}

function getRanBatNotable(){
    var index = Math.floor(Math.random()*gameEvents.battles.length);
    var index2 = Math.floor(Math.random()*gameEvents.battles[index].notables.length);
    return gameEvents.battles[index].notables[index2];
}

function getRanInvSig(){
    var index = Math.floor(Math.random()*gameEvents.inventions.length);
    return gameEvents.inventions[index].significance;
}

function getRanElecNotable(){
    var index = Math.floor(Math.random()*gameEvents.elections.length);
    var index2 = Math.floor(Math.random()*gameEvents.elections[index].notables.length);
    return gameEvents.elections[index].notables[index2];
}

function getRanRuling(){
    var index = Math.floor(Math.random()*gameEvents.court.length);
    return gameEvents.court[index].ruling;
}

function getRanOtherSig(){
    var index = Math.floor(Math.random()*gameEvents.other.length);
    return gameEvents.other[index].significance;
}

function getRanVictorOrLoser(){
    var index = Math.floor(Math.random()*gameEvents.battles.length);
    var victorOrLoser = Math.floor(Math.random()*2)+1;
    if(victorOrLoser===1){
        return gameEvents.battles[index].result.victor;
    }
    else{
        return gameEvents.battles[index].result.loser;
    }
}

function getRanElecResult(){
    var index = Math.floor(Math.random()*gameEvents.elections.length);
    return gameEvents.elections[index].result;
}

function getFallbackFact(){
    var category = Math.floor(Math.random()*5)+1; //Randomly pick from categories
    
    if(category === 1){ //Battle
        return getRanBatNotable();
    }
    else if(category === 2){ //Invention
        return getRanInvSig();
    }
    else if(category === 3){ //Election
        return getRanElecNotable();
    }
    else if(category === 4){ //Court Case
        return getRanRuling();
    }
    else if(category === 5){ //Other
        return getRanOtherSig();
    }
}


