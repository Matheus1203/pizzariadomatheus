const ler = (k) => JSON.parse(localStorage.getItem(k) || "[]"),
  salvar = (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  lista = document.querySelector("#lista-pedidos"),
  filtro = document.querySelector("#filtro-status"),
  moeda = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
function pedidos() {
  const a = ler("pedidosPizzaria"),
    v = a.filter((p) => filtro.value === "Todos" || p.status === filtro.value);
  document.querySelector("#total-pedidos").textContent = a.length;
  document.querySelector("#pedidos-novos").textContent = a.filter(
    (p) => p.status === "Novo",
  ).length;
  lista.innerHTML = "";
  v.forEach((p) => {
    const d = document.createElement("article"),
      nomes = document.createElement("div"),
      valor = document.createElement("strong"),
      s = document.createElement("select");
    d.className = "pedido";
    nomes.textContent =
      "#" +
      String(p.id).slice(-6) +
      " — " +
      p.itens.map((i) => i.nome).join(", ");
    valor.textContent = moeda(p.total);
    ["Novo", "Em preparo", "Pronto", "Entregue"].forEach((x) =>
      s.add(new Option(x, x, x === p.status, x === p.status)),
    );
    s.onchange = () => {
      p.status = s.value;
      salvar("pedidosPizzaria", a);
      tudo();
    };
    d.append(nomes, valor, s);
    lista.appendChild(d);
  });
  if (!v.length) lista.textContent = "Nenhum pedido.";
}
function chats() {
  const a = ler("chatsPizzaria"),
    area = document.querySelector("#lista-chats");
  document.querySelector("#total-chats").textContent = a.length;
  area.innerHTML = "";
  a.forEach((c) => {
    const d = document.createElement("article"),
      h = document.createElement("h3");
    d.className = "item-admin";
    h.textContent = c.nome;
    d.appendChild(h);
    c.mensagens.forEach((m) => {
      const p = document.createElement("p");
      p.textContent = (m.autor === "admin" ? "Você: " : "Cliente: ") + m.texto;
      d.appendChild(p);
    });
    const i = document.createElement("input"),
      b = document.createElement("button");
    i.placeholder = "Digite a resposta";
    b.textContent = "Responder";
    b.onclick = () => {
      if (!i.value.trim()) return;
      c.mensagens.push({
        autor: "admin",
        texto: i.value.trim(),
        data: new Date().toISOString(),
      });
      salvar("chatsPizzaria", a);
      tudo();
    };
    d.append(i, b);
    area.appendChild(d);
  });
  if (!a.length) area.textContent = "Nenhuma conversa.";
}
function avaliacoes() {
  const a = ler("avaliacoesPizzaria"),
    area = document.querySelector("#lista-avaliacoes"),
    m = a.length ? a.reduce((t, x) => t + x.nota, 0) / a.length : 0;
  document.querySelector("#media-avaliacoes").textContent =
    m.toFixed(1).replace(".", ",") + " ★";
  area.innerHTML = "";
  a.forEach((x) => {
    const d = document.createElement("article"),
      h = document.createElement("h3"),
      p = document.createElement("p"),
      b = document.createElement("button");
    d.className = "item-admin";
    h.textContent = x.nome + " — " + "★".repeat(x.nota);
    p.textContent = x.comentario;
    b.textContent = "Excluir";
    b.onclick = () => {
      salvar(
        "avaliacoesPizzaria",
        a.filter((y) => y.id !== x.id),
      );
      tudo();
    };
    d.append(h, p, b);
    area.appendChild(d);
  });
  if (!a.length) area.textContent = "Nenhuma avaliação.";
}
function tudo() {
  pedidos();
  chats();
  avaliacoes();
}
filtro.onchange = pedidos;
document.querySelector("#criar-exemplo").onclick = () => {
  const a = ler("pedidosPizzaria");
  a.unshift({
    id: Date.now(),
    itens: [{ nome: "Calabresa" }],
    total: 42.9,
    status: "Novo",
  });
  salvar("pedidosPizzaria", a);
  tudo();
};
window.addEventListener("storage", tudo);
tudo();
