# Backend Projeto App Mobile

Projeto para por em prática todo aprendizado em Node.js.

A ideia é desenvolver um aplicativo mobile para uma loja de roupas da nossa região. O diferencial seria importar postagens do Instagram e 
utilizar para mostrar no aplicativo os produtos disponíveis.

Até o momento, a API conta com:
- Rotas CRUD de usuários;
- Rota para obter posts do Instagram.

# Tecnologias utilizadas
- Hapi.js para criação de toda API
- @Hapi/Joi para validação das rotas
- @Hapi/Swagger para a documentação
- @Hapi/Boom para tratamento de erros
- Mocha e recursos nativos do Node.js para testes unitários e de integração
- MongoDB + Mongoose
- Docker

Siga os passo a passo que não tem como dar errado, se der errado, qualquer coisa, não me chame.

# Configurando o Docker

1 - Baixe o Docker<br>
2 - Tenha certeza que o Docker está preparado para ser utilizado(nada de erro e alertas quando você abre ele)<br>
3 - Execute no terminal os comandos um de cada vez:

```
docker run --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin -d mongo:4
```
*Criando um container MongoDB para a porta 27017 e adicionando credenciais de administrador*
```
docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient
```
*Criando um container para a porta 3000 que vai ser a interface para utilizar o container criado anteriormente*
```
docker exec -it mongodb mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin 
--eval "db.getSiblingDB('mundo-m').createUser({user: 'leallegal', pwd: 'secretcat', roles: [{role: 'readWrite', db: 'mundo-m'}]})"
```
*Configurando um usuário com permissões de leitura/escrita*

4 - Se não deu nenhum erro, já pode ir configurar o app.

# Configurando o App

1 - Clone o repositório e de um `npm install`.<br>
2 - Após instalar tudo, ligue os containers no Docker e execute os testes para ver se esta tudo certo: `npm t`.<br>
3 - Se passou em tudo, ligue o servidor: `node api.js`.<br>
4 - Sempre lembre de ligar os containers no Docker!!!!!!!!!!!!

# Documentação

Acesse a documentação da API feito pelo Swagger pela url `localhost:5000/documentation`.

# Agradecimentos

Projeto em parceria do meu querido amigo Vinicius que está fazendo o frontend da aplicação, confira <a href="https://github.com/V1niSouza/Front-end-Projeto-Mobile-">aqui</a>.
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
