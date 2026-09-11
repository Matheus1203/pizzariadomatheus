document.querySelector('#finalizar-pedido').onclick=async()=>{
 if(!carrinho.length)return aviso('Adicione uma pizza.')
 const total=carrinho.reduce((s,i)=>s+i.preco,0)
 try{
  const r=await fetch('/api/pedidos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({itens:carrinho,total})})
  if(!r.ok)throw new Error()
  location.href=`pagamento.html?total=${total.toFixed(2)}`
 }catch{aviso('Nao foi possivel registrar o pedido. Abra a loja pelo servidor.')}
}
