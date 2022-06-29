
Para dar inicio no Banco de dados Mongo use o comando abaixo com o diretorio da pasta
mongod --dbpath "C:\Users\Loja_de_Vendas_Online\mercado_liberto"

Agora vamos criar um novo banco de dados compativel com o código executando os seguintes comandos
1- mongo

2- use mercado-liberto

3- info = { "Nome" : "Admin1", "Email": "admin@gmail.com", "Telefone": "12345678", "Senha": "admin123", "CPF" : "12345678901", "RG" : "12345678901", "DataNascimento" : "01-01-01", "ADM" : "1"}

4- db.mercadoliberto.insert(info);

Inicializado o Banco de Dados va ao diretorio do projeto e execute o:
npm start

Agora basta acessar este endereço no navegador:
http://localhost:3000/
