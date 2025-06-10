function classificar(valor, tipo) {
  if (tipo === "PM2.5") {
    if (valor <= 12) return "bom";
    if (valor <= 35.4) return "regular";
    return "ruim";
  }
  if (tipo === "NO2") {
    if (valor <= 100) return "bom";
    if (valor <= 200) return "regular";
    return "ruim";
  }
  if (tipo === "O3") {
    if (valor <= 120) return "bom";
    if (valor <= 180) return "regular";
    return "ruim";
  }
  return "bom";
}

async function consultarAr() {
  const cidade = document.getElementById("cidade").value;
  const resultado = document.getElementById("resultado");

  if (!cidade) {
    resultado.innerHTML = "Por favor, digite uma cidade.";
    return;
  }

  resultado.innerHTML = "Buscando dados...";

  try {
    const resposta = await fetch(`https://api.api-ninjas.com/v1/airquality?city=${cidade}`, {
      headers: {
        "X-Api-Key": "P2KSiR2PS67Rj6FTNVhnvg==jmPTloazJXdhufqF"
      }
    });

    if (resposta.ok) {
      const dados = await resposta.json();
      const pm25 = dados["PM2.5"];
      const no2 = dados["NO2"];
      const o3 = dados["O3"];
      const aqi = dados.overall_aqi;

      resultado.innerHTML = `
        <h2>Qualidade do ar em <strong>${cidade}</strong></h2>
        <h3>Índice Geral (AQI): <span class="bom">${aqi}</span></h3>

        <div class="caixa-info">
          <h4>Partículas Finas (PM2.5) (${pm25.concentration} µg/m³)</h4>
          <p class="${classificar(pm25.concentration, 'PM2.5')}">Classificação: ${classificar(pm25.concentration, 'PM2.5').toUpperCase()}</p>
          <small>Partículas finas em nível seguro. Qualidade do ar ideal para atividades ao ar livre.</small>
        </div>

        <div class="caixa-info">
          <h4>Dióxido de Nitrogênio (NO2) (${no2.concentration} µg/m³)</h4>
          <p class="${classificar(no2.concentration, 'NO2')}">Classificação: ${classificar(no2.concentration, 'NO2').toUpperCase()}</p>
          <small>Níveis baixos de dióxido de nitrogênio, comum em áreas com pouco tráfego. Sem risco à saúde.</small>
        </div>

        <div class="caixa-info">
          <h4>Ozônio ao nível do solo (O3) (${o3.concentration} µg/m³)</h4>
          <p class="${classificar(o3.concentration, 'O3')}">Classificação: ${classificar(o3.concentration, 'O3').toUpperCase()}</p>
          <small>Ozônio em níveis seguros. Ao nível do solo, é um poluente. Em altitude, nos protege.</small>
        </div>
      `;
    } else {
      resultado.innerHTML = "Cidade não encontrada ou erro na consulta.";
    }
  } catch (erro) {
    resultado.innerHTML = "Erro ao acessar a API.";
    console.error(erro);
  }
}
