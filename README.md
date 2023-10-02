# Teste técnico Riderize:
O objetivo desse desafio é criar uma API que irá possibilitar a criação de pedais pelos usuários, além disso outros usuários poderão visualizar esses pedais e se inscrever neles para que no dia marcado aqueles que se inscreveram possam pedalar em grupo.

## Requisitos Funcionais
- [x] Criação de Usuário
- [x] Login de Usuário

- [x] Criação de Pedais
- [x] Listar os Pedais com paginação de 15 em 15

- [x] Permitir que os usuários se inscrevam nos pedais
- [x] Visualização de Usuários inscritos em um Pedal
- [x] Listar os usuários registrados no pedal
- [x] Listar os pedais que o usuário participou
- [ ] Listar os pedais criados pelo usuário

## Requisitos Não Funcionais
- [ ] Todas as consultas devem exigir o usuário autenticado com um JWT
- [x] Não permitir cadastro no pedal depois da data de encerramento de inscrição (**end_date_registration**)
- [x] Não permitir cadastro no pedal antes da data de abertura de inscrição (**start_date_registration**)
- [x] Início de registro da inscrição deve ser menor (anterior) à sua data de fim
- [x] Usuário deve ter a senha encriptografada salva no banco

## Regras de Negócio
- [x] Emails dos usuários devem ser únicos
- [x] Telefone dos usuários devem ser opcionais, porém únicos

## Backlog
- [ ] Test for fields validation (?)