# Backend Projeto App Mobile

Projeto para por em prática todo aprendizado em Node.js.

A ideia inicial era desenvolver um aplicativo mobile para uma loja de roupas da nossa região. O diferencial seria importar postagens do instagram e 
utilizar para mostrar no aplicativo os produtos disponiveis.

Tecnologias utilizadas:
- Hapi.js para criação de toda API
- Hapi/Joi para validação das rotas
- Hapi/Swagger para a documentação
- Mocha e recursos nativos do Node.js para testes unitários
- MongoDB + Mongoose
- Docker

Siga os passo a passo que não tem como dar errado, se der errado, qualquer coisa, não me chame.

# Configurando o Docker

1 - Baixe o Docker<br>
2 - Execute no CMD de cada vez os comandos:

```
docker run --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin -d mongo:4
```
```
docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient
```
```
docker exec -it mongodb mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin 
--eval "db.getSiblingDB('mundo-m').createUser({user: 'leallegal', pwd: 'secretcat', roles: [{role: 'readWrite', db: 'mundo-m'}]})"
```

# Configurando o App

1 - Clone o repositório e de um `npm install`.<br>
2 - Após instalar todos os módulos, execute os testes para ver se esta tudo certo: `npm t`.<br>
3 - Se passou em tudo, ligue o servidor: `node api.js`<br>
4 - Não esqueça de ligar o Docker toda vez que for mexer com o backend!!

Projeto em parceria do meu querido amigo Vinicius que está fazendo o frontend da aplicação.
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/V1niSouza">
        <img src="https://avatars.githubusercontent.com/u/99757527?v=4" width="100px;" alt="Foto do Vinicius Souza no GitHub"/><br>
        <sub>
          <b>Vinicius Souza</b>
        </sub>
      </a>
    </td>
</table>
