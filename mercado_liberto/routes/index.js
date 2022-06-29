var express = require('express');
var router = express.Router();
var db = require("../db");

var usuario_logado
var usuario_edicao
var trasportadora_edicao
var produto_edicao
var senhaAdmin = 'admin123'

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res) => {
  let filtro = { Email: req.body.email, Senha: req.body.password }
  rand = Math.random();

  var Clientes = db.Mongoose.model('mercadoliberto', db.UserSchema, 'mercadoliberto');
  Clientes.find(filtro).lean().exec(function (e, docs) {
    if (!e && docs.length > 0) {
      usuario_logado = docs[0];
      var Produto = db.Mongoose.model('produto', db.ProductSchema, 'produto');
      Produto.aggregate([{ $sample: { size: 4}}]).exec(function (e, docs2){
        if(!e && docs2.length > 0){
          produto_home = docs2;
          res.render('home', { docs: [usuario_logado], produto_home });
        } else{
          produto_home = docs2;
          res.render('home', { docs: [usuario_logado], produto_home });
        }
      })
    }else{
        console.log('Erro ao fazer login!');
    }
  });
});

router.get('/home', function (req, res, next){
  var Produto = db.Mongoose.model('produto', db.ProductSchema, 'produto');
  Produto.aggregate([{ $sample: { size: 4}}]).exec(function (e, docs) {
    if (!e && docs.length > 0) {
      produto_home = docs;
      res.render('home', { docs: [usuario_logado], produto_home });
    } else {
      produto_home = docs;
      res.render('home', { docs: [usuario_logado], produto_home });
    }
  });
});

router.get('/nova_conta', function (req, res, next) {
  res.render('nova_conta', { title: 'Express' });
});

router.post('/nova_conta', function (req, res) {
  var novo_usuario = {
    Nome: req.body.name,
    Email: req.body.email,
    Telefone: req.body.phone,
    Senha: req.body.password,
    ADM: 0
  }

  if (req.body.cnpj != '') {
    novo_usuario['CNPJ'] = req.body.cnpj;
    novo_usuario['TipoCadastro'] = 'empresa';
    novo_usuario.ADM = 0;
  } else {
    novo_usuario['CPF'] = req.body.cpf;
    novo_usuario['DataNascimento'] = req.body.birthday;
    novo_usuario['TipoCadastro'] = 'pessoal';
  }

  if (req.body.passwordADM == senhaAdmin) {
    novo_usuario.ADM = 1;
    novo_usuario['RG'] = req.body.rg;
  } else {
    novo_usuario.ADM = 0;
    novo_usuario['Rua'] = req.body.street;
    novo_usuario['Bairro'] = req.body.district;
    novo_usuario['Numero'] = req.body.number;
    novo_usuario['Complemento'] = req.body.complement;
    novo_usuario['Cidade'] = req.body.city;
    novo_usuario['Estado'] = req.body.state;
  }

  var Clientes = db.Mongoose.model('mercadoliberto', db.UserSchema, 'mercadoliberto');
  var novo_cliente = new Clientes(novo_usuario);
  novo_cliente.save(function (err){
    if (err) {
      console.log("Error! " + err.message);
      return err;
    } else {
        Clientes.find(novo_usuario).lean().exec(function (e, docs){
          if(!e){
            usuario_logado = docs[0];
            var Produto = db.Mongoose.model('produto', db.ProductSchema, 'produto');
            Produto.aggregate([{ $sample: { size: 4}}]).exec(function (e, docs2){
              if(!e && docs2.length > 0){
                produto_home = docs2;
                res.render('home', { docs: [usuario_logado], produto_home });
              } else {
                produto_home = docs2;
                res.render('home', { docs: [usuario_logado], produto_home });
              }
            })
          }
        })
    }
  })
});

router.get('/lista_usuarios', function (req, res, next) {
  var Clientes = db.Mongoose.model('mercadoliberto', db.UserSchema, 'mercadoliberto');
  Clientes.find().lean().exec(function (e, docs) {
    if (!e) {
      res.render('lista_usuarios', { docs, usuario_logado });
    } else {
      console.log('Erro ao carregar a página');
    }
  });
});

router.post('/id_edita_usuario', function (req, res) {
  var Clientes = db.Mongoose.model('mercadoliberto', db.UserSchema, 'mercadoliberto');
  Clientes.find({ _id: req.body.id }).lean().exec(function (e, docs) {
    if (!e && docs.length > 0) {
      usuario_edicao = docs[0];
      res.render('edita_usuario', { docs, usuario_logado });
    } else {
      console.log('Erro ao fazer login!');
    }
  });
});

router.post('/edita_usuario', function (req, res, next) {
  var usuario_editado = {
    Nome: req.body.name,
    Email: req.body.email,
    Telefone: req.body.phone,
    Senha: req.body.password,
    ADM: req.body.adm,
    TipoCadastro: req.body.type
  }

  if (usuario_editado.TipoCadastro == 'empresa') {
    usuario_editado['CNPJ'] = req.body.cnpj;
  } else {
    usuario_editado['CPF'] = req.body.cpf;
    usuario_editado['DataNascimento'] = req.body.birthday;
  }

  if (usuario_editado.ADM == 1) {
    usuario_editado['RG'] = req.body.rg;
  } else {
    usuario_editado['Rua'] = req.body.street;
    usuario_editado['Bairro'] = req.body.district;
    usuario_editado['Numero'] = req.body.number;
    usuario_editado['Complemento'] = req.body.complement;
    usuario_editado['Cidade'] = req.body.city;
    usuario_editado['Estado'] = req.body.state;
  }

  var Clientes = db.Mongoose.model('mercadoliberto', db.UserSchema, 'mercadoliberto');
  Clientes.updateOne({ "_id": req.body.id }, usuario_editado, function (err) {
    if (err) return console.error(err);
    else {
      Clientes.find(usuario_editado).lean().exec(function (e, docs2) {
        if (!e) {
          res.render('home', { docs: [usuario_editado] });
        } else {
          console.log('Erro ao fazer edição!');
        }
      });
    }
  });
});

router.get('/remove_usuario', function (req, res, next) {
  var Clientes = db.Mongoose.model('mercadoliberto', db.UserSchema, 'mercadoliberto');
  Clientes.deleteOne({ _id: usuario_edicao._id }).lean().exec(function (err, docs2) {
    if (err) return console.error(err);
    else res.render('home', { docs: [usuario_logado] });
  });
});

router.get('/edita_conta', function (req, res, next) {
  res.render('edita_conta', { docs: [usuario_logado] });
});

router.post('/edita_conta', function (req, res, next) {
  var usuario_editado = {
    Nome: req.body.name,
    Email: req.body.email,
    Telefone: req.body.phone,
    Senha: req.body.password,
    ADM: req.body.adm,
    TipoCadastro: req.body.type
  }

  if (usuario_editado.TipoCadastro == 'empresa') {
    usuario_editado['CNPJ'] = req.body.cnpj;
  } else {
    usuario_editado['CPF'] = req.body.cpf;
    usuario_editado['DataNascimento'] = req.body.birthday;
  }

  if (usuario_editado.ADM == 1) {
    usuario_editado['RG'] = req.body.rg;
  } else {
    usuario_editado['Rua'] = req.body.street;
    usuario_editado['Bairro'] = req.body.district;
    usuario_editado['Numero'] = req.body.number;
    usuario_editado['Complemento'] = req.body.complement;
    usuario_editado['Cidade'] = req.body.city;
    usuario_editado['Estado'] = req.body.state;
  }

  var Clientes = db.Mongoose.model('mercadoliberto', db.UserSchema, 'mercadoliberto');
  Clientes.updateOne({ _id: usuario_logado._id }, usuario_editado, function (err) {
    if (err) return console.error(err);
    else {
      Clientes.find(usuario_editado).lean().exec(function (e, docs) {
        if (!e) {
          usuario_logado = docs[0];
          res.render('home', { docs: [usuario_editado] });
        } else {
          console.log('Erro ao fazer edição!');
        }
      });
    }
  });
});

router.get('/remove_conta', function (req, res, next) {
  var Clientes = db.Mongoose.model('mercadoliberto', db.UserSchema, 'mercadoliberto');
  Clientes.deleteOne({ _id: usuario_logado._id }).lean().exec(function (err, docs) {
    if (err) return console.error(err);
    else res.render('index', { title: "Cliente excluído!" });
  });
});

router.get('/produto', function (req, res){
  var Transportadora = db.Mongoose.model('transportadora', db.ShippingSchema, 'transportadora');
  Transportadora.find().lean().exec(function (e, docs) {
    if (!e) {
      res.render('produto', { docs, usuario_logado });
    } else {
      console.log('Erro ao carregar a página');
    }
  });
});

router.post('/produto', function (req, res){
  var produto_novo = {
    Nome: req.body.product,
    Imagem: 'imagem',
    Preco: req.body.value,
    QuantidadeEstoque: req.body.inventory,
    Caracteristicas: req.body.characteristics,
    Descricao: req.body.description,
    Categoria: req.body.category,
    Transportadoras: req.body.shippingCheckbox,
    IdVendedor: usuario_logado._id
  }

  var Produto = db.Mongoose.model('produto', db.ProductSchema, 'produto');
  var novo_produto = new Produto(produto_novo);
  novo_produto.save(function (err) {
    if (err) {
      console.log("Error! " + err.message);
      return err;
    } else {
      res.render('home', { docs: [usuario_logado] });
    }
  });
});

router.get('/lista_produtos', function (req, res, next) {
  var Produto = db.Mongoose.model('produto', db.ProductSchema, 'produto');
  Produto.find({IdVendedor: usuario_logado._id}).lean().exec(function (e, docs) {
    if (!e) {
      docs.map((item_produto, i)=>{
        docs[i]['NomeTransportadoras'] = ''
        if(typeof( item_produto.Transportadoras) == 'object'){
          item_produto.Transportadoras.map((item_transportadora, j)=>{
            let virgula_espaco = j == item_produto.Transportadoras.length - 1 ? '' : ', ';
            docs[i]['NomeTransportadoras'] += item_transportadora.split('_')[1] + virgula_espaco;
          })
        }
      })

      res.render('lista_produtos', { docs, usuario_logado });
    } else {
      console.log('Erro ao carregar a página');
    }
  });
});

router.get('/lista_produtos_adm', function (req, res, next) {
  var Produto = db.Mongoose.model('produto', db.ProductSchema, 'produto');
  Produto.find().lean().exec(function (e, docs) {
    if (!e) {
      docs.map((item_produto, i)=>{
        docs[i]['NomeTransportadoras'] = ''
        if(typeof( item_produto.Transportadoras) == 'object'){
          item_produto.Transportadoras.map((item_transportadora, j)=>{
            let virgula_espaco = j == item_produto.Transportadoras.length - 1 ? '' : ', ';
            docs[i]['NomeTransportadoras'] += item_transportadora.split('_')[1] + virgula_espaco;
          })
        }
      })

      res.render('lista_produtos', { docs, usuario_logado });
    } else {
      console.log('Erro ao carregar a página');
    }
  });
});

router.post('/id_edita_produto', function (req, res) {
  var Produto = db.Mongoose.model('produto', db.ProductSchema, 'produto');
  Produto.find({ _id: req.body.id }).lean().exec(function (e, docs) {
    if (!e && docs.length > 0) {
      produto_edicao = docs[0];
      var Transportadora = db.Mongoose.model('transportadora', db.ShippingSchema, 'transportadora');
      Transportadora.find().lean().exec(function (e, shipping) {
        if (!e) res.render('edita_produto', { docs, usuario_logado, shipping });
      });
    } else {
      console.log('Erro ao fazer login!');
    }
  });
});



router.post('/edita_produto', function (req, res, next) {
  var produto_editado = {
    Nome: req.body.product,
    Imagem: 'imagem',
    Preco: req.body.value,
    QuantidadeEstoque: req.body.inventory,
    Caracteristicas: req.body.characteristics,
    Descricao: req.body.description,
    Categoria: req.body.category,
    Transportadoras: req.body.shippingCheckbox,
    IdVendedor: usuario_logado._id
  }

  var Produto = db.Mongoose.model('produto', db.ProductSchema, 'produto');
  Produto.updateOne({ "_id": req.body.id }, produto_editado, function (err) {
    if (err) return console.error(err);
    else {
      Produto.find(produto_editado).lean().exec(function (e, docs2) {
        if (!e) {
          res.render('home', { docs: [usuario_logado] });
        } else {
          console.log('Erro ao fazer edição!');
        }
      });
    }
  });
});

router.get('/remove_produto', function (req, res, next) {
  var Produto = db.Mongoose.model('produto', db.ProductSchema, 'produto');
  Produto.deleteOne({ _id: produto_edicao._id }).lean().exec(function (err, docs2) {
    if (err) return console.error(err);
    else res.render('home', { docs: [usuario_logado] });
  });
});

router.get('/transportadora', function(req, res){
  res.render('transportadora', { usuario_logado });
});

router.post('/transportadora', function (req, res){
  var transportadora_nova = {
    Nome: req.body.shipping_company,
    PrecoCartaRegistrada: req.body.registered_letter,
    PrecoAcima1KG: req.body.over_1kg,
    PrecoAcima10KG: req.body.over_10kg,
    PrecoAcima50KG: req.body.over_50kg
  }

  var Transportadora = db.Mongoose.model('transportadora', db.ShippingSchema, 'transportadora');
  var nova_transportadora = new Transportadora(transportadora_nova);
  nova_transportadora.save(function (err) {
    if (err) {
      console.log("Error! " + err.message);
      return err;
    } else {
      res.render('home', { docs: [usuario_logado] });
    }
  });
});

router.get('/lista_transportadoras', function (req, res, next) {
  var Transportadora = db.Mongoose.model('transportadora', db.ShippingSchema, 'transportadora');
  Transportadora.find().lean().exec(function (e, docs) {
    if (!e) {
      res.render('lista_transportadoras', { docs, usuario_logado });
    } else {
      console.log('Erro ao carregar a página');
    }
  });
});

router.post('/id_edita_transportadora', function (req, res) {
  var Transportadora = db.Mongoose.model('transportadora', db.ShippingSchema, 'transportadora');
  Transportadora.find({ _id: req.body.id }).lean().exec(function (e, docs) {
    if (!e && docs.length > 0) {
      trasportadora_edicao = docs[0];
      res.render('edita_transportadora', { docs, usuario_logado });
    } else {
      console.log('Erro ao fazer login!');
    }
  });
});

router.post('/edita_transportadora', function (req, res, next) {
  var transportadora_editada = {
    Nome: req.body.shipping_company,
    PrecoCartaRegistrada: req.body.registered_letter,
    PrecoAcima1KG: req.body.over_1kg,
    PrecoAcima10KG: req.body.over_10kg,
    PrecoAcima50KG: req.body.over_50kg
  }

  var Transportadora = db.Mongoose.model('transportadora', db.ShippingSchema, 'transportadora');
  Transportadora.updateOne({ "_id": req.body.id }, transportadora_editada, function (err) {
    if (err) return console.error(err);
    else {
      Transportadora.find(transportadora_editada).lean().exec(function (e, docs2) {
        if (!e) {
          res.render('home', { docs: [usuario_logado] });
        } else {
          console.log('Erro ao fazer edição!');
        }
      });
    }
  });
});

router.get('/remove_transportadora', function (req, res, next) {
  var Transportadora = db.Mongoose.model('transportadora', db.ShippingSchema, 'transportadora');
  Transportadora.deleteOne({ _id: trasportadora_edicao._id }).lean().exec(function (err, docs2) {
    if (err) return console.error(err);
    else res.render('home', { docs: [usuario_logado] });
  });
});

router.post('/buscar_produto', function (req, res, next){
  var Produto = db.Mongoose.model('produto', db.ProductSchema, 'produto');
  Produto.find({Nome: {$regex: '.*' + req.body.searchbar + '.*'} }).lean().exec(function (e, docs) {
    if (!e) {
      res.render('buscar_produto', { docs, usuario_logado });
    } else {
      console.log('Erro ao carregar a página');
    }
  });
});

router.post('/pagina_produto', function (req, res) {
  var Produto = db.Mongoose.model('produto', db.ProductSchema, 'produto');
  Produto.find({ _id: req.body.id }).lean().exec(function (e, docs) {
    if (!e && docs.length > 0) {
      pagina_produto = docs[0];
      var Transportadora = db.Mongoose.model('transportadora', db.ShippingSchema, 'transportadora');
      Transportadora.find().lean().exec(function (e, shipping) {
        if (!e) res.render('pagina_produto', { docs, usuario_logado, shipping });
      });
    } else {
      console.log('Erro ao fazer login!');
    }
  });
});

module.exports = router;
