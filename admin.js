// admin.js
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import QRCode from "https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js";

const db = firebaseDB;
const auth = firebaseAuth;

const nomeInput = document.getElementById("nomeMotoboy");
const termoInput = document.getElementById("numeroTermometro");
const listaMotoboys = document.getElementById("listaMotoboys");
const filtroMotoboy = document.getElementById("filtroMotoboy");
const filtroInicio = document.getElementById("filtroInicio");
const filtroFim = document.getElementById("filtroFim");
const tabela = document.getElementById("tabelaRegistros");

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

document.getElementById("btnLogout").onclick = () => signOut(auth);

document.getElementById("btnCadastrarMotoboy").onclick = async () => {
  const nome = nomeInput.value.trim();
  const termo = termoInput.value.trim();
  if (!nome || !termo) return alert("Preencha todos os campos");

  await addDoc(collection(db, "motoboys"), { nome, termo });
  nomeInput.value = "";
  termoInput.value = "";
  carregarMotoboys();
};

document.getElementById("btnFiltrar").onclick = carregarRegistros;
document.getElementById("btnExportarExcel").onclick = exportarExcel;

async function carregarMotoboys() {
  listaMotoboys.innerHTML = "";
  filtroMotoboy.innerHTML = '<option value="todos">Todos</option>';
  const snap = await getDocs(collection(db, "motoboys"));
  snap.forEach(doc => {
    const m = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `${m.nome} (Termômetro ${m.termo})<br><canvas></canvas><hr>`;
    listaMotoboys.appendChild(div);
    QRCode.toCanvas(div.querySelector("canvas"), `${window.location.origin}/form.html?id=${encodeURIComponent(m.nome)}`);

    const opt = document.createElement("option");
    opt.value = m.nome;
    opt.textContent = m.nome;
    filtroMotoboy.appendChild(opt);
  });
}

async function carregarRegistros() {
  tabela.innerHTML = "";
  const snap = await getDocs(collection(db, "registros"));

  const dados = [];
  snap.forEach(doc => dados.push(doc.data()));

  const inicio = filtroInicio.value;
  const fim = filtroFim.value;
  const filtroNome = filtroMotoboy.value;

  const filtrados = dados.filter(d => {
    if (filtroNome !== "todos" && d.motoboy !== filtroNome) return false;
    if (inicio && new Date(d.dataHora) < new Date(inicio)) return false;
    if (fim && new Date(d.dataHora) > new Date(fim + "T23:59:59")) return false;
    return true;
  });

  const agrupados = {};
  filtrados.forEach(d => {
    if (!agrupados[d.motoboy]) agrupados[d.motoboy] = [];
    agrupados[d.motoboy].push(d);
  });

  for (const nome in agrupados) {
    const envios = agrupados[nome].filter(r => r.tipo === "enviando");
    const receb = agrupados[nome].filter(r => r.tipo === "recebendo");

    receb.forEach(rec => {
      rec.locaisRecebidos.split(", ").forEach(loc => {
        const envio = envios.find(e => e.local === loc && !e.usado);
        if (!envio) return;
        envio.usado = true;

        const linha = tabela.insertRow();
        linha.insertCell().textContent = nome;
        linha.insertCell().textContent = new Date(envio.dataHora).toLocaleDateString();
        linha.insertCell().textContent = new Date(envio.dataHora).toLocaleTimeString();
        linha.insertCell().textContent = envio.temp + " °C";
        linha.insertCell().textContent = envio.local;
        linha.insertCell().textContent = envio.responsavel;
        linha.insertCell().textContent = new Date(rec.dataHora).toLocaleTimeString();
        linha.insertCell().textContent = rec.temp + " °C";
        linha.insertCell().textContent = rec.responsavel;
        linha.insertCell().textContent = rec.local;

        const t1 = new Date(envio.dataHora);
        const t2 = new Date(rec.dataHora);
        const duracao = Math.round((t2 - t1) / 60000);
        linha.insertCell().textContent = duracao + " min";
      });
    });
  }
}

function exportarExcel() {
  alert("Exportação Excel será implementada com Firebase.");
}

carregarMotoboys();
carregarRegistros();
