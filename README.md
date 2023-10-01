# Teste técnico Riderize:
O objetivo desse desafio é criar uma API que irá possibilitar a criação de pedais pelos usuários, além disso outros usuários poderão visualizar esses pedais e se inscrever neles para que no dia marcado aqueles que se inscreveram possam pedalar em grupo.


## Requisitos Funcionais
- [x] Criação de Usuário
- [ ] Visualização de Usuários
- [x] Login de Usuário

- [ ] Criação de Pedais
- [ ] Listar os Pedais
- [ ] Listar os usuários registrados no pedal
- [ ] Listar os pedais que o usuário participou
- [ ] Listar os pedais criados pelo usuário

## Requisitos Não Funcionais
- [ ] Todas as consultas devem exigir o usuário autenticado com um JWT
- [ ] Não permitir cadastro no pedal depois da data de encerramento de inscrição (**end_date_registration**)
- [x] Usuário deve ter a senha encriptografada salva no banco

## Regras de Negócio
- [x] Emails dos usuários devem ser únicos
- [x] Telefone dos usuários devem ser opcionais, porém únicos