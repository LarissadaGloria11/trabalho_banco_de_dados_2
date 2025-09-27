import fastify from 'fastify';
import knexConfig from './knexfile.js';
import knex from 'knex';

const app = fastify({ logger: true });
const db = knex(knexConfig.development);


app.get('/', async (request, reply) => {
  return { message: 'API funcionando!' };
});


app.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Servidor rodando em ${address}`);
});


// Listar as marcas
app.get('/marcas', async (request, reply) => {
  try {
    const marcas = await db('marcas');
    reply.code(200).send({ message: 'Marcas listadas', data: marcas, error: false });
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao listar marcas', data: [], error: true });
  }
});

// Buscar marca  pelo codigo ID
app.get('/marcas/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const marca = await db('marcas').where({ id }).first();
    if (marca) {
      reply.code(200).send({ message: 'Marca encontrada', data: marca, error: false });
    } else {
      reply.code(404).send({ message: 'Marca não encontrada', data: {}, error: true });
    }
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao buscar marca', data: {}, error: true });
  }
});

// Deletar marca por ID
app.delete('/marcas/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const deleted = await db('marcas').where({ id }).del();
    if (deleted) {
      reply.code(200).send({ message: 'Marca excluída', data: {}, error: false });
    } else {
      reply.code(404).send({ message: 'Marca não encontrada', data: {}, error: true });
    }
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao excluir marca', data: {}, error: true });
  }
});

// Listar produtos
app.get('/produtos', async (request, reply) => {
  try {
    const produtos = await db('produtos');
    reply.code(200).send({ message: 'Produtos listados', data: produtos, error: false });
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao listar produtos', data: [], error: true });
  }
});

// Buscar produto
app.get('/produtos/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const produto = await db('produtos').where({ id }).first();
    if (produto) {
      reply.code(200).send({ message: 'Produto encontrado', data: produto, error: false });
    } else {
      reply.code(404).send({ message: 'Produto não encontrado', data: {}, error: true });
    }
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao buscar produto', data: {}, error: true });
  }
});

// Cadastrar novo produto
app.post('/produtos', async (request, reply) => {
  const { nome, preco, estoque, id_marca } = request.body;
  try {
    const [id] = await db('produtos').insert({ nome, preco, estoque, id_marca });
    const novoProduto = await db('produtos').where({ id }).first();
    reply.code(201).send({ message: 'Produto cadastrado', data: novoProduto, error: false });
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao cadastrar produto', data: {}, error: true });
  }
});

// Listar clientes
app.get('/clientes', async (request, reply) => {
  try {
    const clientes = await db('clientes');
    reply.code(200).send({ message: 'Clientes listados', data: clientes, error: false });
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao listar clientes', data: [], error: true });
  }
});

// Buscar cliente
app.get('/clientes/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const cliente = await db('clientes').where({ id }).first();
    if (cliente) {
      reply.code(200).send({ message: 'Cliente encontrado', data: cliente, error: false });
    } else {
      reply.code(404).send({ message: 'Cliente não encontrado', data: {}, error: true });
    }
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao buscar cliente', data: {}, error: true });
  }
});

// Cadastrar novo cliente
app.post('/clientes', async (request, reply) => {
  const { nome, email, cidade } = request.body;
  try {
    const [id] = await db('clientes').insert({ nome, email, cidade });
    const novoCliente = await db('clientes').where({ id }).first();
    reply.code(201).send({ message: 'Cliente cadastrado', data: novoCliente, error: false });
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao cadastrar cliente', data: {}, error: true });
  }
});



