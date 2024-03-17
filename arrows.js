const arrows={
	N:"\u{21e9}",
	NE:"\u{2b0b}",
	E:"\u{21e6}",
	SE:"\u{2b09}",
	S:"\u{21e7}",
	SW:"\u{2b08}",
	W:"\u{21e8}",
	//W:"\u{2799}",
	NW:"\u{2b0a}",
	
}
const arrowFromDirection = (value)=>{
		if(value<22.5){return arrows["N"]}
		else if(value<77.5){return arrows["NE"]}
		else if(value<112.5){return arrows["E"]}
		else if(value<157.5){return arrows["SE"]}
		else if(value<202.5){return arrows["S"]}
		else if(value<247.5){return arrows["SW"]}
		else if(value<292.5){return arrows["W"]}
		else if(value<337.5){return arrows["NW"]}
		else {return arrows["N"]}

}
const sectorFromDirection = (value)=>{
		if(value<22.5){return "N"}
		else if(value<77.5){return "NE"}
		else if(value<112.5){return "E"}
		else if(value<157.5){return "SE"}
		else if(value<202.5){return "S"}
		else if(value<247.5){return "SW"}
		else if(value<292.5){return "W"}
		else if(value<337.5){return "NW"}
		else {return "N"}

}
//console.log(arrows)
module.exports={arrowFromDirection,sectorFromDirection}
