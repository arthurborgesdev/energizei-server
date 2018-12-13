# energizei-server

## Pra que serve?

É o aplicativo para fazer o login e acessar os dados de temperatura e umidade enviados pelo spring-meadow (Raspberry PI zero W).


## Como funciona?

Após fazer o login, o usuário tem acesso a gráficos indicando a temperatura e umidade do spring-meadow (Raspberry PI zero W).


## Arquivos principais e suas funções

**/app.js**

Arquivo principal, contendo as rotas, chamadas o banco de dados e respostas à página html.

## Coisas a fazer

* Melhorar o sistema de login, utilizando como base o projeto Pingo!.
* Fazer a interface com o spring-meadow, possibilitando receber os códigos de infravermelho e gravá-los no banco de dados, de acordo com suas funções. Em outras palavras, permitir a programação do controlador de acordo com os códigos do ar condicionado.
