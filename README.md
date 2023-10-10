# Teste técnico Riderize:
O objetivo desse desafio é criar uma API que irá possibilitar a criação de pedais pelos usuários, além disso outros usuários poderão visualizar esses pedais e se inscrever neles para que no dia marcado aqueles que se inscreveram possam pedalar em grupo.

Nesse documento:
- [Estrutura Geral da API](#estrutura-geral)
- [Tecnologias Usadas](#tecnologias-usadas)


# Estrutura Geral
## Requisitos Funcionais
- [x] Criação de Usuário
- [x] Login de Usuário

- [x] Criação de Pedais
- [x] Listar os Pedais com paginação de 15 em 15

- [x] Permitir que os usuários se inscrevam nos pedais
- [x] Visualização de Usuários inscritos em um Pedal
- [x] Listar os pedais que o usuário participou (se inscreveu)
- [x] Listar os pedais criados pelo usuário

- [x] Deletar Pedal
- [x] Cancelar inscrição em um pedal
## Requisitos Não Funcionais
- [x] Todas as consultas devem exigir o usuário autenticado com um JWT
- [x] Usuário deve ter (APENAS) a senha encriptografada salva no banco
- [x] Emails dos usuários devem ser únicos
- [x] Telefone dos usuários devem ser opcionais, porém únicos

## Regras de Negócio
- [x] Não permitir cadastro no pedal depois da data de encerramento de inscrição (**end_date_registration**)
- [x] Não permitir cadastro no pedal antes da data de abertura de inscrição (**start_date_registration**)
- [x] Data de início de registro da inscrição deve ser menor (anterior) à sua data de fim
- [x] Data do evento deve ser posterior à data final de inscrição (e consequentemente posterior à data de início de inscrição também)
- [x] Usuário não pode se inscrever para o mesmo pedal duas vezes
- [x] Usuário não pode se inscrever no pedal criado por ele mesmo
- [x] Não permitir inscrição de novos usuários caso o limite de participantes do Pedal seja atingido


# Tecnologias Usadas
Abaixo todas as tecnologias empregadas no projeto separadas por suas respectivas áreas de utilidade.

## API
- **Node**;
- **Typescript**;
- **GraphQL**;
- **ApolloServer**;
- **TypeGraphQL**;

## Persistência de Dados
- **PostgreSQL**: banco principal
- **Prisma**: ORM para acesso e modelagem do banco;
- **Redis**: cache das consultas de pedais;
- **ioredis**: Client para manipular o redis;

## Docker
Usado para rodar localmente:
- **PostgreSQL**: banco principal
- **Redis**: banco de cache

## Hospedagem
- **Heroku**: Hospeda toda a API e fornece os serviços dos bancos Postgresql e Redis.

## CI/CD
- **CI**: A implementação do CI foi feita utilizando o **Github Actions** sempre que houver um push ou pull request para a main e, nesse processo, antes da integração do novo código, executa-se e espera o sucesso de todos os testes unitários;

- **CD**: A parte de deploy/delivery contínuo foi feita através da própria ferramenta do **Heroku** e é acionada sempre que houver mudança de conteúdo na **main**.