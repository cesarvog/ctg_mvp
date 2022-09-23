var room = "";



function startManager() {
    var port= "5000"
    room = "roomx"

    let paramString = window.location.href.split('?')[1];
    let queryString = new URLSearchParams(paramString);

    for (let pair of queryString.entries()) {
        if(pair[0] == "room") room = pair[1]
    }

    let socket = new WebSocket("ws://" + window.location.hostname + ":" + port + "/ws");

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
   s.send(prepare("persistInTable", data));
}

function moveInTable(data, s) {
    s.send(prepare("moveInTable", data));
}

function removeFromTable(data, s) {
    s.send(prepare("removeFromTable", data));
}

function turnCardInTable(data, s) {
    s.send(prepare("turnCard", data));
}

function prepare(action, data) {
    return room + "," + action + "," + JSON.stringify(data)
}