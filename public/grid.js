function getH() {
    return window.innerHeight - 25;
}

function getW() {
    return window.innerWidth;
}

function getSlotSize() {
	var h = (getH()-12);
	var w = (getW()-12);

	if(w > h) {
		return h/3;
	} else {
		return w/3;
	}
}

function getSlotNumberFromPixel(x, y) {
    var s = getSlotSize();
    var slot = {};
    for(var i=0; i < 3; i++) {
        if((3*i) + (i*s) < x) {
            slot.x = i;
        }
    }

    if(y <= s) {
        slot.y = 0;
    } else if(y >= getH()-12-s) {
        slot.y = 2;
    } else {
        slot.y = 1;
    }

    return slot;
}

function getSlotPixelFromNumber(x, y) {
    var s = getSlotSize();
    var slot = {};
    slot.x = (x * s) + (3*x);
    
    if(y == 0) {
        slot.y = 3;
    } else if( y == 1) {
        slot.y = (getH()-12)/2 - (s/2);
    } else {
        slot.y = getH() - (s) - 3;
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
                ctx.strokeRect(slot.x, slot.y, s, s);
            }
        }
    }
}