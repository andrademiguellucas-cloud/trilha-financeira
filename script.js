const dadosEndividamento = [78, 22];
const dadosViloes = [45, 30, 18, 7];

// 1. CONFIGURAÇÃO DO GRÁFICO DE PIZZA (ENDIVIDAMENTO)
const configPizza = {
    type: 'doughnut',
    data: {
        labels: ['Com Dívidas', 'Sem Dívidas'],
        datasets: [{
            data: dadosEndividamento,
            backgroundColor: ['#e74c3c', '#2ecc71']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
};

// 2. CONFIGURAÇÃO DO GRÁFICO DE BARRAS (VILÕES)
const configBarras = {
    type: 'bar',
    data: {
        labels: ['Cartão/Cheque Especial', 'Contas Altas', 'Compras Impulsivas', 'Tarifas'],
        datasets: [{
            label: '% de Impacto',
            data: dadosViloes,
            backgroundColor: '#1b4d3e'
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false
    }
};

function ajustarCanvas(canvas) {
    const largura = canvas.clientWidth || 320;
    const altura = canvas.clientHeight || 320;
    const proporcao = window.devicePixelRatio || 1;

    canvas.width = largura * proporcao;
    canvas.height = altura * proporcao;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(proporcao, 0, 0, proporcao, 0, 0);
    return { ctx, largura, altura };
}

function desenharGraficoPizza(canvas) {
    const { ctx, largura, altura } = ajustarCanvas(canvas);
    const cores = configPizza.data.datasets[0].backgroundColor;
    const total = dadosEndividamento.reduce((soma, valor) => soma + valor, 0);
    const raio = Math.min(largura, altura) / 3;
    const centroX = largura / 2;
    const centroY = altura / 2;
    let anguloInicial = -Math.PI / 2;

    dadosEndividamento.forEach((valor, indice) => {
        const anguloFinal = anguloInicial + (valor / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centroX, centroY);
        ctx.arc(centroX, centroY, raio, anguloInicial, anguloFinal);
        ctx.closePath();
        ctx.fillStyle = cores[indice];
        ctx.fill();
        anguloInicial = anguloFinal;
    });

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(centroX, centroY, raio * 0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    ctx.fillStyle = '#1b4d3e';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${dadosEndividamento[0]}%`, centroX, centroY - 4);
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText('com dívidas', centroX, centroY + 16);

    desenharLegenda(ctx, configPizza.data.labels, cores, 18, altura - 52);
}

function desenharGraficoBarras(canvas) {
    const { ctx, largura } = ajustarCanvas(canvas);
    const labels = configBarras.data.labels;
    const margemEsquerda = 150;
    const margemTopo = 28;
    const larguraMaxima = Math.max(largura - margemEsquerda - 44, 120);
    const alturaBarra = 32;
    const espaco = 24;
    const maiorValor = Math.max(...dadosViloes);

    ctx.font = '13px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    dadosViloes.forEach((valor, indice) => {
        const y = margemTopo + indice * (alturaBarra + espaco);
        const larguraBarra = (valor / maiorValor) * larguraMaxima;

        ctx.fillStyle = '#34495e';
        ctx.fillText(labels[indice], margemEsquerda - 10, y + alturaBarra / 2);

        ctx.fillStyle = '#1b4d3e';
        ctx.fillRect(margemEsquerda, y, larguraBarra, alturaBarra);

        ctx.fillStyle = '#1b4d3e';
        ctx.textAlign = 'left';
        ctx.fillText(`${valor}%`, margemEsquerda + larguraBarra + 8, y + alturaBarra / 2);
        ctx.textAlign = 'right';
    });
}

function desenharLegenda(ctx, labels, cores, x, y) {
    ctx.font = '13px Arial, sans-serif';
    ctx.textAlign = 'left';

    labels.forEach((label, indice) => {
        const itemY = y + indice * 24;
        ctx.fillStyle = cores[indice];
        ctx.fillRect(x, itemY - 10, 14, 14);
        ctx.fillStyle = '#34495e';
        ctx.fillText(`${label}: ${dadosEndividamento[indice]}%`, x + 22, itemY + 1);
    });
}

function inicializarGraficos(elPizza, elBarras) {
    if (typeof Chart !== 'undefined') {
        if (elPizza) new Chart(elPizza.getContext('2d'), configPizza);
        if (elBarras) new Chart(elBarras.getContext('2d'), configBarras);
        return;
    }

    console.warn('Chart.js não foi carregado. Usando gráficos locais em canvas.');
    if (elPizza) desenharGraficoPizza(elPizza);
    if (elBarras) desenharGraficoBarras(elBarras);
}

// 3. INICIALIZAR OS DOIS GRÁFICOS QUANDO A PÁGINA CARREGAR
document.addEventListener('DOMContentLoaded', () => {
    const elPizza = document.getElementById('chartEndividamento');
    const elBarras = document.getElementById('chartViloes');

    inicializarGraficos(elPizza, elBarras);

    // 4. SISTEMA DE BUSCA DA BIBLIOTECA
    const campoBusca = document.getElementById('wikiSearch');
    const artigos = document.querySelectorAll('.wiki-article');

    if (campoBusca) {
        campoBusca.addEventListener('input', () => {
            const termo = campoBusca.value.toLowerCase().trim();
            artigos.forEach(art => {
                const titulo = art.querySelector('h3').textContent.toLowerCase();
                const texto = art.querySelector('p').textContent.toLowerCase();
                art.style.display = (titulo.includes(termo) || texto.includes(termo)) ? 'block' : 'none';
            });
        });
    }
});
