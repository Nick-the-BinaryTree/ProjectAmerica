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
    console.log("MarginX " + marginX);
    console.log("MarginY " + marginY);
});

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