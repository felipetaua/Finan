Hooks são funções reutilizáveis de lógica, não de interface.

Eles servem para:

encapsular comportamentos repetidos
reduzir código duplicado em telas e componentes
organizar regras de negócio fora da UI


Explicação mais detalhada para não confundir:

Screen → tela inteira
Component → pedaço visual reutilizável
Service → comunicação externa (API, Firebase)
Context → estado global compartilhado
Hook → lógica reutilizável (sem interface)

Então por exemplo:
auth.service.js → fala com backend
auth.context.jsx → guarda estado do usuário
useAuth.js → fornece funções prontas para telas e componentes