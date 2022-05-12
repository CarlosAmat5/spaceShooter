const ship= document.querySelector('.player-ship') //. para Chamar por class
const gameArea= document.querySelector('#main-play-area')//# para chamar po id
const enemysImg= ['img/enemy1.png', 'img/enemy2.png', 'img/enemy3.png']
const instructionsText=document.querySelector('.game-instructions')
const startButton=document.querySelector('.start-button')
let enemyInterval

//Movimenta e atira um raio laser
function flyShip(event){ //eventos do teclado
    if(event.key === 'ArrowUp'){ //evento tecla com direção para cima
        event.preventDefault() // preventDeffault para prevenir o padrao do browser
        moveUp()
    } else if(event.key=== 'ArrowDown'){//tecla direção para baixo
        event.preventDefault()
        moveDown()
    } else if(event.key===" "){ //tecla "space"
        event.preventDefault
        fireLaser()
    }
}

//função de subir
function moveUp(){
    let topPosition = getComputedStyle(ship).getPropertyValue('top') //atribuir o codigo css do elemento html
    if(topPosition === "0px"){
        return
    } else{
        let position= parseInt(topPosition) //traz o valor do codigo top do elemento ship, convertido em número
        position-=50
        ship.style.top =`${position}px`
    }
}

//função para descer
function moveDown(){
    topPosition=getComputedStyle(ship).getPropertyValue('top') //getComputedStyle traz toda a propriedade css da divd html
    if(topPosition=== "510px"){
        return
    } else{
        let position=parseInt(topPosition)
        position+=50
        ship.style.top=`${position}px` //atribuição para movimentar a nave
    }
}

//Funcionalidade de tiro
function fireLaser(){
    let laser= createLaserElement() //cria um elemento novo
    gameArea.appendChild(laser) //introduz esse elemento na tela
    moveLaser(laser) //função para movimentar esse elemento (tiro laser)
}

function createLaserElement(){//O laser vai ter sair da nave ("ship"), temos que pegar as propiedades nas quais ele estará ubicado 
    let xPosition=parseInt(window.getComputedStyle(ship).getPropertyValue('left')) //Horizontal
    let yPosition=parseInt(window.getComputedStyle(ship).getPropertyValue('top')) //Vertical
    let newLaser=document.createElement('img') //criar a imagem do laser
    newLaser.src='img/shoot.png'
    newLaser.classList.add('laser')//criar uma classe para poder editar o laser no css
    newLaser.style.left=`${xPosition}px`
    newLaser.style.top=`${yPosition-10}px` //-10 para que o laser não saia de cima (começo da imagem) da navem e sim do meio dela
    return newLaser
}

function moveLaser(laser){
    let laserInterval= setInterval(() => { //O tempo que vai demorar até o final da tela, para surgir um novo elemento laser
        let xPosition= parseInt(laser.style.left)
        let enemy = document.querySelectorAll('.enemy')

        enemy.forEach((enemy) =>{ //comparando se cada enemy foi atingido, se sim, troca o src de images
            if(checkLaserCollision(laser,enemy)){ 
                enemy.src='img/explosao.png'
                enemy.classList.remove('enemy')
                enemy.classList.add('dead-enemy')
            }
        })

        if(xPosition===340){//quando o laser chegar no final da tela
            laser.remove()//será removido
        } else {
            laser.style.left=`${xPosition+8}px`//irá avançando de 8 em 8px
        }
    }, 10); //o tempo que vai  ser possivel rodar essa função, contagem em milisegundos

}

//funcao para criar inimigos aleatoriamente
function createEnemys(){
    let newEnemy=document.createElement('img')
    let enemySprite= enemysImg[Math.floor(Math.random()*enemysImg.length)] //sorteio um numero do tamanho do array, com o qual inimigo vai aparecer na tela, Numero randomico
    newEnemy.src= enemySprite
    newEnemy.classList.add('enemy')
    newEnemy.classList.add('enemy-transition') //animação quando o tiro acertar ele
    newEnemy.style.left='370px' //
    newEnemy.style.top=`${Math.floor(Math.random()*330)+30}px` //Vai aparecer em diferentes lado randomicos da tela
    gameArea.appendChild(newEnemy)
    moveEnemy(newEnemy)
}

//função para movimentar os inimigos
function moveEnemy(enemy){
    let moveEnemyInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'))
        if(xPosition <= 50){
            if(Array.from(enemy.classList).includes('dead-enemy')){ //se a classe do enemy inclui 'dead-enemy', ou seja se ele bater na nossa nave
                enemy.remove()
            } else{
               gameOver ()
            } 
        } else {
            enemy.style.left=`${xPosition-4}px`
        }
    }, 30);
}

//função para colissão
function checkLaserCollision(laser,enemy){
    let laserTop=parseInt(laser.style.top)
    let laserLeft=parseInt(laser.style.left)
    let laserBottom=laserTop-20
    let enemyTop=parseInt(enemy.style.top)
    let enemyLeft=parseInt(enemy.style.left)
    let enemyBottom=enemyTop-30
    

    if(laserLeft!= 340&&laserLeft+40 >= enemyLeft){
        if(laserTop<=enemyTop&&laserTop>=enemyBottom){
            return true
        } else{
            return false
        }
    } else{
        return false
    }
}

//Inicio do Jogo
startButton.addEventListener('click',(event)=>{ //criar evento ao presionar botão START
    playGame()
})

function playGame(){
    startButton.style.display='none'
    instructionsText.style.display='none'
    window.addEventListener('keydown',flyShip)
    enemyInterval=setInterval(() => {
        createEnemys()
    }, 2000);//vai aparecer inimigo a cada 2 segundos
}


//função de game over
function gameOver(){
    window.removeEventListener('keydown',flyShip)
    clearInterval(enemyInterval)
    let enemy= document.querySelectorAll('.enemy')
    enemy.forEach((enemy)=> enemy.remove())
    let lasers=document.querySelectorAll('.laser')
    lasers.forEach((laser)=> laser.remove())
    setTimeout(() => {
        alert('Game Over!')
        ship.style.top="250px"
        startButton.style.display="block"
        instructionsText.style.display="block"
    } );
}


