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
	var i = 0;
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
	}
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
	}
	draw();
}