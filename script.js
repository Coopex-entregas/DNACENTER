// script.js

const adminUser = "DNA";
const adminPass = "21051988";

function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;
  if (user === adminUser && pass === adminPass) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    carregarCabecalhoFicha();
    carregarMotoboys();
    carregarOpcoesFiltro();
    carregarRegistros();
  } else {
    alert("Usuário ou senha incorretos.");
  }
}

function cadastrarMotoboy() {
  const nome = document.getElementById("nomeMotoboy").value.trim();
  const termo = document.getElementById("numeroTermometro").value.trim();
  if (!nome || !termo) return alert("Preencha todos os campos");
  const motoboys = JSON.parse(localStorage.getItem("motoboys") || "[]");
  motoboys.push({ nome, termo });
  localStorage.setItem("motoboys", JSON.stringify(motoboys));
  gerarQRCodePara(nome);
  carregarMotoboys();
  carregarOpcoesFiltro();
  document.getElementById("nomeMotoboy").value = "";
  document.getElementById("numeroTermometro").value = "";
}

function excluirMotoboy(index) {
  const motoboys = JSON.parse(localStorage.getItem("motoboys") || "[]");
  if (confirm(`Deseja excluir ${motoboys[index].nome}?`)) {
    motoboys.splice(index, 1);
    localStorage.setItem("motoboys", JSON.stringify(motoboys));
    carregarMotoboys();
    carregarOpcoesFiltro();
  }
}

function carregarMotoboys() {
  const lista = document.getElementById("listaMotoboys");
  lista.innerHTML = "";
  const motoboys = JSON.parse(localStorage.getItem("motoboys") || "[]");
  motoboys.forEach((moto, i) => {
    const div = document.createElement("div");
    div.innerHTML = `${moto.nome} (Termômetro ${moto.termo}) <button onclick="excluirMotoboy(${i})">Excluir</button><br><canvas id="qr${i}"></canvas>`;
    lista.appendChild(div);
    QRCode.toCanvas(document.getElementById(`qr${i}`), `${window.location.origin}/form.html?id=${encodeURIComponent(moto.nome)}`);
  });
}

function carregarOpcoesFiltro() {
  const select = document.getElementById("filtroMotoboy");
  const motoboys = JSON.parse(localStorage.getItem("motoboys") || "[]");
  select.innerHTML = '<option value="todos">Todos</option>';
  motoboys.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.nome;
    opt.textContent = m.nome;
    select.appendChild(opt);
  });
}

function carregarRegistros() {
  const container = document.getElementById("registros");
  container.innerHTML = "(dados virão aqui após integração)";
}

function exportarExcel() {
  alert("Função de exportar para Excel ainda será implementada aqui.");
}

function exportarPDF() {
  alert("Função de exportar para PDF ainda será implementada aqui.");
}

function gerarQRCodePara(nome) {
  const motoboys = JSON.parse(localStorage.getItem("motoboys") || "[]");
  const index = motoboys.findIndex(m => m.nome === nome);
  if (index !== -1) {
    const canvasId = "qr" + index;
    setTimeout(() => {
      const canvas = document.getElementById(canvasId);
      if (canvas) {
        QRCode.toCanvas(canvas, `${window.location.origin}/form.html?id=${encodeURIComponent(nome)}`);
      }
    }, 100);
  }
}

function carregarCabecalhoFicha() {
  const cabecalho = document.getElementById("cabecalhoFicha");
  if (!cabecalho) return;
  cabecalho.innerHTML = `
    <div class="cabecalho-ficha">
      <div><strong>Nome da Empresa:</strong> DNA Center</div>
      <div><strong>Área:</strong> Coleta</div>
      <div><strong>Qualidade:</strong> Alta</div>
      <div><strong>Processo:</strong> Transporte Térmico</div>
      <div><strong>Data de Criação:</strong> 16/07/2025</div>
      <div><strong>Próxima Revisão:</strong> 16/12/2025</div>
      <div><strong>Código:</strong> TCX-2025</div>
      <div><strong>Versão:</strong> 1.0</div>
    </div>`;
}
