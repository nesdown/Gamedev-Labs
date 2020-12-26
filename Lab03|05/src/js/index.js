"use strict";
import 'babel-polyfill';
import axios from 'axios';
import MicroModal from 'micromodal';
import io from 'socket.io-client';
// import Game from './game-components/game';
// import PlayerSnake from "./game-components/playerSnake";
// import Util from "./game-components/util";
// import BotSnake from "./game-components/botSnake";

let socket;
let playerID;
let port = 3001;
let service_url = 'https://snakemoney.io';
let balcost = 0;
function openSocket() {
    console.log('socket', window.localStorage.getItem('access_token'));
    socket = io(service_url, {
		path: '/socket.io',
		transports: ['websocket'],//['polling'],
		query: {
				token: 'Bearer ' + window.localStorage.getItem('access_token')
		}
    });
}

console.log("token :", window.localStorage.getItem('access_token'));

window.onload = function () {
	MicroModal.init({
		// onShow: modal => modal.classList.remove('out', 'five').add('five'),
		// onClose: modal => modal.classList.add('out'),
		awaitOpenAnimation: true,
		// awaitCloseAnimation: true,
	});
	document.querySelector('#authorizationButton').addEventListener('click', ()=>{
		if (window.localStorage.getItem('access_token') !== null &&
			window.localStorage.getItem('access_token') !== 'undefined' ) {
                        openSocket();
			personalCabinet();
		} else {
			sendAuthorizationForm();
		}
	});
	// socketConnect();
	document.querySelector('#registrationButton').addEventListener('click', sendRegisterForm);
	document.querySelector('button[data-micromodal-trigger=dengi]').addEventListener('click', () => {
		MicroModal.close('registration');
		MicroModal.show('dengi');
	});
	// document.querySelector('#loose-retry').onclick = () => {
	// 	MicroModal.close('loose');
	// 	playButton.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" ng-attr-stroke="{{config.color}}" ng-attr-stroke-width="{{config.width}}" ng-attr-r="{{config.radius}}" ng-attr-stroke-dasharray="{{config.dasharray}}" stroke="#f7f7f7" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(130.525 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg> ';
	// 	playButton.disabled = true;
	// 	console.log('clicked on playbutton');
	// 	socket.emit('join', null, (e) => {
	// 		playButton.disabled = false;
	// 		playButton.innerHTML = "Play";
	// 		if (e.ok) {
	// 			startGame();
	// 		}
	// 		else {
	// 			notify('Cannot start game. Try to check your balance or reload the page.');
	// 		}
	// 	});
	// };
	document.querySelectorAll('[data-micromodal-close]').forEach(e => e.onclick = function () {
		MicroModal.close(this.closest('.modal').id);
	});
	document.querySelectorAll('#personal .btn-cancel').forEach(e => e.onclick = function() {
		MicroModal.close('personal');
		window.localStorage.removeItem('access_token');
	});
	slider(document.querySelectorAll('#personal .slider-inner'), 0);


	document.getElementById('preloader').remove();
}

function slider(sl, i) {
	if (sl.length) {
		let sliderArr = [].slice.call(sl[0].children);
		sliderArr.forEach(function (sliderItem, index) {
			if (index === i) {
				sliderItem.className = "slider-item active";
				window.localStorage.setItem("skin", sliderItem.getAttribute('data-snake'));
			}
			else sliderItem.className = "slider-item";
		});
		document.querySelector('#personal .btn-next').onclick = (i > sliderArr.length - 2) ? null : function() {
			slider(sl, i + 1);
		}
		document.querySelector('#personal .btn-prev').onclick = (i < 1) ? null : function() {
			slider(sl, i - 1);
		}
	}
}

function updateScore(snake) {
	let totalCoins = document.getElementById('totalCoins'),
		balance = document.getElementById('balance');
		// totalCoins.innerText = snake.foodCount;
		balance.innerText = parseFloat(snake.foodCost) / 100;
}
const sendAuthorizationForm = () => {
	MicroModal.show('authorization');
	const button = document.querySelector('#authorization button[type=submit]');
	button.addEventListener('click', (e) => {
		e.preventDefault();
		const userName = document.querySelector('#authorization  input[name="user-name"]').value.toLowerCase();
		const userPassword = document.querySelector('#authorization input[name="user-password"]').value;
		axios.post( service_url + '/api/login', {
			username: userName,
			password: userPassword
		})
		.then( (response) => {
			console.log(response);
			window.localStorage.setItem("access_token", response.data.access_token);
			window.localStorage.setItem("user_name", response.data.data.username);
			window.localStorage.setItem("user_id", response.data.data._id);
			playerID = window.localStorage.getItem("user_id");
                        window.localStorage.setItem("balance", response.data.data.balance);
                        window.localStorage.setItem("operationalBalance", response.data.data.available_balance);
			console.log('step1');

		}).then(()=>{
			console.log('step2');
                        openSocket();
			personalCabinet();
		})
		.catch(function (error) {
			console.log(error);
		});
	});
};

const notify = (msg) => {
	MicroModal.close('registration');
        MicroModal.show('notify');
	document.querySelector('#notify .message').innerText = msg;
};

function parse_query_string(query) {
	var vars = query.split("&");
	var query_string = {};
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		var key = decodeURIComponent(pair[0]);
		var value = decodeURIComponent(pair[1]);
		// If first entry with this name
		if (typeof query_string[key] === "undefined") {
			query_string[key] = decodeURIComponent(value);
			// If second entry with this name
		} else if (typeof query_string[key] === "string") {
			var arr = [query_string[key], decodeURIComponent(value)];
			query_string[key] = arr;
			// If third or later entry with this name
		} else {
			query_string[key].push(decodeURIComponent(value));
		}
	}
	return query_string;
}


const sendRegisterForm = () => {
	var query = window.location.search.substring(1);
	var qs = parse_query_string(query);
	if (qs.referral) document.querySelector('#registration input[name="referral"]').value = qs.referral;
	MicroModal.show('registration');
	const button = document.querySelector('#registration button[type=submit]');
	button.addEventListener('click', (e) => {
		e.preventDefault();
		const userName = document.querySelector('#registration  input[name="user-name"]').value;
		const userEmail = document.querySelector('#registration  input[name="user-email"]').value;
		const userPassword = document.querySelector('#registration input[name="user-password"]').value;
		const userRef = document.querySelector('#registration input[name="referral"]').value;
		axios.post(service_url + '/api/register', {
			email: userEmail,
			username: userName,
			password: userPassword,
			referrer: userRef
		})
		.then( (response) => {
			console.log(response);
			//document.querySelector('#registration .info-table__inner form').remove();
			//const message = document.createElement('h3');
			notify("Registration succesful! Please log in");
			//document.querySelector('#registration .info-table__inner').appendChild(message);
			window.localStorage.removeItem("access_token");
			// window.localStorage.setItem("user_name", userName);

		})//.then(()=>{
		//	personalCabinet();
		//})
		.catch(function (error) {
			notify(error.response.data.msg);
		});
	});
};

const updateBalance = (balans) => {
	const balance = Math.round(balans.user.balance * 100) / 100;
	const operationalBalance = Math.round(balans.user.avaliable_balance * 100) / 100;
	const reflink = balans.user.ref_link;
	if (balance !== undefined) document.querySelector('#balans').value = balance || 0;
	if (operationalBalance !== undefined) document.querySelector('#operational').value = operationalBalance || 0;
	if (reflink !== undefined) document.querySelector('span.reflink').innerHTML = 'https://snakemoney.io?referral=' + reflink;
	window.localStorage.setItem("balance", balance);
	window.localStorage.setItem("operationalBalance", operationalBalance);
	window.localStorage.setItem("reflink", reflink);
};

function resizeGame() {
    const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;

    var gameCanvas = document.getElementById('frame');
    gameCanvas.width = width;
    gameCanvas.height = height;

}


window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);
var win;
var removeListener = false;
const startGame = () => {

	/*
const checkLimit = function(cb){
		const Http = new XMLHttpRequest();
		const url='http://'+window.location.hostname+':'+port+'/limit';
		Http.open("GET", url);
		Http.send();

		Http.onreadystatechange = (e) => {
		 // console.log(Http.responseText)
		  cb(Http.responseText)
		}
	  }
	  checkLimit(function(e){
		console.log(e);
		 port = parseInt(JSON.parse(e).port);

	  })
	  */
const addEventListenerParent = function(){

if (!removeListener){
	var eventMethod = window.addEventListener
	? "addEventListener"
	: "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent"
? "onmessage"
: "message";





eventer(messageEvent, function (e) {



	if (e.data === "server-disconnect") {
		balcost = 0;
		var setmoney = 0;
		console.log('data-0');
		endGame(setmoney);
	} else  if (e.data === "close-game"){
		var setmoney = balcost || 0;
		console.log('data-1');
		endGame(setmoney);
		balcost = 0;
	} else  if( e.data.type === "update") {
		if(e.data.user > 0){
		balcost = parseFloat(e.data.user).toFixed(4);
		}
		//localStorage.setItem('balance',e.data.user)
	}
	//alert('Message from iframe just came!');

	//console.log(e);
	});

	removeListener = true;
	}
}

	document.querySelector('#game').style.display = 'block';
	MicroModal.close('personal');
	toggleShowHideElement(document.querySelector('#start'));

	var iframe = document.createElement('iframe');
	iframe.style.display = "block";
	iframe.id = "frame";
	iframe.name = "target";
	// iframe.style.width =  window.screen.width;
	// iframe.style.height =  window.screen.height-200;
	iframe.style.border = "0";
	// iframe.style.overflow = "hidden";
	iframe.width =  '100%';
	iframe.frameborder = "0";
	iframe.height =  '100%';
	iframe.src = 'https://www.snake.pp.ua/'//'https://'+window.location.hostname+"/gm"//+":"+port;
	iframe.onload = function(){
		setTimeout(function(){
			var username = localStorage.getItem('user_name');
			var color = localStorage.getItem('skin');
			win = window.frames.target;
			win.postMessage({username:username, color:color}, "*");
			addEventListenerParent(win)
		},1000)
	}
	document.querySelector('#show').appendChild(iframe);
	console.log(iframe.src,'iframe.src')

	resizeGame()

	const endGame = function(setmoney) {

		window.removeEventListener("onmessage", addEventListenerParent, false);
		window.removeEventListener('message', addEventListenerParent, false)

			var balance = setmoney || '0';

			socket.emit('leave', {balance}, (e) => {
				// game.destroy();
				// game = null;
				document.querySelector('#show').innerHTML = '';
				document.querySelector('#game').style.display = 'none';
				MicroModal.show('personal');
				toggleShowHideElement(document.querySelector('#start'));
				if (e.ok) {
					fetch( service_url + '/api/profile', {
						method: 'get',
						headers: {'Authorization': window.localStorage.getItem('access_token')},
					})
						.then(data => data.json())
						.then(data => updateBalance(data));
					if (balance > 0) {
						notify('Congratulations! You earned ' + balance + '$.')
						balcost = 0;
					} else {
						MicroModal.show('loose');
						balcost = 0;
					}

				} else if (e.ok === false) {
					balcost = 0;
					notify('Uh-oh. Something gone wrong.');
				}
			});
        };
	///game.endGame = endGame;
        document.querySelector('#game .btn-cancel').onclick = () => {

		//	balance =
			// const player = game.snakes.find(s => s instanceof PlayerSnake);
			// player.socket.emit('destroyed player',{player_id: player.socket.id, foodsItem:false})
			// const closest = game.snakes.find(s => {
			// 	console.log(Util.distanceFormula(
			// 		s.head.body.x, s.head.body.y, player.head.body.y, player.head.body.y
			// 	));
			// 	return s instanceof BotSnake && Util.distanceFormula(
			// 		s.head.body.x, s.head.body.y, player.head.body.y, player.head.body.y
			// 	) < 500
			// });

			win.postMessage({type:"close-click"}, "*");
			// const closest = false;
			// if (closest) {
			// 	console.log('cannot leave');
			// 	//game.notification.setText('Cannot leave, please move away');
			// 	//setTimeout(() => game.notification.setText(''), 1000);
			// } else {
			// 	console.log(balcost)
			// 	var setmoney = balcost || 0;
			// 	endGame(setmoney);
			// }

		}
	window.onbeforeunload = () => {
            endGame();
	    console.log('onbeforeunload');
	};

	window.unload = () => {
	    endGame();
	    console.log('unload');
	};
	console.log('socketFunc');
};




const toggleShowHideElement = (el) => {
	el.style.display === 'none' ? el.style.display = 'block' : el.style.display = 'none';
};

const personalCabinet = () => {
	console.log("access_token", window.localStorage.getItem('access_token'));
	const playButton = document.querySelector('#playButton');
	MicroModal.close('authorization');
	MicroModal.close('registration');
	MicroModal.show('personal');
	fetch( service_url + '/api/profile', {
		method: 'get',
		headers: {'Authorization': window.localStorage.getItem('access_token')},
	})
		.then(data => data.json())
		.then(data => updateBalance(data));

	document.querySelector('#userName').value = window.localStorage.getItem("user_name");
	playButton.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" ng-attr-stroke="{{config.color}}" ng-attr-stroke-width="{{config.width}}" ng-attr-r="{{config.radius}}" ng-attr-stroke-dasharray="{{config.dasharray}}" stroke="#f7f7f7" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(130.525 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg> ';
	socketConnect();

	console.log('personalCab');
};
let testCOunter = 0;
const socketConnect = () => {
	testCOunter++;
	console.log('testCOunter', testCOunter);
	const playButton = document.querySelector('#playButton');
	try {
//		socket.emit('get_board_config');
//		socket.emit('get_unoccupied_coords');
//		socket.emit('get_food');
//		socket.emit('enable_bots', {enable : false, count : 10});

		socket.on('connect', () => console.log('connect'));
//		getBoardData('board_config', state)
//			.then(config => {
//				getUnoccupiedCoords('unoccupied_coords', state, config);
//				getFood('food', state, config);
//			})
//			.then((res)=>{
            if (socket) {
				playButton.disabled = false;
				playButton.innerHTML = 'Play';
            }
//			});

//		socket.on('update_snakes', ({ snakes }) => {
//			let _newUpdatedSnakes = {};
//			for (let key in snakes) {
//				_newUpdatedSnakes[key] = inverseValues(snakes[key], state.field.config, true);
//			}
//			state.updatedSnakes = _newUpdatedSnakes;
//			console.log('updatedSnakes', state.updatedSnakes);
//		});


		playButton.onclick = () => {
			playButton.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" ng-attr-stroke="{{config.color}}" ng-attr-stroke-width="{{config.width}}" ng-attr-r="{{config.radius}}" ng-attr-stroke-dasharray="{{config.dasharray}}" stroke="#f7f7f7" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(130.525 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg> ';
			playButton.disabled = true;
			console.log('clicked on playbutton');
			socket.emit('join', null, (e) => {
				playButton.disabled = false;
				playButton.innerHTML = "Play";
				if (e.ok) startGame();
				else notify('Cannot start game. Not enough balance or user already in game.'); // //mr startGame();//
			});
		};
	} catch (e) {
		console.log("Catch Error", e);
	}

	socket.on('server_error', data => console.log("ERROR:",  data));

}


const inverseValues = (coors, config, toNegative = false) => {
	if (coors !== undefined && coors !== null && coors.length>0) {
		let transformedCoors = [];
		coors.map( coor => {
			if (toNegative === false) {
				transformedCoors.push({
					x: Math.round(coor.x + config.WIDTH/2),
					y: Math.round(coor.y + config.HEIGHT/2),
				});
			} else {
				transformedCoors.push({
					x: Math.round(coor.x - config.WIDTH/2),
					y: Math.round(coor.y - config.HEIGHT/2),
				});
			}
		} );
		return transformedCoors;
	}
}

const convertObjectToArr = (obj) => {
	let otherPlayers = [];
	for (let key in obj){
		otherPlayers.push(obj[key]);
	}
	return otherPlayers;
}

//
// async function f() {
//
// 	let promise = new Promise((resolve, reject) => {
// 		setTimeout(() => resolve("готово!"), 3000)
// 	});
//
// 	let result = await promise; // будет ждать, пока промис не выполнится (*)
//
// 	console.log(result); // "готово!"
// }
//
// f();


async function getBoardData(eventName, state) {
	let promise = new Promise((resolve, reject) => {
		socket.on(eventName, data => {
			resolve(data);
		});
	});
	let result = await promise;
	return state.field.config = result;

}

async function getUnoccupiedCoords(eventName, stateTarget, config) {
	let promise = new Promise((resolve, reject) => {
		socket.on(eventName, (data) => {
			try {
				resolve(data);
			} catch (e) {
				reject(new Error(`error ${e}`));
			}

		});
	});
	let result = await promise;
	result = await inverseValues(result.coords, config, true);
	// result.unshift({ x : null, y : null });
	stateTarget.playerCoors = result;
	console.log('playerCoors', result);
	return result;
}


async function getFood (eventName, stateTarget, config) {
	let promise = new Promise((resolve, reject) => {
		socket.on(eventName, (data) => {
			resolve(data);
		});
	});
	let result = await promise;
	result = await inverseValues(result.food, config, true);
	stateTarget.food = result;
	// console.log(stateTarget.food);
}




// function render () {
//
// 	var x = 32;
// 	var y = 0;
// 	var yi = 32;
//
// 	game.debug.text('Viewport', x, y += yi);
//
// 	game.debug.text('Viewport Width: ' + game.scale.viewportWidth, x, y += yi);
// 	game.debug.text('window.innerWidth: ' + window.innerWidth, x, y += yi);
// 	game.debug.text('window.outerWidth: ' + window.outerWidth, x, y += yi);
//
// 	game.debug.text('Viewport Height: ' + game.scale.viewportHeight, x, y += yi);
// 	game.debug.text('window.innerHeight: ' + window.innerHeight, x, y += yi);
// 	game.debug.text('window.outerHeight: ' + window.outerHeight, x, y += yi);
//
// 	game.debug.text('Document', x, y += yi*2);
//
// 	game.debug.text('Document Width: ' + game.scale.documentWidth, x, y += yi);
// 	game.debug.text('Document Height: ' + game.scale.documentHeight, x, y += yi);
//
// 	//  Device: How to get device size.
//
// 	//  Use window.screen.width for device width and window.screen.height for device height.
// 	//  .availWidth and .availHeight give you the device size minus UI taskbars. (Try on an iPhone.)
// 	//  Device size is static and does not change when the page is resized or rotated.


//
// 	x = 350;
// 	y = 0;
//
// 	game.debug.text('Device', x, y += yi);
//
// 	game.debug.text('window.screen.width: ' + window.screen.width, x, y += yi);
// 	game.debug.text('window.screen.availWidth: ' + window.screen.availWidth, x, y += yi);
// 	game.debug.text('window.screen.height: ' + window.screen.height, x, y += yi);
// 	game.debug.text('window.screen.availHeight: ' + window.screen.availHeight, x, y += yi);
//
// }


window.addEventListener('keydown', function(e){
	const { code } = e;
	code === "Delete" ? console.log(code) : null;

});

document.querySelector('#replenish form').onsubmit = function(e) {
    e.preventDefault();
    const data = new URLSearchParams();
    for (const pair of new FormData(e.target)) {
        data.append(pair[0], pair[1]);
    }

    fetch(e.target.action, {
        method: 'post',
        body: data,
        headers: {'Authorization': window.localStorage.getItem('access_token')},
    })
    .then(res => res.json())
    .then(res => {
        document.write(res.form);
    //    document.getElementById('FORM_pay_ok').submit();
    });
};

document.querySelector('#dengi form').onsubmit = function(e) {
	e.preventDefault();
	const data = new URLSearchParams();
	for (const pair of new FormData(e.target)) {
		data.append(pair[0], pair[1]);
	}

	fetch(e.target.action, {
		method: 'post',
		body: data,
		headers: {'Authorization': window.localStorage.getItem('access_token')},
	})
		.then(res => res.json())
		.then(res => notify(res.msg));
}

document.querySelector('#payer').onclick = function(e) {
	e.preventDefault();
	let amount = document.querySelector('#amount').value;
	let data = JSON.stringify({payment_system: 'payeer', amount: amount})
	console.log(data);
	fetch(service_url+'/api/profile/add_funds', {
		method: 'post',
		body: data,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': window.localStorage.getItem('access_token')
		},
	})
	.then(res => res.json())
		.then(res => document.write(res.form));
	setTimeout(function(){
		document.getElementById('FORM_pay_ok').click()
	},1500);
}

let nav = document.getElementById("authorizationButton").parentElement
console.log(nav)

function toggleClass() {
	console.log("TOOGGG")
	if (document.documentElement.clientWidth <= '780' ) {
		nav.classList.remove('bottom-bar');
		nav.classList.remove('d-flex');
		nav.classList.remove('justify-content-between');
		nav.classList.add('menu');
	}
}

function returnClass() {
	console.log("RE")
	if (document.documentElement.clientWidth > '780' ){
		nav.classList.remove('menu');
		nav.classList.add('bottom-bar');
		nav.classList.add('d-flex');
		nav.classList.add('justify-content-between');
	}
}
toggleClass();
returnClass();
window.onresize = function(event) {
	toggleClass();
	returnClass();
};

// if ( /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
	var clickableElements = ".x-anchor-toggle, button, .x-anchor-button, li.menu-item, input.submit, .x-scroll-top";
	jQuery(clickableElements).bind("touchend", function (e) {
		e.preventDefault();
		jQuery(this).trigger("click");
	});
// }
