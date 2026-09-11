const carrinho = [],
  lista = document.querySelector("#lista-carrinho"),
  moeda = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
function aviso(t) {
  const m = document.querySelector("#mensagem");
  m.textContent = t;
  m.classList.add("visivel");
  clearTimeout(aviso.id);
  aviso.id = setTimeout(() => m.classList.remove("visivel"), 2000);
}
function atualizar() {
  lista.innerHTML = "";
  carrinho.forEach((item, i) => {
    const li = document.createElement("li"),
      d = document.createElement("span"),
      r = document.createElement("button");
    d.textContent = `${item.nome} — ${moeda(item.preco)}`;
    r.className = "remover";
    r.dataset.i = i;
    r.textContent = "Remover";
    li.append(d, r);
    lista.appendChild(li);
  });
  const q = carrinho.length,
    t = carrinho.reduce((s, i) => s + i.preco, 0);
  document.querySelector("#resumo-carrinho").textContent = q
    ? "Confira os itens:"
    : "Nenhuma pizza adicionada.";
  document.querySelector("#quantidade-itens").textContent = q;
  document.querySelector("#contador-menu").textContent = q;
  document.querySelector("#total-pedido").textContent = moeda(t);
}
document.querySelectorAll(".botao-adicionar[data-nome]").forEach(
  (b) =>
    (b.onclick = () => {
      carrinho.push({ nome: b.dataset.nome, preco: Number(b.dataset.preco) });
      atualizar();
      aviso(`${b.dataset.nome} adicionada!`);
    }),
);
lista.onclick = (e) => {
  const b = e.target.closest(".remover");
  if (!b) return;
  carrinho.splice(Number(b.dataset.i), 1);
  atualizar();
};
document.querySelector("#limpar-carrinho").onclick = () => {
  carrinho.length = 0;
  atualizar();
  aviso("Carrinho limpo.");
};
document.querySelector("#finalizar-pedido").onclick = () => {
  if (!carrinho.length) return aviso("Adicione uma pizza.");
  const t = carrinho.reduce((s, i) => s + i.preco, 0);
  const pedidos = JSON.parse(localStorage.getItem("pedidosPizzaria") || "[]");
  pedidos.unshift({
    id: Date.now(),
    itens: carrinho.map((item) => ({ ...item })),
    total: t,
    status: "Novo",
    data: new Date().toISOString(),
  });
  localStorage.setItem("pedidosPizzaria", JSON.stringify(pedidos));
  location.href = `pagamento.html?total=${t.toFixed(2)}`;
};
document.querySelector("#ano-atual").textContent = new Date().getFullYear();
atualizarPrecoMeio();
atualizar();
