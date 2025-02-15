// DECLARAÇÕES
const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const musicaFocoInput = document.querySelector('#alternar-musica');
const iconBt = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');
const musica = new Audio('./src/sons/luna-rise-part-one.mp3');
const play = new Audio('./src/sons/play.wav');
const pause = new Audio('./src/sons/pause.mp3');
const beep = new Audio('./src/sons/beep.mp3');


let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;

musica.loop = true;

//FUNÇÕES
function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active')
    });
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`;

            break;

        case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta.</strong>`;

            break;

        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar à superfície<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`;

        default:
            break;
    }
};

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        beep.play();
        alert("Tempo finalizado!");
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        };
        zerar();
        return;
    };
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
};

function iniciarOuPausar() {
    if(intervaloId) {
        zerar();
        pause.play();
        return;
    }
    play.play();
    iniciarOuPausarBt.textContent = 'Pausar';
    iconBt.setAttribute('src', './src/imagens/pause.png')
    intervaloId = setInterval(contagemRegressiva, 1000);
};

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = 'Começar';
    iconBt.setAttribute('src', './src/imagens/play_arrow.png')
    intervaloId = null;
    if (focoBt.classList.contains('active') && tempoDecorridoEmSegundos === 0) {
        tempoDecorridoEmSegundos = 1500;
    } else if (curtoBt.classList.contains('active') && tempoDecorridoEmSegundos === 0) {
        tempoDecorridoEmSegundos = 300;
    } else if (longoBt.classList.contains('active') && tempoDecorridoEmSegundos === 0){
        tempoDecorridoEmSegundos = 900;
    }
    
    mostrarTempo();
};

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();

//EVENTOS
focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');
});

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
});

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
});

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

startPauseBt.addEventListener('click', iniciarOuPausar);
