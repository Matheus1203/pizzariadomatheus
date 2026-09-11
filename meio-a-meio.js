const sabores = [
  { nome: "Calabresa", preco: 42.9 },
  { nome: "Quatro Queijos", preco: 48.9 },
  { nome: "Frango com Bacon", preco: 45.9 },
  { nome: "Carne Seca", preco: 51.9 },
];
const primeiro = document.querySelector("#primeiro-sabor"),
  segundo = document.querySelector("#segundo-sabor"),
  preco = document.querySelector("#preco-meio-a-meio"),
  descricao = document.querySelector("#descricao-pizza");
const moeda = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
sabores.forEach((s, i) => {
  primeiro.add(new Option(s.nome + " — " + moeda(s.preco), i));
  segundo.add(new Option(s.nome + " — " + moeda(s.preco), i));
});
segundo.selectedIndex = 1;
function atual() {
  return [sabores[Number(primeiro.value)], sabores[Number(segundo.value)]];
}
function resumo() {
  const [a, b] = atual();
  preco.textContent = moeda(Math.max(a.preco, b.preco));
  descricao.textContent = "Metade " + a.nome + " e metade " + b.nome;
}
function aviso(t) {
  const m = document.querySelector("#mensagem");
  m.textContent = t;
  m.classList.add("visivel");
  setTimeout(() => m.classList.remove("visivel"), 2200);
}
primeiro.onchange = resumo;
segundo.onchange = resumo;
document.querySelector("#finalizar-meio-a-meio").onclick = () => {
  const [a, b] = atual();
  if (a.nome === b.nome) return aviso("Escolha dois sabores diferentes.");
  const total = Math.max(a.preco, b.preco),
    pedidos = JSON.parse(localStorage.getItem("pedidosPizzaria") || "[]");
  pedidos.unshift({
    id: Date.now(),
    itens: [{ nome: "Meio " + a.nome + " / Meio " + b.nome, preco: total }],
    total,
    status: "Novo",
    data: new Date().toISOString(),
  });
  localStorage.setItem("pedidosPizzaria", JSON.stringify(pedidos));
  location.href = "pagamento.html?total=" + total.toFixed(2);
};
document.querySelector("#ano-atual").textContent = new Date().getFullYear();
resumo();
