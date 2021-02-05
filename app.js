let certas = 0; let contCerto = 0; let total = 0; let vida = 50;
let segundos = 0; let minutos = 0; let questaoActual = 0;
const totalQuestoes = pergunta.length;
let num = new Array(totalQuestoes);
let pontos = document.getElementById('pontuacao');
let vidaMais = document.getElementById('vidaMais');
let perguntas = document.getElementById('perguntas');
let myBody = document.querySelectorAll('label');
document.getElementById('usuario').innerText = sessionStorage.getItem('username');
perguntaAleatoria();

function perguntaAleatoria(){
	//document.getElementById('endGame').style.display = "none";
	 //criando vetor com 9 posições
	for(let i=0; i<totalQuestoes; i++){ //laço para percorrer todo o vetor
		let randomico = Math.floor(Math.random()*totalQuestoes); //gerando número aleatório
		let existe = false; //para saber se o numero existe ou não no vetor
		for(let cont=0; cont<i; cont++){ //função que percorre o vetor até onde já tenha sido preenchido
			if(num[cont] == randomico){ //verifica se o item no vetor é igual ao gerado
				existe = true; //se é igual a variável existe recebe verdadeiro
				break; //e o laço de verificação é interrompido
			}else{//se não é igual
				existe = false; //existe recebe falso
			}
		} //fim do laço que verifica a existência
		if(!existe){ //se existe é igual a false
			num[i] = randomico; //o indice do vetor recebe o número gerado
		}else{ //se é verdadeiro
			i--; //o índice é decrementado para que haja um novo teste
		}
	} // fim do laço que percorre todo o vetor
	console.log(num);
	questoes();
	setInterval(timeCounter,1000);
}

function questoes(){
	pontos.innerText = certas;
	vidaMais.style.width = vida+"%";
	if(status()){
		let p = pergunta[num[questaoActual]];
		perguntas.innerText = p.question;
		myBody[0].innerText = p.option1;
		myBody[1].innerText = p.option2;
		myBody[2].innerText = p.option3;
		myBody[3].innerText = p.option4;
		myBody[0].style.backgroundColor = '#0c4b33';
		myBody[1].style.backgroundColor = '#0c4b33';
		myBody[2].style.backgroundColor = '#0c4b33';
		myBody[3].style.backgroundColor = '#0c4b33';
	}
}

function verficarResposta(resposta){
	if ((pergunta[num[questaoActual]].answer) == resposta) {
		certas += 5;
		vida += 5;
		contCerto++;
		myBody[resposta-1].style.backgroundColor = '#28a745';		
	} else{
		vida -= 5;
		myBody[resposta-1].style.backgroundColor = '#e42d3b';
		myBody[pergunta[num[questaoActual]].answer-1].style.backgroundColor = '#28a745';
	}
	total++;
	setTimeout(questoes, 1000);
	setTimeout(proximaPergunta, 1000);
}

function status(){
	if (vida >= 100 || questaoActual > (totalQuestoes-1)) {
		document.getElementById('image').src = "../assets/img/win1.png";
		document.getElementById('result').innerText = "Parabéns!";
		document.getElementById('contCerto').innerText = ""+contCerto+'/'+total+"";
		document.getElementById('endGame').style.display = "block";
		document.getElementById('playing').style.display = "none";
		document.getElementById('disciplina').innerText = sessionStorage.getItem('disciplina');
		myBody[0].style.display = 'none';
		myBody[1].style.display = 'none';
		myBody[2].style.display = 'none';
		myBody[3].style.display = 'none';
		return false;
	}else if (vida <= 0  || questaoActual > (totalQuestoes-1)){
		document.getElementById('image').src = "../assets/img/over.jpg";
		document.getElementById('result').innerText = "Opah!";
		document.getElementById('contCerto').innerText = ""+contCerto+'/'+total+"";
		document.getElementById('endGame').style.display = "block";
		document.getElementById('playing').style.display = "none";
		document.getElementById('disciplina').innerText = sessionStorage.getItem('disciplina');
		myBody[0].style.display = 'none';
		myBody[1].style.display = 'none';
		myBody[2].style.display = 'none';
		myBody[3].style.display = 'none';
		return false;
	}
	return true;
}

function proximaPergunta(){
	if(questaoActual <= (totalQuestoes-1)){
		questaoActual++;
		questoes();
	}
}

function timeCounter(){
    if(segundos === 59){
        minutos++;
        segundos = 0;
	}
	var time = minutos+":"+segundos;
	document.getElementById('time').innerHTML = time;
	if((vida < 100) && (vida > 0) && (questaoActual <= (totalQuestoes-1))){
		segundos++;
	}	
}
function endGame(option){
    if(option === 'restart'){
		window.location.href = "../views/game.html";
    }else{
		window.location.href = "login.html";
    }
}
