let username = document.getElementById('utilizador');
let BtnLogin = document.getElementById('BtnLogin');
let messageBox = document.getElementById('messageBox');
const message = "Informe o nome do utilizador";
BtnLogin.disabled = true;
function eVazio(){
    if (username.value === '') {
        return true;
    }else {
        return false;
    }
}
function foco(){
    console.log("Entrou");
    messageBox.style.display = "none";
    BtnLogin.disabled = false;
}
function desfoco(){
    if(this.eVazio()){
        console.log("Saiu");
        messageBox.innerText = message;
        messageBox.style.display = "block";
        BtnLogin.disabled = true;
    }  
}

BtnLogin.onclick = function(event){
    event.preventDefault();
    if(username.value === ''){
        messageBox.innerText = message;
        messageBox.style.display = "block";
    }else{
        sessionStorage.setItem('username', username.value);
        window.location.href = "menu.html";
    }
}