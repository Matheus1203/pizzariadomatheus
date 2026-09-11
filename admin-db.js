const money=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
async function loadOrders(){
 const r=await fetch('/api/pedidos'); if(!r.ok)return location.href='login.html'; const orders=await r.json();
 document.querySelector('#total-pedidos').textContent=orders.length;
 document.querySelector('#pedidos-novos').textContent=orders.filter(x=>x.status==='Novo').length;
 const list=document.querySelector('#lista-pedidos'); list.innerHTML='';
 orders.filter(x=>document.querySelector('#filtro-status').value==='Todos'||x.status===document.querySelector('#filtro-status').value).forEach(x=>{
  const row=document.createElement('article');row.className='pedido';
  const name=document.createElement('div');name.textContent='#'+x.id+' - '+x.itens.map(i=>i.nome).join(', ');
  const value=document.createElement('strong');value.textContent=money(x.total);
  const select=document.createElement('select');['Novo','Em preparo','Pronto','Entregue'].forEach(s=>select.add(new Option(s,s,s===x.status,s===x.status)));
  select.onchange=async()=>{await fetch('/api/pedidos/'+x.id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:select.value})});loadOrders()};row.append(name,value,select);list.append(row)
 }); if(!orders.length)list.textContent='Nenhum pedido.';
}
document.querySelector('#filtro-status').onchange=loadOrders;document.querySelector('#criar-exemplo').hidden=true;loadOrders();
