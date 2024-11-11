var btn = document.getElementById("animals");
var cont = document.getElementById("info");
var img = document.getElementById("image");
var pro = document.getElementById("pokeTable");
var team = document.getElementById("team");
var myModal = document.getElementById("modalInfo");
var modalBack = document.getElementById("backdrop");
var modalTitle = document.getElementById("pokeName");
var modalBody = document.getElementById("desc");
var cards = document.getElementById("pokeCards");
var cardsR = document.getElementById("pokeCardsR");
var pokemon;
var dType = "";

//localStorage.clear()

function queryR(){
    var req = new XMLHttpRequest();
    req.open('GET', 'https://pokeapi.co/api/v2/pokemon/?limit=251')
    req.onload = function() {
        let data = JSON.parse(req.responseText);
        pokemon = data.results
        loadTable();
        loadC();
    };
    req.send();
}

experimental();

function openModal() {
    modalBack.style.display = "block";
    myModal.style.display = "block"
    myModal.classList.add("show")
}

function closeModal() {
    modalBack.style.display = "none";
    myModal.style.display = "none";
    myModal.classList.remove("show");
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == myModal) {
    closeModal()
  }
}

pro.addEventListener("click", function(){
    if(pro.innerText === "Cards"){
        pro.innerText = "Table";
        document.getElementById("pokeCards").hidden = true;
        document.getElementById("poke").hidden = false;
        pro.classList.add("btn-info");
        pro.classList.remove("btn-success");
    }
    else{
        pro.innerText= "Cards";
        document.getElementById("pokeCards").hidden = false;
        document.getElementById("poke").hidden = true;
        pro.classList.remove("btn-info");
        pro.classList.add("btn-success");
    }
});

async function createTeam (name){
    let newItem = document.getElementById(name)
    let dataPC = `addTeamC${name}`
    let dataP = `addTeam${name}`
    console.log(dataP)
    if(newItem){
        await newItem.parentNode.parentNode.remove();
        localStorage.removeItem(name)
        document.getElementById(dataP).classList.remove("btn-warning");
        document.getElementById(dataP).classList.add("btn-primary");
        document.getElementById(dataPC).classList.remove("btn-warning");
        document.getElementById(dataPC).classList.add("btn-primary");
        teamChecker();
    }
    
    else{
        if(localStorage.length > 5){
            modalBody.innerText = "No more pokemon can be added";
            modalTitle.innerText = "Your team is complete";
            openModal();
            return false;
        }
        document.getElementById(dataP).classList.add("btn-warning");
        document.getElementById(dataP).classList.remove("btn-primary");
        document.getElementById(dataPC).classList.add("btn-warning");
        document.getElementById(dataPC).classList.remove("btn-primary");
        let json = await dataCardPoke(name);
        if(localStorage.getItem(name) === null){
            localStorage.setItem(name, JSON.stringify(json))
        }
        addToTeam(json);
        teamChecker();
        //experimental();
    }
}

async function createRandomTeam(){
	removeAllPoke();
	if(localStorage.length > 6){
		return false;
	}
	
	for(let i = 0; i <= 5; i++){
		const randIndex = Math.floor(Math.random() * pokemon.length)
		let name = pokemon[randIndex].name
		if(localStorage.getItem(name) !== null){
			randIndex = Math.floor(Math.random() * pokemon.length)
			name = pokemon[randIndex].name
		}
		let dataP = `addTeam${name}`
        let dataPC = `addTeamC${name}`
		let json = await dataCardPoke(name)
		localStorage.setItem(name, JSON.stringify(json))
		document.getElementById(dataP).classList.add("btn-warning");
		document.getElementById(dataP).classList.remove("btn-primary");
        document.getElementById(dataPC).classList.add("btn-warning");
        document.getElementById(dataPC).classList.remove("btn-primary");
		addToTeam(json);

	}
	teamChecker();
	//experimental();
}

async function fillModal(row){
    let pokeNum = parseInt(row.cells[0].innerHTML)+1
	let name = row.cells[1].innerHTML
	let json = await dataPoke(name)
	let type = stringTypes(json.type)
	let moves = stringMoves(json.moves)
    modalBody.innerHTML = `
	<img src="${json.sprite}"/>
	<p>
		Number: ${pokeNum}<br>
		Name: ${name}<br>
		Types: ${type}<br>
		Moves: ${moves}<br>
		Weight: ${json.weight}
	</p>
	`;
    modalTitle.innerText = name;
    openModal();
}


async function fillModalC(name){
    let pokeNum = pokemon.findIndex(poke => poke.name===name);
	let json = await dataPoke(name)
	let type = stringTypes(json.type)
	let moves = stringMoves(json.moves)
    modalBody.innerHTML = `
	<img src="${json.sprite}"/>
	<p>
		Number: ${pokeNum+1}<br>
		Name: ${name}<br>
		Types: ${type}<br>
		Moves: ${moves}<br>
		Weight: ${json.weight}
	</p>
	`;
    modalTitle.innerText = name;
    openModal();
}

function teamChecker(){
    let storageL = localStorage.length;
    if(storageL > 0){
        document.getElementById("deleteTeam").hidden = false;
    }
    else{
        document.getElementById("deleteTeam").hidden = true;
    }
}
function experimental(){
    teamChecker();
    let storageL = localStorage.length;
    for(let i = 0; i <= (storageL-1); ++i){
        addToTeam(JSON.parse(localStorage.getItem(localStorage.key(i))))
    }
}

function removeAllPoke (){
    let storageL = localStorage.length;
    for(let i = 0; i <= (storageL-1); ++i){
        var name = localStorage.key(i);
        document.getElementById(name).parentNode.parentNode.remove();
        let dataP = `addTeam${name}`
        let dataPC = `addTeamC${name}`
        document.getElementById(dataP).classList.remove("btn-warning");
        document.getElementById(dataP).classList.add("btn-primary");
        document.getElementById(dataPC).classList.remove("btn-warning");
        document.getElementById(dataPC).classList.add("btn-primary");
    }
    document.getElementById("deleteTeam").hidden = true;
    localStorage.clear();
}


function addToTeam(json){
    let types = stringTypes(json.type);
    var newCol = `<div class="p-2 col-12 col-md-6 col-lg-4">
                    <div class="card">
                        <div class="card-body" id=${json.name}>
                            <img src="${json.fsprite}" class="img-poke">
                            <img src="${json.bsprite}" class="img-poke">
                            <h5 class="card-title">
                                ${json.name}
                            </h5>
                            <p class="card-text">
                                ${types}
                            </p>
                        </div>
                    </div>
                </div>`
    team.insertAdjacentHTML('beforeend', newCol);
}

async function dataCardPoke(name){
	let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
	try {
		let response = await fetch(url);
		let results = await response.json();
			return {
				name: name,
				fsprite: results.sprites.front_default,
				bsprite: results.sprites.back_default,
				type: results.types,
			};
	} catch (error) {
		console.error("PokeAPI is Down");
	}

	return results;
}

async function dataPoke(name){
	let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
	try {
		let response = await fetch(url);
		let results = await response.json();
			return {
				sprite: results.sprites.front_default,
				type: results.types,
				moves: results.moves,
				weight: results.weight
			};
	} catch (error) {
		console.error("PokeAPI is Down");
	}

	return results;
}

function stringTypes(json) {
	let newStr = ""
	json.map(e => {
		newStr += e.type.name + " "
	})
	return newStr
}

function stringMoves(json){
	let newStr = ""
	let cont = 0
	json.map(e => {
		if(cont > 4){
			return newStr;
		}
		if (cont===4){
			newStr += e.move.name;
			cont += 1;
		}
		else{
			newStr += e.move.name + ", ";
			cont += 1;
		}
	})
	return newStr
}
/*btn.addEventListener("click", function() {
    var req = new XMLHttpRequest();
    req.open('GET', 'https://learnwebcode.github.io/json-example/animals-1.json')
    req.onload = function() {
        var data = JSON.parse(req.responseText);
        console.log(data);
        renderHTML(data);
    };
    req.send();
});

function renderHTML(data){
    var strHTML = "";
    
    for(i = 0; i < data.length; i++){
        strHTML += "<p> " + data[i].name + "</p>"
        
    }
    cont.insertAdjacentHTML('beforeend', strHTML);
}*/

function loadTable (){
    var table = document.getElementById("poke");
    
    for(i = 0; i < pokemon.length; i++){
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        //var cell4 = row.insertCell(3);
        cell1.innerHTML = i;
        cell2.innerHTML = pokemon[i].name;
        //cell3.innerHTML = data[i].species;
        if(localStorage.getItem(pokemon[i].name)){
            btnTeam = "btn-warning"
        }
        else{
            var btnTeam = "btn-primary";
        }
        var btns = `<button class="btn btn-danger" id ="showD" onclick="fillModal(this.parentNode.parentNode)">Details</button>
        <button class="btn ${btnTeam} rounded-0" id ="addTeam${pokemon[i].name}" onclick="createTeam(this.parentNode.parentNode.cells[1].innerHTML)">Add to Team</button>`
        cell3.innerHTML = btns;
    }
    
}

async function loadC (){
    var btnTeam;
    for(i = 0; i < pokemon.length; i++){
        let json = await dataCardPoke(pokemon[i].name);
        if(localStorage.getItem(pokemon[i].name)){
            btnTeam = "btn-warning"
        }
        else{
            btnTeam = "btn-primary";
        }
        loadCards(json, btnTeam);
    }
}

function loadCards(json, btnTeam){
    let types = stringTypes(json.type);
    var newPok = `<div class="col-12 col-md-6 col-lg-4 mb-2">
                    <div class="card">
                        <div class="card-body" id=card${json.name}>
                            <img src="${json.fsprite}" class="img-poke">
                            <img src="${json.bsprite}" class="img-poke">
                            <h5 class="card-title">
                                ${json.name}
                            </h5>
                            <p class="card-text">
                                ${types}
                            </p>
                            <button class="btn btn-danger" id ="showD" onclick="fillModalC(this.parentNode.getElementsByClassName('card-title')[0].innerText)">Details</button>
                            <button class="btn ${btnTeam} rounded-0" id ="addTeamC${json.name}" onclick="createTeam(this.parentNode.parentNode.getElementsByClassName('card-title')[0].innerText)">Add to Team</button>
                        </div>
                    </div>
                </div>`
    cardsR.insertAdjacentHTML('beforeend', newPok);
}

queryR();
/*$(document).ready(function () {
    
})*/