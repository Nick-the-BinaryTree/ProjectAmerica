var marginX = window.innerWidth/4;
var marginY = window.innerHeight/5;
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

$(document).ready(function(){
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
});

function setBlock(block) {
    var x = genX();
    var y = genY();
	
    $(block).css({
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

//http://codepen.io/anon/pen/myyzXV
/*
function animateDiv(){
    var newq = makeNewPosition();
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