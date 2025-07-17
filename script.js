// Admin login fixo
const adminUser = "DNA";
const adminPass = "21051988";

// Login
function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;
  if (user === adminUser && pass === adminPass) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    carregarMotoboys();
    carregarRegistros();
    carregarOpcoesFiltro();
  } else {
    alert("Usuário ou senha incorretos.");
  }
}

// Cadastrar Motoboy
function cadastrarMotoboy() {
  const nome = document.getElementById("nomeMotoboy").value.trim();
  const termo = document.getElementById("numeroTermometro").value.trim();
  if (!nome || !termo) {
    alert("Preencha todos os campos.");
    return;
  }

  const motoboys = JSON.parse(localStorage.getItem("motoboys")) || [];
  const id = Date.now().toString();
  motoboys.push({ id, nome, termo });
  localStorage.setItem("motoboys", JSON.stringify(motoboys));
  carregarMotoboys();
  carregarOpcoesFiltro();
  document.getElementById("nomeMotoboy").value = "";
  document.getElementById("numeroTermometro").value = "";
}

// Carregar motoboys
function carregarMotoboys() {
  const motoboys = JSON.parse(localStorage.getItem("motoboys")) || [];
  const container = document.getElementById("motoboyList");
  container.innerHTML = "";
  motoboys.forEach((m) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${m.nome}</strong> - Termômetro: ${m.termo}</p>
      <canvas id="qr-${m.id}"></canvas>
      <hr/>
    `;
    container.appendChild(div);
    QRCode.toCanvas(document.getElementById(`qr-${m.id}`), `index.html?id=${m.id}`);
  });
}

// Filtros dropdown
function carregarOpcoesFiltro() {
  const motoboys = JSON.parse(localStorage.getItem("motoboys")) || [];
  const select = document.getElementById("filtroMotoboy");
  if (!select) return;
  select.innerHTML = `<option value="">Todos</option>`;
  motoboys.forEach(m => {
    select.innerHTML += `<option value="${m.nome}">${m.nome}</option>`;
  });
}

// Carregar registros
function carregarRegistros() {
  filtrarRegistros();
}

// Filtro por nome e datas
function filtrarRegistros() {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  const filtroNome = document.getElementById("filtroMotoboy").value;
  const dataInicio = document.getElementById("dataInicio").value;
  const dataFim = document.getElementById("dataFim").value;

  const tbody = document.getElementById("registrosTabela");
  tbody.innerHTML = "";

  registros.forEach((r) => {
    if (filtroNome && r.motoboy !== filtroNome) return;
    if (dataInicio && r.data < dataInicio) return;
    if (dataFim && r.data > dataFim) return;

    const row = document.createElement("tr");
    const alerta = (parseFloat(r.tempEnvio) > 15 || parseFloat(r.tempRecebimento) > 15) ? "⚠️" : "";
    const duracao = calcularDuracao(r.horaEnvio, r.horaRecebimento);

    row.innerHTML = `
      <td>${r.motoboy}</td>
      <td>${r.data}</td>
      <td>${r.horaEnvio || "-"}</td>
      <td>${r.tempEnvio || "-"}</td>
      <td>${r.unidadeEnvio || "-"}</td>
      <td>${r.respEnvio || "-"}</td>
      <td>${r.horaRecebimento || "-"}</td>
      <td>${r.tempRecebimento || "-"}</td>
      <td>${r.unidadeRecebimento || "-"}</td>
      <td>${r.respRecebimento || "-"}</td>
      <td>${duracao}</td>
      <td>${alerta}</td>
    `;
    tbody.appendChild(row);
  });
}

// Cálculo de duração
function calcularDuracao(h1, h2) {
  if (!h1 || !h2) return "-";
  const [h1h, h1m] = h1.split(":").map(Number);
  const [h2h, h2m] = h2.split(":").map(Number);
  const d = (h2h * 60 + h2m) - (h1h * 60 + h1m);
  return d > 0 ? d + " min" : "-";
}

// Exportação para CSV
function exportarExcel() {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  let csv = "Motoboy,Data,Hora Envio,Temp Envio,Unidade Envio,Resp Envio,Hora Recebimento,Temp Recebimento,Unidade Recebimento,Resp Recebimento,Duração,Alerta\n";
  registros.forEach((r) => {
    const alerta = (parseFloat(r.tempEnvio) > 15 || parseFloat(r.tempRecebimento) > 15) ? "⚠️ Temperatura acima" : "";
    const duracao = calcularDuracao(r.horaEnvio, r.horaRecebimento);
    csv += `"${r.motoboy}","${r.data}","${r.horaEnvio}","${r.tempEnvio}","${r.unidadeEnvio}","${r.respEnvio}","${r.horaRecebimento}","${r.tempRecebimento}","${r.unidadeRecebimento}","${r.respRecebimento}","${duracao}","${alerta}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "registros_temperatura.csv";
  a.click();
}

// Funções do formulário index.html

function carregarFormMotoboy() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const motoboys = JSON.parse(localStorage.getItem("motoboys")) || [];
  const motoboy = motoboys.find(m => m.id === id);
  if (!motoboy) {
    document.body.innerHTML = "<h2>Motoboy não encontrado</h2>";
    return;
  }
  document.getElementById("motoboyNome").textContent = motoboy.nome;
  document.getElementById("termoNumero").textContent = motoboy.termo;
  document.getElementById("mesAtual").textContent = new Date().toLocaleString("pt-BR", { month: "long" }).toUpperCase();
}

function atualizarFormulario() {
  const tipo = document.getElementById("tipo").value;
  document.getElementById("formEnvio").style.display = tipo === "Enviando" ? "block" : "none";
  document.getElementById("formRecebimento").style.display = tipo === "Recebendo" ? "block" : "none";
  document.getElementById("alertaTemp").textContent = "";
}

function verificarTemp(tipo) {
  const val = parseFloat(document.getElementById(tipo === "envio" ? "tempEnvio" : "tempRecebimento").value);
  const alerta = document.getElementById("alertaTemp");
  if (val > 15) {
    alerta.textContent = "⚠️ Temperatura acima do ideal. Verifique o gelo da caixa. Caso já tenha trocado, desconsidere esta mensagem.";
  } else {
    alerta.textContent = "";
  }
}

function salvarRegistro() {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  const motoboys = JSON.parse(localStorage.getItem("motoboys")) || [];
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const motoboy = motoboys.find(m => m.id === id);
  if (!motoboy) return alert("Motoboy não identificado.");

  const tipo = document.getElementById("tipo").value;
  const agora = new Date();
  const data = agora.toISOString().split("T")[0];
  const hora = agora.toTimeString().split(":").slice(0,2).join(":");

  let registro = registros.find(r => r.motoboy === motoboy.nome && !r.horaRecebimento);

  if (tipo === "Enviando") {
    registros.push({
      motoboy: motoboy.nome,
      data,
      horaEnvio: hora,
      tempEnvio: document.getElementById("tempEnvio").value,
      unidadeEnvio: document.getElementById("unidadeEnvio").value,
      respEnvio: document.getElementById("respEnvio").value,
      horaRecebimento: null,
      tempRecebimento: null,
      unidadeRecebimento: null,
      respRecebimento: null
    });
  } else if (tipo === "Recebendo" && registro) {
    registro.horaRecebimento = hora;
    registro.tempRecebimento = document.getElementById("tempRecebimento").value;
    registro.unidadeRecebimento = document.getElementById("unidadeRecebimento").value;
    registro.respRecebimento = document.getElementById("respRecebimento").value;
  } else {
    alert("Você deve registrar o envio antes do recebimento.");
    return;
  }

  localStorage.setItem("registros", JSON.stringify(registros));
  alert("Dados salvos com sucesso!");
  window.location.reload();
}
