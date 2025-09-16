let count = 0;

function adicionarDisciplina() {
  count++;
  const container = document.getElementById("disciplinas-container");

  const div = document.createElement("div");
  div.className = "disciplina";
  div.innerHTML = `
    <label>Disciplina ${count}</label>
    <input type="text" placeholder="Nome da disciplina" class="nome-disciplina" />
    <br/>
    ${Array.from({ length: 12 }, (_, i) =>
      `<input type="number" class="nota-${count}" placeholder="Nota ${i + 1}" />`
    ).join("")}
    <hr/>
  `;
  container.appendChild(div);
}

function calcularCV(valores) {
  const n = valores.length;
  const media = valores.reduce((a, b) => a + b, 0) / n;
  const variancia = valores.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / n;
  const desvioPadrao = Math.sqrt(variancia);
  const cv = (desvioPadrao / media) * 100;
  return { media, cv: cv.toFixed(2) };
}

function feedback(cv) {
  if (cv < 10) return "Muito consistente – continue assim!";
  if (cv < 20) return "Consistente com pequena variação.";
  if (cv < 30) return "Moderadamente inconsistente.";
  return "Inconsistente – atenção à regularidade!";
}

function analisar() {
  const disciplinas = document.querySelectorAll(".disciplina");
  const resultadosDiv = document.getElementById("resultados");
  const ctx = document.getElementById("grafico").getContext("2d");

  const labels = [];
  const medias = [];
  const cvs = [];

  resultadosDiv.innerHTML = "";

  disciplinas.forEach((disc, index) => {
    const nome = disc.querySelector(".nome-disciplina").value || `Disciplina ${index + 1}`;
    const notas = Array.from(disc.querySelectorAll(`.nota-${index + 1}`))
      .map(input => parseFloat(input.value))
      .filter(val => !isNaN(val));

    if (notas.length >= 6 && notas.length <= 12) {
      const { media, cv } = calcularCV(notas);
      labels.push(nome);
      medias.push(media.toFixed(2));
      cvs.push(cv);

      const fb = feedback(cv);
      resultadosDiv.innerHTML += `<div class="result"><strong>${nome}</strong>:<br> CV = ${cv}%, Média = ${media.toFixed(2)}<br>${fb}</div>`;
    } else {
      resultadosDiv.innerHTML += `<div class="result" style="background:#fff3cd; color:#856404;"><strong>${nome}:</strong> Insira entre 6 e 12 notas.</div>`;
    }
  });

  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Média",
          data: medias,
          backgroundColor: "#219ebc",
        },
        {
          label: "Coeficiente de Variação (%)",
          data: cvs,
          backgroundColor: "#ffb703",
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        }
      }
    }
  });
}

function exportarPDF() {
    const element = document.getElementById("export-area");
  
    // Espera o Chart.js renderizar antes de capturar
    setTimeout(() => {
      html2pdf().set({
        margin: 10,
        filename: 'relatorio-desempenho.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(element).save();
    }, 1000);
  }
  
  function exportarPDF() {
  // Garante que o canvas seja convertido em imagem antes da exportação
  const chartCanvas = document.getElementById("grafico");

  // Clona o conteúdo a ser exportado
  const exportArea = document.getElementById("export-area").cloneNode(true);

  // Cria título e cabeçalho
  const titulo = document.createElement("h2");
  titulo.textContent = "Relatório de Desempenho por Disciplina";
  titulo.style.textAlign = "center";
  titulo.style.marginBottom = "20px";

  const dataAtual = new Date().toLocaleDateString();
  const info = document.createElement("p");
  info.textContent = `Data: ${dataAtual}`;
  info.style.textAlign = "right";
  info.style.marginBottom = "10px";

  // Adiciona cabeçalho ao conteúdo exportável
  exportArea.prepend(info);
  exportArea.prepend(titulo);

  // Usa html2canvas manualmente para capturar o gráfico corretamente
  html2pdf()
    .set({
      margin: 10,
      filename: `relatorio-desempenho-${dataAtual}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true, // melhora renderização de gráficos
        allowTaint: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    })
    .from(exportArea)
    .save();
}
function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const titulo = "INVESTIR NO FUTURO: CIÊNCIA, TECNOLOGIA E O TALENTO DOS NOSSOS FILHOS";
    const texto = document.getElementById("texto").innerText;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text(titulo, 105, 20, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(texto, 10, 35, { maxWidth: 190, lineHeightFactor: 1.5 });

    doc.save("Folheto_Talento_Ciencia_Tecnologia.pdf");
  }