function getH() {
    return window.innerHeight - 25;
}

function getW() {
    return window.innerWidth;
}

//card ratio is 1.4
function getSlotSize() {
	var h = (getH()-12);
	var w = (getW()-112);
	if(w > h) {
		return {h:h/3,w: (h/3)-(h/3)*0.4 };
	} else {
		return {h:(w/3)*1.4 ,w: w/3 };
	}
}

function getSlotNumberFromPixel(x, y) {
    var s = getSlotSize();
    var slot = {};
    if(x < 0) x = 0;

    for(var i=0; i < 3; i++) {
        if((3*i) + (i*s.w) <= x) {
            slot.x = i;
        }
    }

    if(y <= getMid() - s.h/2 - 3) {
        slot.y = 0;
    } else if(y >= getMid() + s.h/2 + 3) {
        slot.y = 2;
    } else {
        slot.y = 1;
    }

    return slot;
}

function getMid() {
    return (getH())/2;
}

function getSlotPixelFromNumber(x, y) {
    var s = getSlotSize();
    var slot = {};
    slot.x = (x * s.w) + (3*x);
    
    if(y == 0) {
        slot.y = getMid() - (s.h*1.5) - 3;
    } else if( y == 1) {
        slot.y = getMid() - (s.h/2);
    } else {
        slot.y = getMid() + 3 + s.h/2;
    }
    return slot;
}

function drawGrid() {
    var s = getSlotSize();
    var canvas = document.getElementById("canvas");
    if(canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = '';
        ctx.canvas.width  = getW();
        ctx.canvas.height = getH();

        ctx.strokeStyle = '#e5e4e2';
        for(var i=0; i<3; i++) {
            for(var j=0; j<3; j++) {
                var slot = getSlotPixelFromNumber(i, j);
                //ctx.fillRect(slot.x, slot.y, s, s);
                //ctx.strokeStyle = 'green';
                ctx.strokeRect(slot.x, slot.y, s.w, s.h);
            }
        }
    }
}