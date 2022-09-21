
//TODO log of the game
var battleCardSequence = 0;
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
var topZIndex = 1;

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


var me;
class Me {
	constructor() {
	this.my_view_card = '';
	this.my_table = [];
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
	constructor(id, image, name, body, atk, def) {
		this.battleId = battleCardSequence++,
		this.id = id;
		this.image = image;
		this.name = name;
		this.body = body;
		this.atk  = atk;
		this.def  = def;
		this.type = t_card;
	};
}

class Dice {
	constructor(value) {
		this.battleId = battleCardSequence++,
		this.value = value;
		this.type = t_dice;
	}
}

function start() {
	var battleField = new BattleField();
	me = new Me();

	generateDeckCards(me.my_deck_cards, 60);
	getCardFromDeck(me.my_deck_cards, me.my_hand_cards, 7);
	
	my_table_e = document.getElementById("table");
	my_hand_cards_e = document.getElementById("hand");
	my_card_view_e = document.getElementById("card_view");
	my_dice_e = document.getElementById("newdice");
	my_hist_e = document.getElementById("hist");
	my_tokens_e = document.getElementById("tokens");
	my_snack_bar_e = document.getElementById("snackbar");
	sceneList = [my_table_e, my_hand_cards_e, my_card_view_e, my_dice_e, my_hist_e, my_tokens_e];
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

	me.my_table.recover = function(battleId) {
		for(var i=0; i < this.length; i++) {
			if(this[i].battleId == battleId) return this[i]
		}
	}
	window.beforeunload = function (event) {
		event.preventDefault();
	}
	window.unload = function (event) {
		event.preventDefault();
	}
	addHist("Começou o jogo");

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
	text += "<div class='card_atkdef'>" + cardData.atk + "/" + cardData.def + "</div>"
	c.innerHTML = text;
	return c;
}

function viewCard(cardData) {
	my_hand_cards_e.style.display = "none";
	my_card_view_e.style.display = "block";
	
	me.my_view_card = cardData;

	my_card_view_e.battleId = cardData.battleId;

	var cd = me.my_table.recover(cardData.battleId);
	if(cd != undefined) cardData = cd;
	var text = "<p class='card_name'> " + cardData.name + " </p>";
	text += "<div class='card_body'>"
	for(var i=0; i < cardData.body.length; i++) {
		text += "<p class='card_hab'>" + cardData.body[i] + "</p>"
	}
	text += "</div>"
	text += "<div class='card_atkdef'>" + cardData.atk + "/" + cardData.def + "</div>"
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
		displayScene(my_table_e);
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
			if(me.my_table.recover(c.battleId) == undefined) {
				me.my_table.push(c);
				c.persisted = true;
				addHist("Player A jogou a carta " + c.name);
				founded = true;
			}
			me.my_hand_cards = removeCard(me.my_hand_cards, battleCardId);
		}
	}
	if (!founded) {
		for(const c of me.my_deck_cards) {
			if(c.battleId == battleCardId) {
				if(me.my_table.recover(c.battleId) == undefined) {
					me.my_table.push(c);
					c.persisted = true;
					addHist("Player A jogou a carta " + c.name);
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
		var rand = Math.floor(Math.random() * qttCards);

		var newCard = new Card(
				0,
			   '',
				cards[rand].name,
				cards[rand].habs,
				cards[rand].atk,
				cards[rand].def);
		deck.push(newCard);
	}
}

function getCardFromDeck(deck, hand, num) {
	for(var i=0; i < num; i++) hand.push(deck.pop());
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

	var cd = me.my_table.recover(c.battleId);
	var text = "<p class='card_name'> " + cd.name + " </p>";
	text += "<div class='card_atkdef'>" + cd.atk + "/" + cd.def + "</div>"

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
}

function drawTable() {
	for(var i=0; i < me.my_table.length; i++) {
		if(me.my_table[i].screendata == undefined) {
			me.my_table[i].screendata = {};
			me.my_table[i].screendata.x = window.innerHeight/2;
			me.my_table[i].screendata.y = window.innerWidth/2;
		} else {
			continue;
		}


	var c = document.createElement("div");
	c.persisted = true;
	c.battleId = me.my_table[i].battleId;

	if (me.my_table[i].type == t_card) {
		drawCard(c);
	} else if(me.my_table[i].type == t_dice) {
		drawDice(c, me.my_table[i]);
	} else if(me.my_table[i].type == t_token) {
		drawToken(c, me.my_table[i]);
	}

	c.style.top = me.my_table[i].screendata.x + "px";
	c.style.left = me.my_table[i].screendata.y + "px";
	c.battleId = me.my_table[i].battleId;

	if(isMobile) {
		c.addEventListener("touchmove", function(event) {
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
	} else {
		 c.onmousedown = function(event) {
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
				if(isMobile) {
						c.addEventListener("touchend", function(){
							console.log("removing listener of " + c.battleId);
							document.removeEventListener("touchmove", c.touchmoveFunc);
						});
				} else {
					c.onmouseup = function() {
						console.log("release persisted: " + c.battleId)
						document.removeEventListener('mousemove', c.mousemoveFunc);
						c.onmouseup = null;
					};
				}
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
		for(var j=0; j<me.my_table.length; j++) {
			if(me.my_table[j].battleId == dice.battleId && dice.value != me.my_table[j].value) {
				dice.value = me.my_table[j].value;
				dice.getElementsByTagName("text")[0].innerHTML = dice.value;
			}
		}
	}
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

function changeValueNewDice(v) {
	var t = my_dice_e.getElementsByTagName("text")[0];
	var actual = parseInt(t.innerText);
	actual = actual + v;
	if(actual < 1) actual = 1;
	t.innerText = actual;
}

function cancelNewDice(elem) {
	if(elem.parentElement.battleId != undefined) {
		var dice = me.my_table.recover(elem.parentElement.battleId);
		dice.value = elem.parentElement.getElementsByTagName("text")[0].innerText;
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
				elemsTable[i].remove();
			}
		}
		for(var i=0; i < me.my_table.length; i++) {
			if(elem.parentElement.battleId == me.my_table[i].battleId) {
				removeCard(me.my_table, elem.battleId);
				break;
			}
		}

		refreshTable();
	}

	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
}

function createNewDice() {
	var value = my_dice_e.getElementsByTagName("text")[0].innerText;
	me.my_table.push(
		new Dice(value)
	);

	drawTable();
	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
}

function turnCard() {
	var id = my_card_view_e.battleId;
	var persisteds = my_table_e.childNodes;
	for(var i=0; i < persisteds.length; i++) {
		if(id == persisteds[i].battleId) {
			if(persisteds[i].classList.contains("card_table_turned")) {
				persisteds[i].removeAttribute("class");
				persisteds[i].classList.add("card_table");
			} else {
				persisteds[i].removeAttribute("class");
				persisteds[i].classList.add("card_table_turned");
				persisteds[i].classList.add("card_table");
			}
			break;
		}
	}
	updateCtx(C_TABLE);
	updateIcons();
	updateScene();
}

function addHist(v) {
	var list = my_hist_e.childNodes[0];
	var li = document.createElement("li");
	li.innerText = v;
	list.appendChild(li);
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

function throwCoin() {
	var random_boolean = Math.random() < 0.5;
	var text = "";
	if(random_boolean) {
		text = "Player A tirou um sucesso na moeda";
	} else {
		text = "Player A tirou uma falha na moeda";
	}
	addHist(text);
	playSnackbar(text);
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
	me.my_table.push(newObj);
	drawTable();
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