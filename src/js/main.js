var draw = (function(){

    //Get the height and width of the main element.
    var mWidth = document.querySelector('main').offsetWidth;
    var mHeight = document.querySelector('main').offsetHeight;

    //Create the canvas
    var canvas = document.createElement('canvas');

    //create the context
    var ctx = canvas.getContext('2d');

    //Create the initial bounding rectangle
    var rect = canvas.getBoundingClientRect();

    //current x,y position
    var x = 0;
    var y = 0;

    //start x,y position
    var x1 = 0;
    var y1 = 0;

    //end x,y position
    var x2 = 0;
    var y2 = 0;

    //previous x,y
    var lx=0;
    var ly=0;

    //set the shape to be drawn
    var shape='';

    //Does the user want to draw?
    var isDrawing=false;

    //stroke color
    var stroke='';

    //fill color
    var fill='';

    //3 point variables
    var points = [];
    var i = 0;

    //Tracking
    var stack = [];

    return {
        //Returns a random color
        randColor: function(){
            return '#' + Math.floor(Math.random()*16777215).toString(16);
        },

        //A setter for stroke
        setStrokeColor: function(color){
            stroke = color;
        },

        //A setter for fill
        setFillColor: function(color){
            fill = color;
        },

        //A getter for stroke
        getStrokeColor: function(){

            if(stroke.length > 6){
                return stroke;
            }

            return this.randColor();
        },

        //A getter for fill
        getFillColor: function(){

            if(fill.length > 6){
                return fill;
            }

            return this.randColor();
        },

        //Draw a three point triangle
        setPoint: function(){

            points[i]=[];
            points[i]['x']=x;
            points[i]['y']=y;

            if(points.length>2){
                this.draw();
                i=0;
                points=[];
            }else{
                i++;
            }
            
        },

        //Set the x,y cords based on current event data
        setXY: function(evt){
            //Track the last x,y position
            lx=x;
            ly=y;

            //set the current x,y position
            x = (evt.clientX - rect.left) - canvas.offsetLeft;
            y = (evt.clientY - rect.top) - canvas.offsetTop;
        },

        //Write the x,y cords based on current event data
        writeXY: function(){
            document.getElementById('trackX').innerHTML = 'X: ' + x;
            document.getElementById('trackY').innerHTML = 'Y: ' + y;
        },

        //Setter for isDrawing
        setIsDrawing: function(bool){
            isDrawing = bool;
        },

        //Getter for isDrawing
        getIsDrawing: function(){
            return isDrawing;
        },

        //Sets the shape to be drawn
        setShape: function(shp){
            shape = shp;
        },

        //Set x1,y1
        setStart: function(){
            x1=x;
            y1=y;
        },

        //Set x2,y2
        setEnd: function(){
            x2=x;
            y2=y;
        },

        //Access the canvas
        getCanvas: function(){
            return canvas;
        },

        //Get the current shape
        getShape: function(){
            return shape;
        },

        //Draws the selected shape
        draw: function(){
            ctx.restore();
            if(shape==='rectangle'){
                this.drawRect();
            }else if(shape==='line'){
                this.drawLine();
            }else if(shape==='circle'){
                this.drawCircle();
            }else if(shape==='path'){
                this.drawPath();
            }else if(shape==='triangle'){
                this.drawTriangle();
            }else if(shape==='3-point'){
                this.draw3Point();
            }else{
                alert('Please choose a shape');
            }
            ctx.save();
        },

        //Draw a line
        drawLine: function(){
            ctx.strokeStyle = this.getStrokeColor();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            stack.push({
                'shape': 'line',
                'cords': {
                    'x1': x1,
                    'y1': y1,
                    'x2': x2,
                    'y2': y2
                },
                'styles': {
                    'stroke': ctx.strokeStyle
                }
            });
        },

        //Draw a rectangle
        drawRect: function(){
            ctx.fillStyle = this.getFillColor();
            ctx.strokeStyle = this.getStrokeColor();
            ctx.fillRect(x1, y1, (x2-x1), (y2-y1));
            ctx.strokeRect(x1, y1, (x2-x1), (y2-y1));

            stack.push({
                'shape':'rectangle',
                'cords':{
                    'x1': x1,
                    'y1': y1,
                    'x2': x2,
                    'y2': y2
                },
                'styles': {
                    'stroke': ctx.strokeStyle,
                    'fill': ctx.fillStyle
                }
            });
        },

        //Draw a circle
        drawCircle: function(){
            ctx.fillStyle = this.getFillColor();
            ctx.strokeStyle = this.getStrokeColor();

            ctx.beginPath();

            var a = (x1-x2);
            var b = (y1-y2);
            radius = Math.sqrt(a*a+b*b);
            ctx.arc(x1, y1, radius, 0, 2*Math.PI);
            ctx.stroke();
            ctx.fill();

            stack.push({
                'shape': 'circle',
                'cords': {
                    'x1': x1,
                    'y1': y1,
                    'x2': x2,
                    'y2': y2,
                    'r' : radius
                },
                'styles': {
                    'stroke': ctx.strokeStyle,
                    'fill': ctx.fillStyle
                }
            });
        },

        //Draw a path during a drag event
        drawPath: function(){
            ctx.strokeStyle = this.getStrokeColor();
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(x, y);
            ctx.stroke();

            stack.push({
                'shape': 'path',
                'cords': {
                    'lx': lx,
                    'ly': ly,
                    'x': x,
                    'y': y,

                },
                'styles': {
                    'stroke': ctx.strokeStyle
                }
            });
        },

        //Draw a triangle
        drawTriangle: function(){

            var a = (x1-x2);
            var b = (y1-y2);
            var c = Math.sqrt(a*a + b*b);

            var d = x1+c;
            var e = y1+c;

            //Drag left to right
            if(x1>x2){
                d=x1-c;
            }

            //Drag up
            if(y1>y2){
                e=y1-c;
            }
        
            ctx.fillStyle = this.getFillColor();
            ctx.strokeStyle = this.getStrokeColor();
            ctx.beginPath();
            ctx.moveTo(x1, y1);

            ctx.lineTo(d,e);
            ctx.lineTo(x2, y2);

            ctx.lineTo(x1, y1);
            ctx.stroke();
            ctx.fill();

            stack.push({
                'shape': 'triangle',
                'cords': {
                    'x1': x1,
                    'y1': y1,
                    'x2': x2,
                    'y2': y2
                },
                'styles': {
                    'stroke': ctx.strokeStyle,
                    'fill': ctx.fillStyle
                }
            });
        },

        //Draw a triangle
        draw3Point: function(){

            ctx.fillStyle = this.getFillColor();
            ctx.strokeStyle = this.getStrokeColor();

            ctx.beginPath();

            ctx.moveTo(points[0]['x'], points[0]['y']);
            ctx.lineTo(points[1]['x'], points[1]['y']);
            ctx.lineTo(points[2]['x'], points[2]['y']);
            ctx.lineTo(points[0]['x'], points[0]['y']);

            ctx.stroke();
            ctx.fill();

            stack.push({
                'shape': '3-point',
                'cords': {
                    'points': points
                },
                'styles': {
                    'stroke': ctx.strokeStyle,
                    'fill': ctx.fillStyle
                }
            });
        },

        clear: function(){
            ctx.clearRect(0, 0, mHeight, mWidth);
        },

        redraw: function(){

            for(item in stack){
                //console.log(stack[item].shape);
                switch(stack[item].shape){

                    case 'path':
                        shape=stack[item].shape;
                        lx = stack[item].cords.lx;
                        ly = stack[item].cords.ly;
                        x = stack[item].cords.x;
                        y = stack[item].cords.y;
                        ctx.strokeStyle = stack[item].styles.stroke;
                        break;

                    case 'circle':
                    case 'line':
                    case 'rectangle':
                    case 'triangle':
                        shape=stack[item].shape;
                        x1 = stack[item].cords.x1;
                        y1 = stack[item].cords.y1;
                        x2 = stack[item].cords.x2;
                        y2 = stack[item].cords.y2;
                        ctx.strokeStyle = stack[item].styles.stroke;
                        ctx.fillStyle = stack[item].styles.fill;
                        break;

                    case '3-point':
                        shape=stack[item].shape;
                        points = stack[item].cords.points;
                        ctx.strokeStyle = stack[item].styles.stroke;
                        ctx.fillStyle = stack[item].styles.fill;
                        break;
                }



                this.draw();
            }

        },

        //Initialize the object, this must be called before anything else
        init: function(){
            canvas.width = mWidth;
            canvas.height = mHeight;
            document.querySelector('main').appendChild(canvas);
        }
    }

})();

//Initialize draw
draw.init();

draw.getCanvas().addEventListener('mousemove', function(evt){
    draw.setXY(evt);
    draw.writeXY();

    if(draw.getShape()==='path' && draw.getIsDrawing()===true){
        draw.draw();
    }

});

draw.getCanvas().addEventListener('mousedown', function(){
    if(draw.getShape()!=='3-point'){
        draw.setStart();
        draw.setIsDrawing(true);
    }
});

draw.getCanvas().addEventListener('mouseup', function(){
    if(draw.getShape()!=='3-point'){
        draw.setEnd();
        draw.draw();
        draw.setIsDrawing(false);
    }
});

draw.getCanvas().addEventListener('mouseup', function(){
    if(draw.getShape()==='3-point'){
        draw.setPoint();
    }
});

document.getElementById('btnRect').addEventListener('click', function(){
    draw.setShape('rectangle');
});

document.getElementById('btnLine').addEventListener('click', function(){
    draw.setShape('line');
});

document.getElementById('btnCircle').addEventListener('click', function(){
    draw.setShape('circle');
});


document.getElementById('btnPath').addEventListener('click', function(){
    draw.setShape('path');
});

document.getElementById('btnTriangle').addEventListener('click', function(){
    draw.setShape('triangle');
});

document.getElementById('btn3Point').addEventListener('click', function(){
    draw.setShape('3-point');
});

document.getElementById('strokeColor').addEventListener('change', function(){
    draw.setStrokeColor(document.getElementById('strokeColor').value);
});

document.getElementById('randStrokeColor').addEventListener('change', function(){
    draw.setStrokeColor('');
});

document.getElementById('fillColor').addEventListener('change', function(){
    draw.setFillColor(document.getElementById('fillColor').value);
});

document.getElementById('randFillColor').addEventListener('change', function(){
    draw.setFillColor('');
});

document.getElementById('btnClear').addEventListener('click', function(){
    draw.clear();
});

document.getElementById('btnRedraw').addEventListener('click', function(){
    draw.redraw();
});

