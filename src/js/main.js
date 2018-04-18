// Get the heigh and width of the main element.
var mWidth = document.querySelector('main').offsetWidth;
var mHeight = document.querySelector('main').offsetHeight;

// Create the canvas
var canvas = document.createElement('canvas');
canvas.height = mHeight;
canvas.width = mWidth;
document.querySelector('main').appendChild(canvas);

// Create the context
var ctx = canvas.getContext('2d');

// Draw some sample rectangles
ctx.fillStyle = 'rgb(200, 0, 0)';
ctx.fillRect(10,10,55,50);

ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
ctx.fillRect(30,30,55,50);

canvas.addEventListener('mousemove', function(evt){
    
    // Calculate the x,y cords.
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;

    //write the cords back to the UI
    document.getElementById('trackX').innerHTML = 'X: ' + x;
    document.getElementById('trackY').innerHTML = 'Y: ' + y;
}, false);