function draw(){
	var canvas = document.getElementById("canvas1");
	var ctx = canvas.getContext("2d");
	
	// Clear canvas
	ctx.fillStyle = "#000000";
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// Draw Dominos
	var offsetX = canvas.width / 2;
	var offsetY = canvas.height / 2;
	var dominoSize;
	if(document.getElementById("radioButton1").checked == true){
		dominoSize = 500 / (2 * (iterationCounter + 1));
	}else{
		dominoSize = document.getElementById("textbox1").value;
	}
	var n = dominos.length;
	for(var i = 0; i < n; i++){
		domino = dominos[i];
		switch(domino.direction){
			case DIRECTION_EAST:
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(offsetX + (domino.x - 0.5) * dominoSize, offsetY + (domino.y - 0.5) * dominoSize, dominoSize, 2 * dominoSize);
				break;
			case DIRECTION_WEST:
				ctx.fillStyle = "#00FF00";
				ctx.fillRect(offsetX + (domino.x - 0.5) * dominoSize, offsetY + (domino.y - 0.5) * dominoSize, dominoSize, 2 * dominoSize);
				break;
			case DIRECTION_NORTH:
				ctx.fillStyle = "#0000FF";
				ctx.fillRect(offsetX + (domino.x - 0.5) * dominoSize, offsetY + (domino.y - 0.5) * dominoSize, 2 * dominoSize, dominoSize);
				break;
			case DIRECTION_SOUTH:
				ctx.fillStyle = "#FFFF00";
				ctx.fillRect(offsetX + (domino.x - 0.5) * dominoSize, offsetY + (domino.y - 0.5) * dominoSize, 2 * dominoSize, dominoSize);
				break;
		}
	}
}