const K = "chatsPizzaria",
  id = sessionStorage.chatId || String(Date.now());
sessionStorage.chatId = id;
const area = document.querySelector("#mensagens"),
  nome = document.querySelector("#nome"),
  texto = document.querySelector("#texto"),
  ler = () => JSON.parse(localStorage.getItem(K) || "[]"),
  salvar = (v) => localStorage.setItem(K, JSON.stringify(v));
function render() {
  const c = ler().find((x) => x.id === id);
  area.innerHTML = "";
  if (!c) {
    area.textContent = "Comece uma conversa com nossa equipe.";
    return;
  }
  nome.value = c.nome;
  c.mensagens.forEach((m) => {
    const d = document.createElement("div"),
      p = document.createElement("div"),
      s = document.createElement("small");
    d.className = "mensagem-chat " + m.autor;
    p.textContent = m.texto;
    s.textContent =
      (m.autor === "admin" ? "Atendimento" : "Você") +
      " • " +
      new Date(m.data).toLocaleString("pt-BR");
    d.append(p, s);
    area.appendChild(d);
  });
}
document.querySelector("#enviar").onclick = () => {
  const n = nome.value.trim(),
    t = texto.value.trim();
  if (!n || !t) return alert("Informe nome e mensagem.");
  const todos = ler();
  let c = todos.find((x) => x.id === id);
  if (!c) {
    c = { id, nome: n, aberto: true, mensagens: [] };
    todos.unshift(c);
  }
  c.nome = n;
  c.mensagens.push({
    autor: "cliente",
    texto: t,
    data: new Date().toISOString(),
  });
  salvar(todos);
  texto.value = "";
  render();
};
window.addEventListener("storage", render);
render();
