var mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/mercado-liberto');

var userSchema = new mongoose.Schema(
    {
        Nome: String, 
        Email: String, 
        Telefone: String,
        Senha: String,
        CPF: String,
        RG: String,
        DataNascimento:String,
        ADM: Number,
        Rua: String,
        Bairro: String,
        Numero: String,
        Complemento: String,
        Cidade: String,
        Estado: String,
        TipoCadastro: String,
        CNPJ: String
    },
    {
        collection: 'mercadoliberto',
        versionKey: false
    }
);

var productSchema = new mongoose.Schema(
    {
        Nome: String,
        Imagem: String,
        Preco: Number,
        QuantidadeEstoque: Number,
        Caracteristicas: String,
        Descricao: String,
        Categoria: String,
        Transportadoras: Array,
        IdVendedor: String 
    },
    {
        collection: 'produto',
        versionKey: false
    }
);

var shippingSchema = new mongoose.Schema(
    {
        Nome: String,
        PrecoCartaRegistrada: Number,
        PrecoAcima1KG: Number,
        PrecoAcima10KG: Number,
        PrecoAcima50KG: Number
    },
    {
        collection: 'transportadora',
        versionKey: false
    }
);

var shoppingSchema = new mongoose.Schema(
    {
        Produtos:Array
    }
)

module.exports = { 
    Mongoose: mongoose,
    UserSchema: userSchema,
    ProductSchema: productSchema,
    ShippingSchema: shippingSchema 
}