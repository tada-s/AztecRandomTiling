let globalDominoIdSequence = 1;


function updateAztecDiamondSvg(svgElement, aztecDiamond) {
	const { width, height } = svgElement.getBoundingClientRect();

	const svg = d3.select(svgElement);

	// Smooth linear transition
	const transition = d3.transition()
		.duration(100)
		.ease(d3.easeLinear);

	// `<group>` that contains the Aztec Diamond
	const aztecDiamondGroup = (!svg.select("g.aztecDiamond").empty() ? svg.select("g.aztecDiamond") : (
		svg.append("g").attr("class", "aztecDiamond").attr("transform", `translate(${width / 2}, ${height / 2})`)
	));

	// Scale the Aztec Diamond to fit in the svg
	const initialScale = 16;
	const diamondSize = aztecDiamond.order * 2 * initialScale;
	const scale = initialScale / (Math.max(Math.min(width, height), diamondSize) / Math.min(width, height));
	svg.selectAll("g.aztecDiamond").transition(transition).attr("transform", `translate(${width / 2}, ${height / 2}) scale(${scale})`);

	// Attributes of `<rect>` of an invisible domino
	function setInvisibleDominoAttributes(rect) {
		return rect
			.attr("x", domino => getDominoRectX(domino) + .5)
			.attr("y", domino => getDominoRectY(domino) + .5)
			.attr("width", domino => 0)
			.attr("height", domino => 0)
			.style("opacity", 0);
	}

	// Attributes of `<rect>` of a visible domino
	function setVisibleDominoAttributes(rect) {
		return rect
			.attr("x", domino => getDominoRectX(domino))
			.attr("y", domino => getDominoRectY(domino))
			.attr("width", domino => getDominoRectWidth(domino))
			.attr("height", domino => getDominoRectHeight(domino))
			.style("opacity", 1);
	}

	// Set `domino.id` for D3 join key.
	for (const domino of aztecDiamond.dominoesMap.values()) {
		if (!domino.id) {
			domino.id = globalDominoIdSequence++;
		}
	}

	// Join `<rect>` elements by `domino.id`
	aztecDiamondGroup.selectAll("rect")
		.data([...aztecDiamond.dominoesMap.values()], domino => domino.id)
		.join(
			enter => enter.append("rect")
				// Set color
				.attr("fill", domino => getDominoRectColor(domino))
				// Transition from invisible to visible
				.call((rect, domino) => setInvisibleDominoAttributes(rect, domino))
				.transition(transition)
				.call((rect, domino) => setVisibleDominoAttributes(rect, domino)),
			update => update
				// Transition movement
				.transition(transition)
				.attr("x", domino => getDominoRectX(domino))
				.attr("y", domino => getDominoRectY(domino)),
			exit => exit
				// Transition from visible to invisible
				.transition(transition)
				.call((rect, domino) => setInvisibleDominoAttributes(rect, domino))
				// And delete
				.remove()
		);
}


function getDominoRectX(domino) {
	switch (domino.direction) {
		case Direction.EAST:
		case Direction.WEST:
			return domino.position[0];
		case Direction.NORTH:
		case Direction.SOUTH:
			return domino.position[0] - 1;
	}
}


function getDominoRectY(domino) {
	switch (domino.direction) {
		case Direction.EAST:
		case Direction.WEST:
			return - domino.position[1] - 1;
		case Direction.NORTH:
		case Direction.SOUTH:
			return - domino.position[1] - 1;
	}
}


function getDominoRectWidth(domino) {
	switch (domino.direction) {
		case Direction.EAST:
		case Direction.WEST:
			return 1;
		case Direction.NORTH:
		case Direction.SOUTH:
			return 2;
	}
}


function getDominoRectHeight(domino) {
	switch (domino.direction) {
		case Direction.EAST:
		case Direction.WEST:
			return 2;
		case Direction.NORTH:
		case Direction.SOUTH:
			return 1;
	}
}


function getDominoRectColor(domino) {
	switch (domino.direction) {
		case Direction.EAST:
			return "#FF0000";
		case Direction.WEST:
			return "#00FF00";
		case Direction.NORTH:
			return "#0000FF";
		case Direction.SOUTH:
			return "#FFFF00";
	}
}
