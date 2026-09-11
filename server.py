import json, os, sqlite3
from pathlib import Path
from functools import wraps
from flask import Flask, jsonify, redirect, request, send_from_directory, session
BASE=Path(__file__).resolve().parent; DB=BASE/'data'/'pizzaria.db'
app=Flask(__name__,static_folder=str(BASE),static_url_path=''); app.config['SECRET_KEY']=os.environ.get('FLASK_SECRET_KEY','troque-esta-chave-em-producao')
def con():
 d=sqlite3.connect(DB); d.row_factory=sqlite3.Row; return d
def setup():
 DB.parent.mkdir(exist_ok=True)
 with con() as d:d.execute("CREATE TABLE IF NOT EXISTS pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT,itens TEXT NOT NULL,total REAL NOT NULL,status TEXT NOT NULL DEFAULT 'Novo',criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)")
def admin(f):
 @wraps(f)
 def w(*a,**k):
  if not session.get('admin'): return jsonify({'erro':'Acesso nao autorizado'}),401
  return f(*a,**k)
 return w
@app.before_request
def protect():
 if request.path=='/admin.html' and not session.get('admin'): return redirect('/login.html')
@app.get('/')
def home(): return send_from_directory(BASE,'index.html')
@app.post('/login')
def login():
 if request.form.get('usuario','').strip()=='Dono da pizzaria' and request.form.get('senha')==os.environ.get('PIZZARIA_ADMIN_PASSWORD','1203'):
  session['admin']=True; return redirect('/admin.html')
 return redirect('/login.html?erro=1')
@app.post('/logout')
def logout(): session.clear(); return redirect('/')
@app.post('/api/pedidos')
def create_order():
 x=request.get_json() or {}; itens=x.get('itens',[])
 if not isinstance(itens,list) or not itens:return jsonify({'erro':'Pedido invalido'}),400
 with con() as d: c=d.execute('INSERT INTO pedidos (itens,total) VALUES (?,?)',(json.dumps(itens,ensure_ascii=False),float(x.get('total',0))))
 return jsonify({'id':c.lastrowid}),201
@app.get('/api/pedidos')
@admin
def orders():
 with con() as d:r=d.execute('SELECT * FROM pedidos ORDER BY criado_em DESC').fetchall()
 return jsonify([{**dict(x),'itens':json.loads(x['itens'])} for x in r])
@app.patch('/api/pedidos/<int:id>')
@admin
def update(id):
 s=(request.get_json() or {}).get('status')
 if s not in {'Novo','Em preparo','Pronto','Entregue'}:return jsonify({'erro':'Status invalido'}),400
 with con() as d:d.execute('UPDATE pedidos SET status=? WHERE id=?',(s,id))
 return jsonify({'ok':True})
setup()
if __name__=='__main__':app.run(debug=True)
