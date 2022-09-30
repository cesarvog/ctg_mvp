
//TODO log of the game
var battleCardSequence = 0;
var myId = Math.random() * 1000000;
var player = "";

var batttleIdDict = {};
var battleIdUsing = -1;

var my_context = "table";
const C_TABLE = "table";
const C_HAND_CARDS = "handcards";
const C_CARD_VIEW_PERSISTED = "cardviewpersisted";
const C_CARD_VIEW = "cardview";
const C_DICE = "dice";
const C_TOKEN = "token";
const C_NEW_DICE = "newdice";
const C_HIST = "hist";

var my_hand_cards_e = "";
var my_card_view_e = "";
var my_table_e = "";
var my_canvas_e = "";
var my_dice_e = "";
var my_coin_e = "";
var my_hist_e = "";
var my_tokens_e = "";
var sceneList = [];
//icons
var icon_play_e = "";
var icon_hand_e = "";
var icon_dice_e = "";
var icon_coin_e = "";
var icon_trash_e= "";
var icon_turn_e = "";
var icon_tokens_e = "";
var icon_deck_e = "";
var icon_hist_e = "";
var icon_table_e = "";
var icon_buy_e = "";
var iconsList = [];

//table
var topZIndex = 11;
var topZIndexCounters = 10000;

//types
t_card = "card";
t_dice = "dice";
t_token = "token";

//control
var resortCards = false;
var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i) != undefined;

//tokens id
const t_fire = {"name" : "fire", "imgPath" : "img/tokens/fire.jpg"};
const t_frost = {"name"  : "frost", "imgPath" : "img/tokens/frost.png"};
const t_poison = {"name" : "poison", "imgPath": "img/tokens/poison.png"};
const t_1 = {"name" : "1", "imgPath" : "img/tokens/1.png"};

//remote
var socket = "";

var me;
var table = []

class Me {
	constructor() {
	this.my_view_card = '';
	this.my_hand_cards = [];
	this.my_deck_cards = [];
	}
}

class BattleField {
	constructor() {
		this.my_chars = []
		this.enemy_chars = [];
		this.my_effects = [];
		this.enemy_effects = [];
	}
}

class Card {
	constructor(cid, image, name, body, atk, def, cardType, clazz) {
		this.battleId = battleCardSequence++,
		this.cid = cid;
		this.image = image;
		this.name = name;
		this.body = body;
		this.atk  = atk;
		this.def  = def;
		this.type = t_card;
		this.cardType = cardType;
		this.clazz = clazz;
		if(player == "A") {
			this.slot = {x: 2,y: 1};
		} else {
			this.slot = {x: 0,y: 1};
		}
	};
}

class Dice {
	constructor(value) {
		this.battleId = battleCardSequence++,
		this.value = value;
		this.type = t_dice;
		if(player == "A") {
			this.slot = {x: 2,y: 1};
		} else {
			this.slot = {x: 0,y: 1};
		}

	}
}

function getCard(cid) {
	var c = cards.filter(obj => {
		return obj.cid == cid;
	})

	if(c.length > 0) return c[0];
}

var handleMessage =function(action, data) {
	switch (action) {
	case "welcome":
		if(data.m == 2) {
			this.battleCardSequence += 10000;
			player = "B";
		} else {
			player = "A";
		} 
		startBattle();
		break;
	case "persistInTable":
		if(data.cid != undefined) {
			var card = getCard(data.cid);
			var newCard = new Card(
				card.cid,
			   '',
				card.name,
				card.habs,
				card.atk,
				card.def,
				card.type,
				card.class);
			newCard.screendata = data.screendata;
			newCard.battleId = data.battleId;
			data = newCard;
		}

		if(data.slot != undefined) {
			reverseSlots(data.slot);
			var p = getSlotPixelFromNumber(data.slot.x, data.slot.y);
			data.screendata.x = p.x;
			data.screendata.y = p.y;
		} else {
			reverseY(data);
			data.screendata.x = data.screendata.x;
			data.screendata.y = data.screendata.y;
		}

		table.push(data);

		drawTable();
		refreshTable();
		break;
	case "moveInTable":
		var rec = table.recover(data.battleId);
		if(data.slot != undefined) {
			reverseSlots(data.slot);
			var p = getSlotPixelFromNumber(data.slot.x, data.slot.y);
			rec.screendata.x = p.x;
			rec.screendata.y = p.y;
		} else {
			reverseY(data);
			rec.screendata.x = data.screendata.x;
			rec.screendata.y = data.screendata.y;
		}
		rec.screendata = data.screendata;
		rec.slot = data.slot;

		refreshTable();
		break;
	case "turnCard":
		turnCardRemote(data.e);
		refreshTable();
		break;
	case "addToken":
		addTokenRemote(data);
		break;
	case "throwCoin":
		throwCoinRemote(data.e);
		break;
	case "hist":
		addHistRemote(data.e);
		playSnackbar(data.e);
		break;
	case "updateDice":
		changeValueDiceRemote(data);
		break;
	case "removeFromTable":
		for(var i=0; i < my_table_e.childNodes.length; i++)	{
			if(my_table_e.childNodes[i].battleId == data.battleId) {
				my_table_e.childNodes[i].remove();
			}
		}
		deleteFromTable(data.battleId);
		break;
}

function reverseSlots(slot) {
	if(slot.y == 0) slot.y = 2;
	else if(slot.y == 2) slot.y = 0;
}

/*
	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
	*/
}
function reverseY(obj) {
	if(obj.screendata == undefined) {
		obj.screendata = {};
		obj.screendata.x = window.innerWidth/2;
		obj.screendata.y = window.innerHeight/2;
	}
	var y = obj.screendata.y;
	var height = window.innerHeight;
	var dif = height-y;
	var objHeight = 0;

	switch(obj.type) {
		case t_card:
			objHeight = height / 5;	
			break;
		case t_dice:
			objHeight = height / 10;
			break;
		case t_token:
			objHeight = height / 20;
			break;
		case t_dice:
			objHeight = height / 10;
			break;
	}

	obj.screendata.y = dif + objHeight;
}

function start() {
	var battleField = new BattleField();
	me = new Me();
	other = new Me();

	drawGrid();
	//remote
	socket = startManager();
	if(socket == undefined) {
		console.log("Ocorreu um erro ao conectar");
		return;
	}
	
    socket.onmessage = function(event) {
        console.log("new message " + event.data);
		var action = event.data.split(",")[0];
		var data = event.data.substring(action.length+1);
		handleMessage(action, JSON.parse(data));
    }
}

function startBattle() {
	generateDeckCards(me.my_deck_cards, 60);
	getCardFromDeck(me.my_deck_cards, me.my_hand_cards, 7);
	
	my_table_e = document.getElementById("table");
	my_canvas_e = document.getElementById("canvas");
	my_hand_cards_e = document.getElementById("hand");
	my_card_view_e = document.getElementById("card_view");
	my_dice_e = document.getElementById("newdice");
	my_hist_e = document.getElementById("hist");
	my_tokens_e = document.getElementById("tokens");
	my_snack_bar_e = document.getElementById("snackbar");
	sceneList = [my_table_e, my_canvas_e, my_hand_cards_e, my_card_view_e, my_dice_e, my_hist_e, my_tokens_e];
	icon_dice_e = document.getElementById("dice_icon");
	icon_play_e = document.getElementById("play_icon");
	icon_hand_e = document.getElementById("hand_icon");
	icon_turn_e = document.getElementById("turn_icon");
	icon_deck_e = document.getElementById("deck_icon");
	icon_coin_e = document.getElementById("coin_icon");
	icon_tokens_e = document.getElementById("token_icon");
	icon_hist_e = document.getElementById("hist_icon");
	icon_table_e = document.getElementById("table_icon");
	icon_buy_e = document.getElementById("buy_icon");

	iconsList = [icon_play_e, icon_hand_e, icon_dice_e, icon_turn_e, icon_hist_e, icon_table_e, icon_coin_e, icon_deck_e, icon_tokens_e, icon_buy_e];

	table.recover = function(battleId) {
		for(var i=0; i < this.length; i++) {
			if(this[i].battleId == battleId) return this[i]
		}
	}

	var h = window.innerHeight/2;
	var w = window.innerWidth/2;
	if(w > h) {
		my_card_view_e.style.height = "80vh";
		my_card_view_e.style.width = "calc(80vh * 0.6)";

	}

	addHist("Começou o jogo, você é o Jogador " + player + ", boa sorte!", true);

	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
}

function showDeck() {
	while (my_hand_cards_e.firstChild) {
		my_hand_cards_e.removeChild(hand.lastChild);
	}
	for(var i=0; i < me.my_deck_cards.length; i++) {
		my_hand_cards_e.appendChild(drawCardInHands(me.my_deck_cards[i]))
	}

	resortCards = true;
	updateCtx(C_HAND_CARDS);
	updateIcons();
	updateScene();
}

function showHandCards() {
	if(my_hand_cards_e.style.display === "block") {
		hand_show = false;

		updateCtx(C_TABLE);
		updateIcons();
		updateScene();
		return;
	}
	
	//delete hand to redraw
	while (my_hand_cards_e.firstChild) {
		my_hand_cards_e.removeChild(hand.lastChild);
	}

	//redraw
	for(i=0; i < me.my_hand_cards.length; i++) {
		my_hand_cards_e.appendChild(drawCardInHands(me.my_hand_cards[i]));
	}

	hand_show = true;
	resortCards = true;

	updateCtx(C_HAND_CARDS);
	updateIcons();
	updateScene();
}

function drawCardInHands(cardData) {
	var c = document.createElement("div");
	c.classList.add("card_free");
	var f = function() {
		viewCard(cardData);
	};

	c.onclick = f;
	c.addEventListener("touchstart", f);
	var text = "<p class='card_name'> " + cardData.name + " </p>";
	if(cardData.cardType == "P") {
		text += "<div class='card_atkdef'>" + cardData.atk + "/" + cardData.def + "</div>"
	}
	paintCard(cardData, c);
	c.innerHTML = text;
	return c;
}

function paintCard(card, elem) {
	//clean
	var list = [];
	for(var i=0; i < elem.classList.length; i++) {
		if(!elem.classList[i].startsWith("card_type_")) {
			list.push(elem.classList[i]);
		}
	}

	elem.classList = list;

	switch(card.cardType) {
		case "P":
			elem.classList.add("card_type_char");
			break;
		case "I":
			elem.classList.add("card_type_item");
			break;
		case "E":
			elem.classList.add("card_type_equip");
			break;
		case "T":
			elem.classList.add("card_type_terrain");
			break;
	}
}

function viewCard(cardData) {
	my_hand_cards_e.style.display = "none";
	my_card_view_e.style.display = "block";
	
	me.my_view_card = cardData;

	my_card_view_e.battleId = cardData.battleId;

	var cd = table.recover(cardData.battleId);
	if(cd != undefined) cardData = cd;
	var text = "<p class='card_name'> " + cardData.name + " </p>";
	text += "<div class='card_body'>";
	if(cardData.cardType == "P") {
		text += "<p class='card_hab'>" + cardData.clazz + "</p>"
	}
	for(var i=0; i < cardData.body.length; i++) {
		text += "<p class='card_hab'>" + cardData.body[i] + "</p>"
	}
	text += "</div>"

	if(cardData.cardType == "P") {
		text += "<div class='card_atkdef'>" + cardData.atk + "/" + cardData.def + "</div>"
	}
	paintCard(cardData, my_card_view_e);
	my_card_view_e.innerHTML = text;	

	if(cardData.persisted) {
		updateCtx(C_CARD_VIEW_PERSISTED);
	} else {
		updateCtx(C_CARD_VIEW);
	}
	updateIcons();
	updateScene();
}

function updateIcons() {
	if(my_context === C_TABLE) {
		displayIcons(icon_coin_e, icon_deck_e, icon_hand_e, icon_hist_e, icon_dice_e, icon_tokens_e, icon_buy_e);
	}else if(my_context === C_HAND_CARDS) {
		displayIcons(icon_hand_e, icon_table_e);
	}else if(my_context === C_CARD_VIEW) {
		displayIcons(icon_play_e, icon_hand_e, icon_table_e);
	}else if(my_context === C_NEW_DICE) {
		displayIcons();
	}else if(my_context === C_CARD_VIEW_PERSISTED) {
		displayIcons(icon_hand_e, icon_turn_e, icon_table_e, icon_table_e);
	}else if(my_context === C_HIST) {
		displayIcons(icon_hand_e, icon_table_e);
	}else if(my_context === C_TOKEN) {
		displayIcons(icon_table_e, icon_hand_e);
	}
}
function displayIcons() {
	for(var i=0; i<iconsList.length; i++) {
		iconsList[i].style.display = "none";
	}
	for(var i=0; i<arguments.length; i++) {
		arguments[i].style.display = "block";
	}
}

function displayScene() {
	for(var i=0; i<sceneList.length; i++) {
		sceneList[i].style.display = "none";
	}
	for(var i=0; i<arguments.length; i++) {
		arguments[i].style.display = "block";
	}
}

function updateScene() {
	if(my_context === C_TABLE) {
		displayScene(my_table_e, my_canvas_e);
	}else if(my_context === C_HAND_CARDS) {
		displayScene(my_hand_cards_e);
	}else if(my_context === C_CARD_VIEW) {
		displayScene(my_card_view_e);
	}else if(my_context === C_NEW_DICE) {
		displayScene(my_dice_e);
	}else if(my_context === C_CARD_VIEW_PERSISTED) {
		displayScene(my_card_view_e);
	}else if(my_context === C_HIST) {
		displayScene(my_hist_e);
	}else if(my_context === C_TOKEN) {
		displayScene(my_tokens_e);
	}
}

function updateCtx(ctx) {
	my_context = ctx;
	if(ctx == C_TABLE && resortCards) {
		for(var i=0; i < 1000; i++) {
			var rand1 = Math.floor(Math.random() * me.my_deck_cards.length);
			var rand2 = Math.floor(Math.random() * me.my_deck_cards.length);
			var c = me.my_deck_cards[rand1];
			me.my_deck_cards[rand1] = me.my_deck_cards[rand2];
			me.my_deck_cards[rand2] = c;
		}
		
		resortCards = false;
	}
}

function playCard() {
	getMyCard(me.my_view_card.battleId);
	drawTable();	

	updateCtx(C_TABLE);
	updateIcons();
	updateScene();

}

function getMyCard(battleCardId) {
	var founded = false;
	for(const c of me.my_hand_cards) {
		if(c.battleId == battleCardId) {
			obj = table.recover(c.battleId);
			if(obj == undefined) {
				posTable(c);
				table.push(c);
				addHist("Player " + player + " jogou a carta " + c.name);
				c.persisted = true;
				founded = true;
				persistInTable(c, socket);
			}
			me.my_hand_cards = removeCard(me.my_hand_cards, battleCardId);
		}
	}
	if (!founded) {
		for(const c of me.my_deck_cards) {
			if(c.battleId == battleCardId) {
				if(table.recover(c.battleId) == undefined) {
					posTable(c);
					table.push(c);
					addHist("Player " + player + " jogou a carta " + c.name);
					c.persisted = true;
					persistInTable(c, socket);
				}
			}
			me.my_deck_cards = removeCard(me.my_deck_cards, battleCardId);
		}
	}
}

function removeCard(deck, battleCardId) {
	return deck.filter(function(elem) {
			return elem.battleId != battleCardId;
	});
}

function generateDeckCards(deck, numCards) {
	var qttCards = cards.length;

	for(var i=0; i < numCards; i++) {

		var rand = 0;
		if(i < 5) {
			rand = Math.floor(Math.random() * 16);
		} else {
			rand = Math.floor(Math.random() * qttCards);
		}

		var newCard = new Card(
				cards[rand].cid,
			   '',
				cards[rand].name,
				cards[rand].habs,
				cards[rand].atk,
				cards[rand].def,
				cards[rand].type,
				cards[rand].class);
		newCard.owner = myId;
		deck.push(newCard);
	}
}

function getCardFromDeck(deck, hand, num) {
	//get chars
	var qtd = 0;
	for(var i=0; i < deck.length && qtd < 5; i++) { 
		if(deck[i].cardType == "P") {
			hand.push(deck[i]);
			deck[i] = "x";
			qtd++;
		}
	}
	var newDeck =[];
	for(var i=0; i < deck.length; i++) { 
		if(deck[i] != "x") newDeck.push(deck[i]);
	}

	deck = newDeck;
	me.my_deck_cards = deck;

	for(var i=0; i < 2; i++) { 
		hand.push(deck.pop());
	}
}

function drawCard(c) {
	c.classList.add("card_table");
	var f = function() {
		viewCard(c);
	};

	if(!isMobile) {
		c.addEventListener("dblclick", f);
	} else {
		c.addEventListener("click", function(){
			if(c.myClick == undefined) {
				c.myClick = true;
			} else {
				viewCard(c);
				c.myClick = undefined;
			}

			setTimeout(function() { c.myClick = undefined;
			}, 2000);
		})
	}

	var cd = table.recover(c.battleId);
	var text = "<p class='card_name'> " + cd.name + " </p>";
	if(cd.cardType == "P") {
		text += "<div class='card_atkdef'>" + cd.atk + "/" + cd.def + "</div>"
	}

	paintCard(cd, c);
	c.innerHTML = text;	
}

function drawDice(view, dice) {
	view.classList.add("dice_table");
	var f = function() {
		showNewDice(dice);
	};

	if(!isMobile) {
		view.addEventListener("dblclick", f);
	} else {
		view.addEventListener("click", function(){
			if(view.myClick == undefined) {
				view.myClick = true;
			} else {
				showNewDice(dice);
				view.myClick = undefined;
			}

			setTimeout(function() { view.myClick = undefined;
			}, 2000);
		})
	}view.innerHTML = "<text>" + dice.value + "</text>";
	view.value = dice.value;
}

function drawToken(elem, obj) {
	elem.classList.add("token_table");
	elem.style.backgroundImage = "url(" + obj.imgPath +  ")";
	posTable(elem);
	posTable(obj);
}

function posTable(elem) {
	if(elem.screendata == undefined) {
		elem.screendata = {};
		if(elem.slot != undefined) {
			var s = getSlotPixelFromNumber(elem.slot.x, elem.slot.y);
			elem.screendata.x = s.x;
			elem.screendata.y = s.y;
		} else {
			elem.screendata.x = window.innerHeight/2;
			elem.screendata.y = window.innerWidth/2;
		}
	}
}
function drawTable() {
	for(var i=0; i < table.length; i++) {
		var divElements = my_table_e.childNodes;
		var contains = false;
		for(var j=0; j < divElements.length; j++) {
			if(divElements[j].battleId == table[i].battleId) {
				contains = true;
				break;
			}
		}

		if(contains) {
			continue;
		}

	var c = document.createElement("div");
	c.persisted = true;
	c.battleId = table[i].battleId;

	if (table[i].type == t_card) {
		drawCard(c);
	} else if(table[i].type == t_dice) {
		drawDice(c, table[i]);
	} else if(table[i].type == t_token) {
		drawToken(c, table[i]);
	}

	c.style.top = table[i].screendata.y + "px";
	c.style.left = table[i].screendata.x + "px";
	c.battleId = table[i].battleId;

	if(isMobile) {
		c.childNodes[0].addEventListener("touchmove", function(event) {
				console.log("moving persisted: " + c.battleId);
				c.style.zIndex = topZIndex+1;
				topZIndex++;

				function moveAt(pageX, pageY) {
					console.log("moving");
					c.style.left = pageX - c.offsetWidth / 2 + 'px';
					c.style.top = pageY - c.offsetHeight / 2 + 'px';
				}
		
				moveAt(event.touches[0].clientX, event.touches[0].clientY);
		});
		c.addEventListener("touchend", function(event) {
			console.log("parou (touchend)");
			var obj = table.recover(c.battleId);

			var s = getSlotNumberFromPixel(parseInt(c.style.left), parseInt(c.style.top));
			obj.slot = s;
			var p = getSlotPixelFromNumber(s.x, s.y);
			obj.screendata.x = p.x;
			obj.screendata.y = p.y;
			
			refreshTable();
			moveInTable(obj, socket);
		});
	} else {
		 var ce = c;
		 var obj = table.recover(c.battleId);
		 if(obj.type == t_card) ce = c.childNodes[0];
		 ce.onmousedown = function(event) {
				c.moving = true;
				console.log("moving persisted: " + c.battleId);
				c.style.zIndex = topZIndex+1;
				topZIndex++;

				function moveAt(pageX, pageY) {
					console.log("moving");
					c.style.left = pageX - c.offsetWidth / 2 + 'px';
					c.style.top = pageY - c.offsetHeight / 2 + 'px';
				}

				//moveAt(event.pageX, event.pageY);

				if(isMobile) {
					c.touchmoveFunc = function(event) {
						moveAt(event.touches[0].clientX, event.touches[0].clientY);
					};

					document.addEventListener("touchmove", c.touchmoveFunc);

				} else {
					c.mousemoveFunc = function(event) {
						moveAt(event.pageX, event.pageY);
					};

					document.addEventListener('mousemove', c.mousemoveFunc);
					c.onmousemove = c.mouseMoveFunc;
				}
				c.onmouseup = function() {
					console.log("release persisted: " + c.battleId)
					document.removeEventListener('mousemove', c.mousemoveFunc);

					if(!this.moving) {
						this.moving = false;
						return;
					}
					var obj = table.recover(c.battleId);
					var s = getSlotNumberFromPixel(parseInt(c.style.left), parseInt(c.style.top));
					obj.slot = s;
					var p = getSlotPixelFromNumber(s.x, s.y);
					obj.screendata.x = p.x;
					obj.screendata.y = p.y;

					refreshTable();
					moveInTable(obj, socket);
					this.moving = false;
				};
		}
	};
	//c.addEventListener("mousedown", c.onmousedown);
	
	 my_table_e.appendChild(c);
	}

	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
}

function refreshTable() {
	var dices = document.getElementsByClassName("dice_table");
	for(var i=0; i < dices.length; i++) {
		var dice = dices[i];
		for(var j=0; j<table.length; j++) {
			if(table[j].battleId == dice.battleId && dice.value != table[j].value) {
				dice.value = table[j].value;
				dice.getElementsByTagName("text")[0].innerHTML = dice.value;
			}
		}
	}

	// margin top for equipped cards
	var slotObjs = new Array(3);
	for(var i=0; i < 3; i++) {
		slotObjs[i] = new Array(3);
		for(var j=0; j<3; j++) {
			slotObjs[i][j] = [];
		}
	}

	for(var i=0; i < table.length; i++) {
		if(table[i].slot == undefined) continue;
		if(slotObjs[table[i].slot.x][table[i].slot.y] == undefined) slotObjs[table[i].slot.x][table[i].slot.y] = [];
		slotObjs[table[i].slot.x][table[i].slot.y].push(table[i]);
	}

	var slotSize = getSlotSize();

	for(var i=0; i < slotObjs.length; i++) {
		for(var j=0; j < slotObjs[i].length; j++) {
			var objs = slotObjs[i][j];
			if(objs == undefined) continue;
			objs.sort((a, b) => (a.cardType > b.cardType) ? 1 : -1);

			var qtdToken= 0;
			var qtdCardResources = 0;
			for(var k=0; k < objs.length; k++) {
				var obj = objs[k];

				var p = getSlotPixelFromNumber(obj.slot.x, obj.slot.y);
				obj.screendata.x = p.x;
				obj.screendata.y = p.y;

				if(obj.type == t_token || obj.type == t_dice) {
					obj.screendata.x += (getH()/20) *qtdToken;
					qtdToken++;
					obj.zIndex = 11;
				} else if(obj.cardType == "P") {
					obj.zIndex = 10;
					var totalResouces = objs.reduce(countSlotResourceCards, 0);
					obj.screendata.y += (slotSize.h/10)*(totalResouces);
				} else if(obj.cardType != "P") {
					obj.screendata.y += (slotSize.h/10)*qtdCardResources;
					obj.zIndex = qtdCardResources;
					qtdCardResources++;
				}
			}
		}
	}

	for(var i=0; i < my_table_e.childNodes.length; i++) {
		var elm = my_table_e.childNodes[i];
		var obj = table.recover(elm.battleId);
		if(elm.style.left != obj.screendata.x || elm.style.top != obj.screendata.y) {
			elm.style.left = obj.screendata.x;
			elm.style.top = obj.screendata.y;
			elm.style.zIndex = obj.zIndex;
		}
	}

}

function countSlotCharacter(total, obj) {
	if(obj.type == t_card && obj.cardType == "P") total++;
	return total;
}

function countSlotResourceCards(total, obj) {
	if(obj.type == t_card && obj.cardType != "P") total++;
	return total;
}

function countSlotCounters(total, obj) {
	if(obj.type == t_token || obj.type == t_dice) total++;
	return total;
}

function showNewDice(dice) {
	var dis = dice != undefined;
	var label = dice != undefined ? "Pronto" : "Cancelar";
	my_dice_e.getElementsByTagName("text")[0].innerText = 1;
	if(dice != undefined) {
		my_dice_e.getElementsByTagName("text")[0].innerText = dice.value;
		my_dice_e.battleId = dice.battleId;
		my_dice_e.childNodes[15].style.display = "block";
	} else {
		my_dice_e.childNodes[15].style.display = "none";
	}

	var elems = my_dice_e.getElementsByTagName("button");
	for(var i=0; i < elems.length; i++) {
		var elem = elems[i];
		if(elem.id == "d_create") {
			elem.disabled = dis;
		} else if(elem.id == "d_cancel") {
			elem.innerHTML = label;
		}
	}
	updateCtx(C_NEW_DICE);
	updateIcons();
	updateScene();
}

function changeValueDiceRemote(data) {
	table.recover(data.battleId).value = data.value;
	refreshTable();
}

function changeValueNewDice(v) {
	var t = my_dice_e.getElementsByTagName("text")[0];
	var actual = parseInt(t.innerText);
	actual = actual + v;
	if(actual < 1) actual = 1;
	t.innerText = actual;
}

function cancelNewDice(elem) {
	if(elem.parentElement.battleId != undefined) {
		var dice = table.recover(elem.parentElement.battleId);
		var old = dice.value;
		var newv = elem.parentElement.getElementsByTagName("text")[0].innerText;
		dice.value = newv;


		addHist("Player " + player + " mudou o valor de um dado de " + old + " para " + newv);
		updateDiceRemote(dice, socket);

		refreshTable();
	}

	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
}

function deleteDice(elem) {
	var battleId = elem.parentElement.battleId;
	if(elem.parentElement.battleId != undefined) {
		var elemsTable = my_table_e.childNodes;
		for(var i=0; i < elemsTable.length; i++) {
			if(battleId == elemsTable[i].battleId) {
				removeFromTable(elemsTable[i], socket);
				deleteFromTable(elemsTable[i].battleId);
				elemsTable[i].remove();
			}
		}
		for(var i=0; i < table.length; i++) {
			if(elem.parentElement.battleId == table[i].battleId) {
				removeFromTable(table, socket);
				deleteFromTable(elem.battleId);
				break;
			}
		}

		refreshTable();
	}

	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
}

function deleteFromTable(battleId) {
	var f = table.recover;
	var newTable = table.filter(obj => {
		return obj.battleId != battleId;
	});
	newTable.recover = f;
	table = newTable;
}

function createNewDice() {
	var value = my_dice_e.getElementsByTagName("text")[0].innerText;
	var dice = new Dice(value);

	posTable(dice);
	table.push(dice);

	drawTable();
	persistInTable(dice, socket)
	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
}

//remote
function turnCardRemote(battleId) {
	var persisteds = my_table_e.childNodes;
	for(var i=0; i < persisteds.length; i++) {
		if(battleId == persisteds[i].battleId) {
			if(persisteds[i].classList.contains("card_table_turned")) {
				persisteds[i].removeAttribute("class");
				persisteds[i].classList.add("card_table");
			} else {
				persisteds[i].removeAttribute("class");
				persisteds[i].classList.add("card_table_turned");
				persisteds[i].classList.add("card_table");
			}
			paintCard(table.recover(battleId), persisteds[i])
			break;
		}
	}
}

function turnCard() {
	var id = my_card_view_e.battleId;
	var persisteds = my_table_e.childNodes;
	for(var i=0; i < persisteds.length; i++) {
		if(id == persisteds[i].battleId) {
			if(persisteds[i].classList.contains("card_table_turned")) {
				persisteds[i].removeAttribute("class");
				persisteds[i].classList.add("card_table");
				turnCardInTable(envelopeInfo(persisteds[i].battleId), socket)
			} else {
				persisteds[i].removeAttribute("class");
				persisteds[i].classList.add("card_table_turned");
				persisteds[i].classList.add("card_table");
				turnCardInTable(envelopeInfo(persisteds[i].battleId), socket)
			}
			paintCard(table.recover(id), persisteds[i])
			break;
		}
	}
	addHist("Player " + player + " virou a carta " + table.recover(id).name);


	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
}
function envelopeInfo(info) {
	var e = {};
	e.e = info;
	return e;
}

function addHistRemote(v) {
	var list = my_hist_e.childNodes[0];
	var li = document.createElement("li");
	li.innerText = v;
	list.appendChild(li);
}

function addHist(v, localOnly) {
	var list = my_hist_e.childNodes[0];
	var li = document.createElement("li");
	li.innerText = v;
	list.appendChild(li);

	if(localOnly == undefined || !localOnly) sendHistRemote(envelopeInfo(v), socket);
}

function playSnackbar(text) {
	my_snack_bar_e.innerText = text;
	my_snack_bar_e.className = "show";
	setTimeout(function(){ my_snack_bar_e.className = my_snack_bar_e.className.replace("show", ""); }, 3000);
}

function showHist() {
	updateCtx(C_HIST);
	updateIcons();
	updateScene();
}
function showTable() {
	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
}

function throwCoinRemote(t) {
	playSnackbar(t);
}

function throwCoin() {
	var random_boolean = Math.random() < 0.5;
	var text = "";
	if(random_boolean) {
		text = "Player " + player + " tirou um sucesso na moeda";
	} else {
		text = "Player " + player + " tirou uma falha na moeda";
	}
	addHist(text);
	playSnackbar(text);
	throwCoinInTable(envelopeInfo(text), socket);
}

function addTokenRemote(data) {
	table.push(data);

	drawTable();
}

function addToken(id) {
	var obj = [];
	switch (id) {
		case t_fire.name:
			obj = t_fire; 
			break;
		case t_frost.name:
			obj = t_frost; 
			break;
		case t_poison.name:
			obj = t_poison; 
			break;
		case t_1.name:
			obj = t_1; 
			break;
	}

	var newObj = {};
	newObj.name = obj.name;
	newObj.imgPath = obj.imgPath;
	
	newObj.type = t_token;
	newObj.battleId = battleCardSequence++,
	newObj.slot = {};
	if(player == "A") {
		newObj.slot = {x: 2,y: 1};
	} else {
		newObj.slot = {x: 0,y: 1};
	}

	table.push(newObj);

	drawTable();
	addTokenInTable(newObj, socket);
	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
}

function showTokens() {
	updateCtx(C_TOKEN);
	updateIcons();
	updateScene();
}

function buyCard() {
	var buyed = me.my_deck_cards.pop();
	me.my_hand_cards.push(buyed);
	addHist("Player A comprou uma carta");
	playSnackbar("Player A comprou uma carta");

	showHandCards();
}