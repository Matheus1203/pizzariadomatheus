let nota = 0;
const e = [...document.querySelectorAll(".estrela")];
e.forEach(
  (x) =>
    (x.onclick = () => {
      nota = Number(x.dataset.nota);
      e.forEach((y) =>
        y.classList.toggle("ativa", Number(y.dataset.nota) <= nota),
      );
    }),
);
document.querySelector("#enviar").onclick = () => {
  const nome = document.querySelector("#nome").value.trim(),
    comentario = document.querySelector("#comentario").value.trim(),
    r = document.querySelector("#resultado");
  if (!nome || !comentario || !nota)
    return (r.textContent = "Preencha nome, estrelas e comentário.");
  const a = JSON.parse(localStorage.getItem("avaliacoesPizzaria") || "[]");
  a.unshift({
    id: Date.now(),
    nome,
    nota,
    comentario,
    visivel: true,
    data: new Date().toISOString(),
  });
  localStorage.setItem("avaliacoesPizzaria", JSON.stringify(a));
  r.textContent = "Obrigado! Avaliação enviada.";
  document.querySelector("#comentario").value = "";
  nota = 0;
  e.forEach((x) => x.classList.remove("ativa"));
};
