var dominos = [];
var iterationCounter = 0;

const EMPTY_CELL = 0;
const DIRECTION_EAST = 1;
const DIRECTION_WEST = 2;
const DIRECTION_NORTH = 3;
const DIRECTION_SOUTH = 4;

function next(){
	deleteDominos();
	slideDominos();
	createDominos();
	draw();
}

function init(){
	dominos = [];
	iterationCounter = 0;
	fill(0, 0);
	draw();
}

// Fill randomly a 2x2 cell with dominos
function fill(i, j){
	var splitDirection = Math.round(Math.random());
	if(splitDirection == 0){
		// Vertical Split
		dominos.push({
			x: i,
			y: j,
			direction: DIRECTION_WEST
		});
		dominos.push({
			x: i + 1,
			y: j,
			direction: DIRECTION_EAST
		});
	}else{
		// Horizontal Split
		dominos.push({
			x: i,
			y: j,
			direction: DIRECTION_SOUTH
		});
		dominos.push({
			x: i,
			y: j + 1,
			direction: DIRECTION_NORTH
		});
	}
}

// Deletes the pairs of dominos with opposite directions (will collide).
function deleteDominos(){
	// O(n log n)
	dominos.sort(function(a, b){
		if(a.x != b.x) return a.x - b.x;
		else return a.y - b.y;
	});
	for(var i = 0; i < dominos.length - 1; i++){
		var domino1 = dominos[i];
		var domino2 = dominos[i + 1];
		if(domino1.direction == DIRECTION_NORTH && domino2.direction == DIRECTION_SOUTH && domino1.x == domino2.x && domino1.y + 1 == domino2.y){
			dominos.splice(i, 2);
			i--;
		}
	}
	
	dominos.sort(function(a, b){
		if(a.y != b.y) return a.y - b.y;
		else return a.x - b.x;
	});
	for(var i = 0; i < dominos.length - 1; i++){
		var domino1 = dominos[i];
		var domino2 = dominos[i + 1];
		if(domino1.direction == DIRECTION_EAST && domino2.direction == DIRECTION_WEST && domino1.x + 1 == domino2.x && domino1.y == domino2.y){
			dominos.splice(i, 2);
			i--;
		}
	}
	
	// O(n^2)
	/*var i = 0;
	while(i < dominos.length){
		var deleted = false;
		for(var j = i + 1; j < dominos.length; j++){
			var domino1 = dominos[i];
			var domino2 = dominos[j];
			if(domino2.direction == DIRECTION_WEST || domino2.direction == DIRECTION_NORTH){
				domino1 = dominos[j];
				domino2 = dominos[i];
			}
			if((domino1.direction == DIRECTION_WEST && domino2.direction == DIRECTION_EAST && domino1.x == domino2.x + 1 && domino1.y == domino2.y) ||
				(domino1.direction == DIRECTION_NORTH && domino2.direction == DIRECTION_SOUTH && domino1.x == domino2.x && domino1.y + 1 == domino2.y) ){
				// Remove dominos from the list
				dominos.splice(j, 1);
				dominos.splice(i, 1);
				deleted = true;
				break;
			}
		}
		
		if(!deleted){
			i++;
		}
	}*/
	draw();
}

// Move the dominos according to their directions.
function slideDominos(){
	var n = dominos.length;
	for(var i = 0; i < n; i++){
		domino = dominos[i];
		switch(domino.direction){
			case DIRECTION_EAST:
				domino.x++;
				break;
			case DIRECTION_WEST:
				domino.x--;
				break;
			case DIRECTION_NORTH:
				domino.y++;
				break;
			case DIRECTION_SOUTH:
				domino.y--;
				break;
		}
	}
	draw();
}

// Fill the empty spaces with dominos.
function createDominos(){
	iterationCounter++;

	// O(n^2)
	// Initialize isEmpty
	var isEmpty = [];
	for(var x = 0; x <= 2 * iterationCounter + 2; x++){
		isEmpty.push([]);
		for(var y = 0; y <= 2 * iterationCounter + 2; y++){
			isEmpty[x].push(false);
		}
	}
	// Define aztec diamond cells
	for(var x = -iterationCounter; x <= iterationCounter + 2; x++){
		for(var y = -iterationCounter; y <= iterationCounter + 2; y++){
			if(-iterationCounter <= x + y && x + y <= iterationCounter + 1 &&
				-iterationCounter <= x - y && x - y <= iterationCounter + 1){
				isEmpty[x + iterationCounter][y + iterationCounter] = true;
			}
		}
	}
	// Fill isEmpty with false where exist dominos
	var n = dominos.length;
	for(var i = 0; i < n; i++){
		var domino = dominos[i];
		switch(domino.direction){
			case DIRECTION_NORTH:
			case DIRECTION_SOUTH:
				isEmpty[domino.x + iterationCounter][domino.y + iterationCounter] = false;
				isEmpty[domino.x + iterationCounter + 1][domino.y + iterationCounter] = false;
				break;
			case DIRECTION_EAST:
			case DIRECTION_WEST:
				isEmpty[domino.x + iterationCounter][domino.y + iterationCounter] = false;
				isEmpty[domino.x + iterationCounter][domino.y + iterationCounter + 1] = false;
				break;
		}
	}
	// Fill empty cell in auxmat with dominos
	for(var x = -iterationCounter; x <= iterationCounter + 1; x++){
		for(var y = -iterationCounter; y <= iterationCounter + 1; y++){
			if(isEmpty[x + iterationCounter][y + iterationCounter]){
				fill(x, y);
				isEmpty[x + iterationCounter][y + iterationCounter] = false;
				isEmpty[x + iterationCounter][y + iterationCounter + 1] = false;
				isEmpty[x + iterationCounter + 1][y + iterationCounter] = false;
				isEmpty[x + iterationCounter + 1][y + iterationCounter + 1] = false;
			}
		}
	}

	// O(n^3)
	/*
	// For each position in Aztec Diamond,
	for(var x = -iterationCounter; x <= iterationCounter + 1; x++){
		for(var y = -iterationCounter; y <= iterationCounter + 1; y++){
			if(-iterationCounter <= x + y && x + y <= iterationCounter + 1 &&
				-iterationCounter <= x - y && x - y <= iterationCounter + 1){
				
				// Verify if is empty cell
				var existDomino = false;
				var n = dominos.length;
				for(var i = 0; i < n; i++){
					var domino = dominos[i];
					if(domino.direction == DIRECTION_NORTH || domino.direction == DIRECTION_SOUTH){
						if((x == domino.x || x == domino.x + 1) && y == domino.y){
							existDomino = true;
							break;
						}
					}else{
						if(x == domino.x && (y == domino.y || y == domino.y + 1)){
							existDomino = true;
							break;
						}
					}
				}
				
				// If is an empty cell, fill randomly with dominos.
				if(!existDomino){
					fill(x, y);
				}
			}
		}
	}*/
	draw();
}

// Auto step button :D
var autoStepCounter = 0;
function autoStep(){
	switch(autoStepCounter){
		case 0:
			deleteDominos();
			document.getElementById("buttonAutostep").innerHTML = "AutoStep 2: Slide ";
			break;
		case 1:
			slideDominos();
			document.getElementById("buttonAutostep").innerHTML = "AutoStep 3: Create";
			break;
		case 2:
			createDominos();
			document.getElementById("buttonAutostep").innerHTML = "AutoStep 1: Delete";
			break;
	}
	autoStepCounter = (autoStepCounter + 1) % 3;
}

