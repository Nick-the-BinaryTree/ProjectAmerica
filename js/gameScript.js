
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

//current game's categories
var categories=[];

//questions that have been asked
var askedQuestions =[];

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
    //reminder from Komal to Komal to fix drag destroy at some point
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
            console.log(newCopy);
    
        gameEvents = newCopy;
        }
    });
}

//returns [category random number, event random number]
function getRanEvent(){
    var ranCategory = Math.floor(Math.random() * categories.length);
    var category = categories[ranCategory];
    var ranEvent = Math.floor(Math.random() * gameEvents[category].length);

    while(alreadyAsked(gameEvents[category][ranEvent].name)){
        ranCategory = Math.floor(Math.random() * categories.length);
        category = categories[ranCategory];
        ranEvent = Math.floor(Math.random() * gameEvents[category].length);
    }

    askedQuestions.push(gameEvents[category][ranEvent].name);

    return [ranCategory,ranEvent];

}

function alreadyAsked(event){

    for(var i=0; i<alreadyAsked.length;i++){
        if(alreadyAsked[i]===event){
            return true;
        }
    }
    return false;
}

function getQuestions(ranCategory){

    //follow up questions not yet implemented
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
        return ["Year:","Ruling:"];
        
        
    }
    else if(categories[ranCategory]==="other"){
        return ["Year:","Significance:"]
       
    }

}
//Correct is the current event whose information is correct for all questions
//Types are ints that specify what kind of false answers to generate
//1 is year, 2 is location, 3 is battle notable, 4 is invention significance, 5 is election notable, 6 is court ruling, 7 is other significance

function genFalseAnswers(questionType){
    var usedAnswers=[];
    var numFalse = 3;
    var timeout = 0;
    var timeoutFallback = 1000;
    var timeoutMax = 1500;
    
    if(questionType === 1){ //Year (Works for any type)
        
        usedAnswers.push(correct.year);
            
        while(usedAnswers.length < numFalse){
            
            var potential = getRanYear();
            
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
            
            timeout++;
            
            if(timeout>timeoutMax){ //If nothing was found in a large number of searches, hide the bubble
                usedAnswers.push(-1);  //Bubble hiding code
                break;
            }
        }
        
        var falseAnswers = usedAnswers.splice(1,usedAnswers.length); //Removes first element (correct answer)
        
        return falseAnswers;
    }
    else if(questionType === 2){ //Location (Only called for battles)
        usedAnswers.push(correct.location);
            
        while(usedAnswers.length < numFalse){
                
            var potential = getRanLocation();
                
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
                
            timeout++;
                
            if(timeout>timeoutMax){
                usedAnswers.push(-1); 
                break;
            }
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
    else if(questionType === 3){ //Battle notable fact
        usedAnswers.concact(correct.notables);
            
        while(usedAnswers.length < numFalse){
                
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
                
            if(timeout>timeoutMax){
                usedAnswers.push(-1); 
                break;
            }
        }
        
        var falseAnswers = usedAnswers.splice(correct.notables.length-1, usedAnswers.length); //Remove correct notable facts from array
        
        return falseAnswers;
    }
    else if(questionType === 4){ //Invention significance
        usedAnswers.push(correct.significance);
            
        while(usedAnswers.length < numFalse){
                        
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
                
            if(timeout>timeoutMax){
                usedAnswers.push(-1); 
                break;
            }
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
    else if(questionType === 5){ //Election notable
        usedAnswers.concact(correct.notables);
            
        while(usedAnswers.length < numFalse){
                
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
                
            if(timeout>timeoutMax){
                usedAnswers.push(-1); 
                break;
            }
        }
        
        var falseAnswers = usedAnswers.splice(correct.notables.length-1, usedAnswers.length);
        
        return falseAnswers;
    }
    else if(questionType === 6){ //Court ruling
        usedAnswers.push(correct.ruling);
            
        while(usedAnswers.length < numFalse){
                
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
                
            if(timeout>timeoutMax){
                usedAnswers.push(-1); 
                break;
            }
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
    else if(questionType === 7){ //Other significance
        usedAnswers.push(correct.significance);
            
        while(usedAnswers.length < numFalse){
                
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
                
            if(timeout>timeoutMax){
                usedAnswers.push(-1); 
                break;
            }
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
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
        
        
        //Put name of event at top
        //Setup question boxes and correct answer bubbles
        

//1 is year, 2 is location, 3 is battle notable, 4 is invention significance, 5 is election notable, 6 is court ruling, 7 is other significance
        var randoms = getRanEvent(); //randoms[0] is category number, randoms[1] is event number
        var cat= categories[randoms[0]];
        var  ranEvent= randoms[1];
        var questions = getQuestions(randoms[0]);
        var falseAnswers1=[];
        var falseAnswers2=[];

        $('#questionBox td').eq(0).html(questions[0]);
        $('#questionBox td').eq(2).html(questions[1]);
        $("p.eventText").html(gameEvents[cat][ranEvent].name);
        if(cat==="battles"){
            $( "#a1" ).html(gameEvents[cat][ranEvent].year);
            falseAnswers1=genFalseAnswers(1);
            $( "#b1" ).html(gameEvents[cat][ranEvent].location);
            falseAnswers2=genFalseAnswers(2);

        }
        else if(cat==="inventions"){
            $( "#a1" ).html(gameEvents[cat][ranEvent].year);
            falseAnswers1=genFalseAnswers(1);
            $( "#b1" ).html(gameEvents[cat][ranEvent].significance);
            falseAnswers2=genFalseAnswers(4);

        }
        else if(cat==="elections"){
            $( "#a1" ).html(gameEvents[cat][ranEvent].result);
            $( "#b1" ).html(gameEvents[cat][ranEvent].notables[0]); //TO BE RANDOMIZEd

        }
         else if(cat==="court"){
            $( "#a1" ).html(gameEvents[cat][ranEvent].result);
            $( "#b1" ).html(gameEvents[cat][ranEvent].ruling);

        }

         else if(cat==="other"){
            $( "#a1" ).html(gameEvents[cat][ranEvent].year);
            $( "#b1" ).html(gameEvents[cat][ranEvent].significance);

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

function notUsed(potential, usedAnswers){
    for (var used of usedAnswers){      
        if(potential === used){
            return false;
        }
    }
    return true;
}

function getRanYear(){
    var category = Math.floor(Math.random()*5)+1; //Randomly pick from categories
    
    if(category === 1){ //Battle
        var index = Math.floor(Math.random()*gameEvents.battles.length)+1;
        return gameEvents.battles[index].year;
    }
    else if(type === 2){ //Invention
        var index = Math.floor(Math.random()*gameEvents.inventions.length)+1;
        return gameEvents.inventions[index].year;
    }
    else if(type === 3){ //Election
        var index = Math.floor(Math.random()*gameEvents.elections.length)+1;
        return gameEvents.elections[index].year;
    }
    else if(type === 4){ //Court Case
        var index = Math.floor(Math.random()*gameEvents.court.length)+1;
        return gameEvents.court[index].year;
    }
    else if(type === 5){ //Other
        var index = Math.floor(Math.random()*gameEvents.other.length)+1;
        return gameEvents.other[index].year;
    }
}

function getRanLocation(){
    var index = Math.floor(Math.random()*gameEvents.battles.length)+1;
    return gameEvents.battles[index].location;
}

function getRanBatNotable(){
    var index = Math.floor(Math.random()*gameEvents.battles.length)+1;
    var index2 = Math.floor(Math.random()*gameEvents.battles.notables.length);
    return gameEvents.battles[index].notables[index2];
}

function getRanInvSig(){
    var index = Math.floor(Math.random()*gameEvents.inventions.length)+1;
    return gameEvents.inventions[index].significance;
}

function getRanElecNotable(){
    var index = Math.floor(Math.random()*gameEvents.elections.length)+1;
    var index2 = Math.floor(Math.random()*gameEvents.elections.notables.length);
    return gameEvents.elections[index].notables[index2];
}

function getRanRuling(){
    var index = Math.floor(Math.random()*gameEvents.court.length)+1;
    return gameEvents.court[index].ruling;
}

function getRanOtherSig(){
    var index = Math.floor(Math.random()*gameEvents.other.length)+1;
    return gameEvents.other[index].significance;
}

function fallBackFacts(){
    var category = Math.floor(Math.random()*5)+1; //Randomly pick from categories
    
    if(category === 1){ //Battle
        return getRanBatNotable();
    }
    else if(type === 2){ //Invention
        return getRanInvSig();
    }
    else if(type === 3){ //Election
        return getRanElecNotable();
    }
    else if(type === 4){ //Court Case
        return getRanRuling();
    }
    else if(type === 5){ //Other
        return getRanOtherSig();
    }
}
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
