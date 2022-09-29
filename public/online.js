var room = "";



function startManager() {
    var port= "80"
    room = "roomx"

    let paramString = window.location.href.split('?')[1];
    let queryString = new URLSearchParams(paramString);

    for (let pair of queryString.entries()) {
        if(pair[0] == "room") room = pair[1]
    }

    //let socket = new WebSocket("wss://" + window.location.hostname + "/ws");
    let socket = new WebSocket("ws://" + window.location.hostname + ":5000/ws");

    socket.onerror = function(err) {
        console.log(err);
    }

    socket.onclose = function(event) {
        console.log(event.code);
    }

    socket.onopen = function() {
        socket.send("join," + room)
    }

    return socket;
}

function persistInTable(data, s) {
    if(data.cid != undefined) {
        var newData = {};
        newData.cid = data.cid;
        newData.battleId = data.battleId;
        newData.screendata = data.screendata;
        newData.slot = data.slot;
        data = newData;
    }
    s.send(prepare("persistInTable", data));
}

function addTokenInTable(data, s) {
    s.send(prepare("addToken", data))
}

function moveInTable(data, s) {
    if(data.cid != undefined) {
        var newData = {};
        newData.cid = data.cid;
        newData.battleId = data.battleId;
        newData.screendata = data.screendata;
        newData.slot = data.slot;
        data = newData;
    }

    s.send(prepare("moveInTable", data));
}

function removeFromTable(data, s) {
    s.send(prepare("removeFromTable", data));
}

function turnCardInTable(data, s) {
    s.send(prepare("turnCard", data));
}

function throwCoinInTable(data, s) {
    s.send(prepare("throwCoin", data));
}

function sendHistRemote(data, s) {
    s.send(prepare("hist", data));
}

function updateDiceRemote(data, s) {
    s.send(prepare("updateDice", data));
}

function prepare(action, data) {
    return room + "," + action + "," + JSON.stringify(data)
}