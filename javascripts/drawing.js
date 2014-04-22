function DrawingPad(width, height) {
    this.canvas;
    var canvas;
    var context;
    var canvasWidth = width;
    var canvasHeight = height;
    var padding = 25;
    var lineWidth = 8;
    var clickX = new Array();
    var clickY = new Array();
    var clickColor = new Array();
    var clickTool = new Array();
    var clickSize = new Array();
    var clickDrag = new Array();
    var paint = false;
    var curColor = "#000000";
    var curTool = "marker";
    var curSize = "normal";
    
    var drawingAreaX = 100;
    var drawingAreaY = 25;
    var drawingAreaWidth = 150;
    var drawingAreaHeight = 100;
    
    var paletteAreaX = 2;
    var paletteAreaY = 2;
    var paletteAreaWidth = 80;
    var paletteAreaHeight = 200;
    var paletteAreaHorizontalBlock = 2;
    var paletteAreaVerticalBlock = 8;
    
    

    var colorMap = {
        white : "#FFFFFF",
        silver : "#C0C0C0",
        gray : "#808080",
        black : "#000000",
        
        red : "#FF0000",
        maroon : "#800000",
        yellow : "#FFFF00",
        olive : "#808000",
        
        lime : "#00FF00",
        green : "#008000",
        aqua : "#00FFFF",
        teal : "#008080",
        
        blue : "#0000FF",
        navy : "#000080",
        fuchsia : "#FF00FF",
        purple : "#800080"
    };

    var colorArray = ["#FFFFFF", "#C0C0C0", "#808080", "#000000",
                      "#FF0000", "#800000", "#FFFF00", "#808000",
                      "#00FF00", "#008000", "#00FFFF", "#008080",
                      "#0000FF", "#000080", "#FF00FF", "#800080"];
    
};


    this.init = function prepareCanvas()
    {
        // Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
        var canvasDiv = document.getElementById('canvasDiv');
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);
        canvas.setAttribute('id', 'canvas');
        canvasDiv.appendChild(canvas);
        if(typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        context = canvas.getContext("2d"); // Grab the 2d canvas context
        
        redraw();

        // Add mouse events
        // ----------------
        $('#canvas').mousedown(function(e)
        {
            var offset = $(this).offset();
            var mouseX = e.pageX - offset.left;
            var mouseY = e.pageY - offset.top;
            
            if(mouseX > paletteAreaX && mouseX < paletteAreaX + paletteAreaWidth && mouseY > paletteAreaY && mouseY < paletteAreaY + paletteAreaHeight) // Left of the drawing area
            {
                var row = Math.floor((mouseY - paletteAreaY) / (paletteAreaHeight / paletteAreaVerticalBlock));
                var column = Math.floor((mouseX - paletteAreaX) / (paletteAreaWidth / paletteAreaHorizontalBlock));
                curColor = colorArray[column * 8 + row];
                
            }
            else if(mouseX > drawingAreaX + drawingAreaWidth) // Right of the drawing area
            {
                
            }
            else if(mouseY > drawingAreaY && mouseY < drawingAreaY + drawingAreaHeight)
            {
                // Mouse click location on drawing area
                paint = true;
                addClick(mouseX, mouseY, false);
                redraw();
            }
            
            
        });
        
        $('#canvas').mousemove(function(e){
            if(paint==true){
                var offset = $(this).offset();
                var mouseX = e.pageX - offset.left;
                var mouseY = e.pageY - offset.top;
                addClick(mouseX, mouseY, true);
                redraw();
            }
        });
        
        $('#canvas').mouseup(function(e){
            paint = false;
            redraw();
        });
        
        $('#canvas').mouseleave(function(e){
            paint = false;
        });
    }

    /**
    * Adds a point to the drawing array.
    * @param x
    * @param y
    * @param dragging
    */
    function addClick(x, y, dragging)
    {
        clickX.push(x);
        clickY.push(y);
        clickTool.push(curTool);
        clickColor.push(curColor);
        clickSize.push(curSize);
        clickDrag.push(dragging);
    }

    

   
};


/**
 * Redraws the canvas.
 */
DrawingPad.prototype.redraw = function(){
     this.clear();
     
     // Draw Palette
     context.beginPath();
     context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
     context.lineWidth = 3;
     context.strokeStyle = 'black';
     context.stroke();
     
     context.beginPath();
     context.rect(0, 0, canvasWidth, canvasHeight);
     context.lineWidth = 3;
     context.strokeStyle = 'black';
     context.stroke();
     
     // Draw Palette
     var i = 0;
     var locX = paletteAreaX;
     var locY = paletteAreaY;
     var sizeX = paletteAreaWidth / paletteAreaHorizontalBlock;
     var sizeY = paletteAreaHeight / paletteAreaVerticalBlock;
     for (color in colorArray) {
         context.fillStyle = colorArray[color];
         context.fillRect (locX, locY, sizeX, sizeY);
         i++;
         locY += sizeY;
         if (i >= 8) {
             locX += sizeX;
             locY = paletteAreaY;
             i = 0;
         }
     }
     
     if(curSize == "small"){
         locX = 467;
     }else if(curSize == "normal"){
         locX = 450;
     }else if(curSize == "large"){
         locX = 428;
     }else if(curSize == "huge"){
         locX = 399;
     }
     locY = 189;
     context.beginPath();
     context.rect(locX, locY, 2, 12);
     context.closePath();
     context.fillStyle = '#333333';
     context.fill(); 
     
     // Keep the drawing in the drawing area
     context.save();
     context.beginPath();
     context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
     context.clip();
         
     var radius;
     for(var i = 0; i < clickX.length; i++)
     {       
         if(clickSize[i] == "small"){
             radius = 2;
         }else if(clickSize[i] == "normal"){
             radius = 5;
         }else if(clickSize[i] == "large"){
             radius = 10;
         }else if(clickSize[i] == "huge"){
             radius = 20;
         }else{
             alert("Error: Radius is zero for click " + i);
             radius = 0; 
         }
         
         context.beginPath();
         if(clickDrag[i] && i){
             context.moveTo(clickX[i-1], clickY[i-1]);
         }else{
             context.moveTo(clickX[i], clickY[i]);
         }
         context.lineTo(clickX[i], clickY[i]);
         context.closePath();
         
         if(clickTool[i] == "eraser"){
             //context.globalCompositeOperation = "destination-out"; // To erase instead of draw over with white
             context.strokeStyle = 'white';
         }else{
             //context.globalCompositeOperation = "source-over"; // To erase instead of draw over with white
             context.strokeStyle = clickColor[i];
         }
         context.lineJoin = "round";
         context.lineWidth = radius;
         context.stroke();
         
     }
     //context.globalCompositeOperation = "source-over";// To erase instead of draw over with white
     context.restore();
     
     
     context.globalAlpha = 1; // No IE support
     
 };

/**
 * Clears the canvas.
 */
DrawingPad.prototype.clear = function(){
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
}

