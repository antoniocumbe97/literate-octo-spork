function highScores(){
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    let listScores = document.getElementById('highScores');
    let posRank = 0;
    listScores.innerHTML = highScores.map(score => {
        posRank++;
        return `<tr><th scope="row">${posRank}</th><td>${score.subject}</td><td class="text-center">${score.score}</td><td class="text-center">${score.time}</td></tr>`;
    }).join(''); 
    document.getElementById('username').innerText = sessionStorage.getItem('username');
}
this.highScores();
/**
 * Personal HighScore
 * function highScores(){
	const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
	let lastscore = certas;
	const score = {
		score: lastscore,
		time: time.textContent,
		name: sessionStorage.getItem('username')
	}
	highScores.push(score);
	highScores.sort((a,b)=>{
		return b.score - a.score;
	});
	highScores.splice(5);
	console.log(highScores);
	localStorage.setItem('highScores',JSON.stringify(highScores));
	console.log(localStorage.getItem('highScores'))
}

*/