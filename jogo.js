const somBatida = new Audio();
const somCaiu = new Audio();
const somPulo = new Audio();
somBatida.src = './efeitos/hit.wav';
somCaiu.src = './efeitos/caiu.wav';
somPulo.src = './efeitos/pulo.wav';


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

  fazColisaoChao(flappyBird) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;
  
    if (flappyBirdY >= chaoY) {
      return true;
    }
  
    return false;
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

// [Tela de Game Over]
const mensagemGameOver = {
  spriteX: 132,
  spriteY: 153,
  largura: 228,
  altura: 200,
  x: (canvas.width / 2) - (228 / 2),
  y: 54,

  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.spriteX, mensagemGameOver.spriteY,
      mensagemGameOver.largura, mensagemGameOver.altura,
      mensagemGameOver.x, mensagemGameOver.y,
      mensagemGameOver.largura, mensagemGameOver.altura,
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

// [Canos]
const canos = {
  largura: 52,
  altura: 400,
  chao: {
    spriteX: 0,
    spriteY: 169,
  },
  ceu: {
    spriteX: 52,
    spriteY: 169,
  },
  espaco: 100,
  pares: [],
  velocidadeCanos: 2,

  inicializa(){
    canos.pares = [{
      x: canvas.width,
      y: 100,
    }];
  },

  desenha() {
    canos.pares.forEach(function(par) {
      const yRandom = par.y;
      const alturaMaximaDoCano = 135;
      // Canos do ceu
      const canoCeuX = par.x;
      const canoCeuY = -alturaMaximaDoCano - yRandom;
  
      contexto.drawImage(
        sprites,
        canos.ceu.spriteX, canos.ceu.spriteY,
        canos.largura, canos.altura,
        canoCeuX, canoCeuY,
        canos.largura, canos.altura
      );
  
      // Canos do chão
      const canoChaoX = par.x;
      const canoChaoY = (canoCeuY + canos.altura) + canos.espaco;
  
      contexto.drawImage(
        sprites,
        canos.chao.spriteX, canos.chao.spriteY,
        canos.largura, canos.altura,
        canoChaoX, canoChaoY,
        canos.largura, canos.altura
      );

      par.canoCeu = {
        x: canoCeuX,
        y: canos.altura + canoCeuY,
      }
      par.canoChao = {
        x: canoChaoX,
        y: canoChaoY,
      }
    });
  },

  fazColisaoCano(par){
    const cabecaDoFlappy = flappyBird.y;
    const peDoFlappy = flappyBird.y + flappyBird.altura;
    const barrigaFlappy = flappyBird.x + flappyBird.largura;

    if(barrigaFlappy >= par.x+5){
      if (cabecaDoFlappy <= par.canoCeu.y){
        return true;
      }

      if (peDoFlappy >= par.canoChao.y){
        return true;
      }
    }
    return false;
  },

  atualiza(){
    const distanciaFrames = 100;
    if ((frames%distanciaFrames === 0)){
      canos.pares.push({
        x: canvas.width,
        y: Math.random()*(chao.y-100),
      });
    }

    canos.pares.forEach(function(par) {
      par.x -= canos.velocidadeCanos;

      if(canos.fazColisaoCano(par)){
        somBatida.play();
        mudaParaTela(Telas.GAMEOVER);        
      }
      if(par.x <= -canos.largura){
        canos.pares.shift();
      }
    });
  },
};

// function criaFlappyBird() {
const flappyBird = {
  spriteX: 0,
  spriteY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50,
  gravidade: 0.1,
  velocidade: 0,
  pulo: 2,
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
    if (chao.fazColisaoChao(flappyBird)) {
      somCaiu.play();
      setTimeout(() => {
        mudaParaTela(Telas.GAMEOVER);
      }, 500);
      return;
    }

    const intervaloDeFrames = 5;

    // Bater asas
    if((frames%intervaloDeFrames === 0)){
      flappyBird.atualizaOFrameAtual();
      flappyBird.spriteY = flappyBird.movimentos[flappyBird.frameAtual].spriteY;
    }

    flappyBird.velocidade += flappyBird.gravidade;
    flappyBird.y += flappyBird.velocidade;

    flappyBird.y = flappyBird.y <= 0 ? 0 : flappyBird.y;
      
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

let telaAtiva = {};

function mudaParaTela(novaTela) {
  telaAtiva = novaTela;
}

const Telas = {
  INICIO: {
    desenha() {
      frames = 0;
      flappyBird.inicializa();
      canos.inicializa();
      chao.inicializa();
      planoDeFundo.desenha();
      canos.desenha();
      chao.desenha();
      mensagemGetReady.desenha();
      // globais.flappyBird.desenha();
      flappyBird.desenha();
    },

    atualiza() { },

    click() {
      mudaParaTela(Telas.JOGO);
    },
  },
  GAMEOVER: {
    cliques: 0,
    desenha() {
      mensagemGameOver.desenha();
      flappyBird.desenha();
    },

    saiGameOver() {
      Telas.GAMEOVER.cliques = 0;
      mudaParaTela(Telas.INICIO);
    },

    atualiza() {  },

    click() {
      if(++Telas.GAMEOVER.cliques >= 3 ){
        Telas.GAMEOVER.saiGameOver();
      }
    },
  },
  JOGO: {
    desenha() {
      planoDeFundo.desenha();
      canos.desenha();
      chao.desenha();
      // globais.flappyBird.desenha();
      flappyBird.desenha();
    },

    atualiza() {
      // globais.flappyBird.atualiza();
      flappyBird.atualiza();
      canos.atualiza();
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