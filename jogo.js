const somDe_HIT = new Audio();
somDe_HIT.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';
let frames = 0;

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0, 0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

// [Chao]
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,

  inicializa() {
    chao.x = 0;
    chao.y = canvas.height - 112;
  },

  atualiza() {
    const movimentoDoChao = 1;
    if (chao.x <= (canvas.width - 2 * chao.largura)) {
      chao.x = 1;
    }
    chao.x -= movimentoDoChao;

  },

  desenha() {
    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.largura, chao.altura,
    );

    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,
      chao.largura, chao.altura,
    );
  },
};

// [Tela de inicio]
const mensagemGetReady = {
  spriteX: 134,
  spriteY: 0,
  largura: 174,
  altura: 152,
  x: (canvas.width / 2) - (174 / 2),
  y: 54,

  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.spriteX, mensagemGetReady.spriteY,
      mensagemGetReady.largura, mensagemGetReady.altura,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.largura, mensagemGetReady.altura,
    );
  },
};

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY) {
    return true;
  }

  return false;
};

// function criaFlappyBird() {
const flappyBird = {
  spriteX: 0,
  spriteY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50,
  gravidade: 0.25,
  velocidade: 0,
  pulo: 4.6,
  frameAtual: 0,
  movimentos: [
    { spriteX: 0, spriteY: 0, },
    { spriteX: 0, spriteY: 26, },
    { spriteX: 0, spriteY: 52, }
  ],

  inicializa() {
    flappyBird.x = 10;
    flappyBird.y = 50;
    flappyBird.velocidade = 0;
  },

  pula() {
    flappyBird.velocidade = -flappyBird.pulo;
  },

  atualizaOFrameAtual() {
    const baseDoIncremento = 1;
    flappyBird.frameAtual += baseDoIncremento;

    if (flappyBird.frameAtual >= flappyBird.movimentos.length) {
      flappyBird.frameAtual = 0;
    }
  },

  atualiza() {
    if (fazColisao(flappyBird, chao)) {
      somDe_HIT.play();
      setTimeout(() => {
        mudaParaTela(Telas.INICIO);
      }, 500);
      return;
    }

    const intervaloDeFrames = 5;

    if((frames%intervaloDeFrames === 0)){
      frames = 0;
      flappyBird.atualizaOFrameAtual();
      flappyBird.spriteY = flappyBird.movimentos[flappyBird.frameAtual].spriteY;
    }

    console.log(frames);
    flappyBird.velocidade += flappyBird.gravidade;
    flappyBird.y += flappyBird.velocidade;
  },

  desenha() {
    contexto.drawImage(
      sprites,
      flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y
      flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
      flappyBird.x, flappyBird.y,
      flappyBird.largura, flappyBird.altura,
    );
  }
};

// const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  // if(telaAtiva.inicializa){
  //   telaAtiva.inicializa();
  // }
}

const Telas = {
  INICIO: {
    // inicializa() {
    //   globais.flappyBird = criaFlappyBird();  
    // },

    desenha() {
      planoDeFundo.desenha();
      chao.inicializa();
      chao.desenha();
      mensagemGetReady.desenha();
      // globais.flappyBird.desenha();
      flappyBird.inicializa();
      flappyBird.desenha();
    },

    atualiza() { },

    click() {
      mudaParaTela(Telas.JOGO);
    },
  },
  JOGO: {
    desenha() {
      planoDeFundo.desenha();
      chao.desenha();
      // globais.flappyBird.desenha();
      flappyBird.desenha();
    },

    atualiza() {
      // globais.flappyBird.atualiza();
      flappyBird.atualiza();
      chao.atualiza();
    },

    click() {
      // globais.flappyBird.pula();
      flappyBird.pula();
    },
  }
};

function loop() {

  telaAtiva.desenha();
  telaAtiva.atualiza();
  requestAnimationFrame(loop);

  frames += 1;
}

window.addEventListener('click', function () {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);

loop();