# Backend do App API Instagram

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
2 - Após instalar todos os módulos, execute os testes: `npm t`.<br>
3 - Não esqueça de ligar o Docker toda vez que for mexer com o backend!!
