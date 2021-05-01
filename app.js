let progressBar = document.getElementById('progress');
let question = document.getElementById('perguntas');
let options = document.querySelectorAll('label');
let score = document.getElementById('pontuacao');
let result = document.getElementById('endGame');
let playing = document.getElementById('playing');
let subject = document.getElementById('disciplina');
let time = document.getElementById('time');
let resultMessage = document.getElementById('result');
let resultImage = document.getElementById('image');
let username = document.getElementById('usuario');
let levelComplete = document.getElementById('nivel');
let btnBox = document.getElementById('btnBox');

const Levels =[{
	"level":"1",
	"optionBG":"#0c4b33",
	"optionColor":"#f5f5f5",
	"questionBG":"#d4edda",
	"questionBorder":"#bee5eb",
	"questionColor":"#155724",	
},{
	"level":"2",
	"optionBG":"#563d7c",
	"optionColor":"#f5f5f5",
	"questionBG":"#d5d0df",
	"questionBorder":"1px solid #bbadd2",
	"questionColor":"#004085",
},{
	"level":"3",
	"optionBG":"#721c24",
	"optionColor":"#f5f5f5",
	"questionBG":"#f8d7da",
	"questionBorder":"1px solid #d6a7ab",
	"questionColor":"#004085",
},{
	"level":"4",
	"optionBG":"#002752",
	"optionColor":"#f5f5f5",
	"questionBG":"#cce5ff",
	"questionBorder":"1px solid #6badd6",
	"questionColor":"#004085",
},{
	"level":"5",
	"optionBG":"#383d41",
	"optionColor":"#f5f5f5",
	"questionBG":"#e2e3e5",
	"questionBorder":"1px solid #d6d8db",
	"questionColor":"#383d41",
}];

const Question = {
	current: Number,
	sequence: Array,
	all: Array,
	next(){
		if(this.current < this.all.length-1){
			this.current++;
			return true;
		}
		return false;
	},
	show(){
		return this.all[this.sequence[this.current]];
	},
	check(answer){
		if ((this.all[this.sequence[this.current]].answer) === answer) {
			return true;		
		} else{
			return false;
		}
	},
}

let Quiz = {
	username: String,
	subject: String,
	level: Number,
	countTotal: Number,
	countIncorrect: Number,
	currentScore: Number,
	countCorrect: Number,
	progress: Number,
	pause: Boolean,
	attrStatus: String,
	status(){
		if(this.countIncorrect === 4){
			this.attrStatus = 'lost';
		}else if(this.countCorrect === (this.level*6)){
			this.attrStatus = 'win';
		}
		return this.attrStatus;
	},

}

const Timer = {
	secunds: Number,
	minutes: Number
}

function randomQuestions(){
	const SizeQuestions = Question.all.length;
	let num = new Array(SizeQuestions);
	for(let i=0; i<SizeQuestions; i++){ //laço para percorrer todo o vetor
		let randomNumber = Math.floor(Math.random()*SizeQuestions); //gerando número aleatório
		let found = false; //para saber se o numero foi encontrado ou não no vetor
		for(let count=0; count<i; count++){ //função que percorre o vetor até onde já tenha sido preenchido
			if(num[count] == randomNumber){ //verifica se o item no vetor é igual ao gerado
				found = true; //se é igual a variável found recebe verdadeiro
				break; //e o laço de verificação é interrompido
			}else{//se não é igual
				found = false; //variável found recebe falso
			}
		} //fim do laço que verifica a existência do numero no vetor
		if(!found){ //se found é igual a false
			num[i] = randomNumber; //o indice do vetor recebe o número gerado
		}else{ //se é verdadeiro
			i--; //o índice é decrementado para que haja um novo teste
		}
	} // fim do laço que percorre todo o vetor
	return num;
}

function newGame(){

	score.innerText = 0;  //
	Timer.segundos = 0; Timer.minutos = 0;

	Question.all = questionsCategory();
	Question.sequence = randomQuestions();
	Question.current = 0;
	/* create new session's for Questions, thats prevent lose the data even the page reload */

	sessionStorage.setItem('allQuestion', questionsCategory());
	sessionStorage.setItem('sequenceQuestion', randomQuestions());
	sessionStorage.setItem('currentQuestion', 0);

	Quiz.attrStatus = 'playing';
	Quiz.level = 1;
	Quiz.progress = 100;
	Quiz.countTotal = 0;
	Quiz.currentScore = 0;
    Quiz.countCorrect = 0;
	Quiz.countIncorrect = 0;
	Quiz.subject = sessionStorage.getItem('disciplina');
	Quiz.username = localStorage.getItem('username');
	subject.innerText = Quiz.subject; 
	username.innerText = Quiz.username;
	/* create new session's for Game, thats prevent lose the data even the page reload */
	sessionStorage.clear('statusLevel');
	sessionStorage.setItem('statusLevel',JSON.stringify(Quiz));

	
	/* call to first question */
	showQuestion(Question.show());
	//setTimeout(setInterval(timeCounter, 1000), 1500);

}

function checkAnswer(answer){
	disableOption()
	if (Question.check(answer)) {
		Quiz.currentScore += 50;
		Quiz.countCorrect++;
		options[answer-1].style.backgroundColor = '#28a745';
	} else{
		Quiz.progress -= 25;
		Quiz.countIncorrect++;
		options[answer-1].style.backgroundColor = '#e42d3b';
		options[Question.all[Question.sequence[Question.current]].answer-1].style.backgroundColor = '#28a745';
	}
	Quiz.countTotal++;
	setTimeout(update, 1500);
}

function update(){
	saveStatus();
	score.innerText = Quiz.currentScore;
	progressBar.style.width = Quiz.progress+'%';
	if(Quiz.status() === 'lost'){
		endGame();
		resultImage.src = "../assets/img/over.jpg";
		resultMessage.innerText = "Infelizmente!";
		levelComplete.innerText = "Perdeu no - "+Quiz.level+"º nível";
		resultMessage.style.color = "#dc3545";
		btnBox.innerHTML = `
			<div class="col-6">
				<button class="btn btn_area btn-block" id="BtnL1" onclick="endGameOption('restart')"><i class="fa fa-refresh fa-lg fa-fw"></i>Reiniciar</button>
			</div>
			<div class="col-6">
				<button class="btn btn-danger btn-block" id="BtnL2" onclick="endGameOption('quit')"><i class="fa fa-times fa-lg fa-fw"></i>sair</button>
			</div>
		`;
	}else if(Quiz.status() === 'win'){
		endGame();
		resultImage.src = "../assets/img/win2.svg";
		resultMessage.innerText = "Parabéns!";
		levelComplete.innerText = "Completou - "+Quiz.level+"º nível";
		resultMessage.style.color = "#02442a";
		btnBox.innerHTML = `
			<div class="col-12">
				<button class="btn btn_area btn-block" id="Btnw" onclick="endGameOption('next')">Proximo nível <i class="fa fa-arrow-right fa-lg fa-fw"></i></button>
			</div>
		`;
	}else if(Question.next()){
		showQuestion(Question.show());
	}else{
		console.log('Acabaram questoes!')
	}
}

function endGameOption(option){
    if(option === 'restart'){
		//window.location.href = "../views/game.html";
		/*
		Quiz = JSON.parse(sessionStorage.getItem('statusLevel'));
		console.log(Quiz);
		Quiz.progress = 100;
		Quiz.countIncorrect = 0;
		Quiz.attrStatus = 'playing';
		result.style.display = 'none';
		playing.style.display = 'block';
		*/
		setTimeout(window.location.href = "../views/menu.html", 2000);
    }else if(option === 'ranking'){
		window.location.href = "./ranking.html";
    }else if(option === 'quit'){
		window.location.href = "./menu.html";
	}else if(option === 'next'){
		Quiz.level++;
		Quiz.progress = 100;
		Quiz.countIncorrect = 0;
		Quiz.attrStatus = 'playing';
		result.style.display = 'none';
		playing.style.display = 'block';
		setTimeout(update(), 2000);
	}
}

function endGame(){
	playing.style.display = 'none';
	result.style.display = 'block';
	document.getElementById('countCorrect').innerText = Quiz.countCorrect;
	document.getElementById('countIncorrect').innerText = Quiz.countIncorrect;
	document.getElementById('countTotal').innerText = Quiz.countTotal;
}

function disableOption(){
	options[0].onclick = function(){}
	options[1].onclick = function(){}
	options[2].onclick = function(){}
	options[3].onclick = function(){}
}

function enableOption(){
	options[0].onclick = function(){checkAnswer('1');}
	options[1].onclick = function(){checkAnswer('2');}
	options[2].onclick = function(){checkAnswer('3');}
	options[3].onclick = function(){checkAnswer('4');}
}

function showQuestion(q){
	question.innerText = q.question;
	options[0].innerText = q.option1;
	options[1].innerText = q.option2;
	options[2].innerText = q.option3;
	options[3].innerText = q.option4;
	username.style.color = Levels[Quiz.level-1].optionBG;
	progressBar.style.backgroundColor = Levels[Quiz.level-1].optionBG
	question.style.border = Levels[Quiz.level-1].questionBorder;
	question.style.backgroundColor = Levels[Quiz.level-1].questionBG
	question.style.color = Levels[Quiz.level-1].questionColor;
	options[0].style.backgroundColor = Levels[Quiz.level-1].optionBG;
	options[1].style.backgroundColor = Levels[Quiz.level-1].optionBG;
	options[2].style.backgroundColor = Levels[Quiz.level-1].optionBG;
	options[3].style.backgroundColor = Levels[Quiz.level-1].optionBG;
	enableOption();
}

function saveStatus(){
	let t = JSON.parse(sessionStorage.getItem('statusLevel'));
	console.log('countIncorrect :'+Quiz.countIncorrect)
	if((Quiz.countIncorrect > t.countIncorrect) && (Quiz.level === t.level))
	{
		Atual = Quiz.countIncorrect;
		console.log(`Atual Recebeu countIncorrect ${Quiz.countIncorrect} e ficou ${Atual}`)
		console.log('countIncorrect guardado no sesstionStorage :'+t.countIncorrect)
		let Acumulado = t.countIncorrect+Quiz.countIncorrect;
		console.log(`Acumulado recebeu countIncorrect guardado no sesstionStorage ${t.countIncorrect} somou com countIncorrect ${Quiz.countIncorrect} e ficou ${Acumulado}`);
		Quiz.countIncorrect = Acumulado;
		console.log(`countIncorrect recebeu Acumulado ${Acumulado} e ficou ${Quiz.countIncorrect}`);
		sessionStorage.setItem('statusLevel',JSON.stringify(Quiz));
		Quiz.countIncorrect = Atual;
		console.log('countIncorrect  recebeu Atual: '+Quiz.countIncorrect);
	}else{
		sessionStorage.setItem('statusLevel',JSON.stringify(Quiz));		
	}
	console.log('Gravou countIncorrect no sesstionStorage '+Quiz.countIncorrect);
	console.log(JSON.parse(sessionStorage.getItem('statusLevel')));
	console.log(JSON.parse(sessionStorage.getItem('allQuestion')));
	console.log(JSON.parse(sessionStorage.getItem('sequenceQuestion')));
	console.log(sessionStorage.getItem('currentQuestion'));
	console.log('')
}


newGame();
/*
function saveScore(){
	sessionStorage.setItem('lastscore',certas);
	sessionStorage.setItem('time',time.textContent);

	const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
	const score = {
		score:   sessionStorage.getItem('lastscore'),
		time:    sessionStorage.getItem('time'),
		subject: sessionStorage.getItem('disciplina')
	}
	highScores.push(score);
	highScores.sort((a,b)=>{
		return b.score - a.score;
	});
	highScores.splice(5);
	localStorage.setItem('highScores',JSON.stringify(highScores));
	sessionStorage.clear('lastscore');
	sessionStorage.clear('time');
	
	console.log('Gravou');
}
function timeCounter(){
	if((status)){
		segundos++;
	}
	time.innerHTML = minutos+":"+segundos;
    if(segundos === 59){
        minutos++;
        segundos = 0;
	}
}

BtnPausePlay.addEventListener('click', e =>{ 
	if(e.target.textContent === 'Pausar'){
		status = false;
		pause = true;
		e.target.textContent = 'Continuar';
	}else{
		pause = false;
		status = true;
		e.target.textContent = 'Pausar';
	}
});
*/
