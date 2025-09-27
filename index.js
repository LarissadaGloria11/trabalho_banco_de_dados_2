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

// Listar pedidos com itens
app.get('/pedidos', async (request, reply) => {
  try {
    const pedidos = await db('pedidos');

    const pedidosComItens = await Promise.all(
      pedidos.map(async (pedido) => {
        const itens = await db('itens_pedidos').where({ id_pedido: pedido.id });
        return { ...pedido, itens };
      })
    );

    reply.code(200).send({ message: 'Pedidos listados', data: pedidosComItens, error: false });
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao listar pedidos', data: [], error: true });
  }
});

// Buscar pedido por ID com itens
app.get('/pedidos/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const pedido = await db('pedidos').where({ id }).first();
    if (!pedido) {
      return reply.code(404).send({ message: 'Pedido não encontrado', data: {}, error: true });
    }

    const itens = await db('itens_pedidos').where({ id_pedido: id });
    reply.code(200).send({ message: 'Pedido encontrado', data: { ...pedido, itens }, error: false });
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao buscar pedido', data: {}, error: true });
  }
});

// Buscar pedidos por cidade
app.get('/pedidos/cidade/:cidade', async (request, reply) => {
  const { cidade } = request.params;
  try {
    const pedidos = await db('pedidos').where({}).join('clientes', 'pedidos.id_cliente', '=', 'clientes.id')
      .where('clientes.cidade', cidade)
      .select('pedidos.*');

    const pedidosComItens = await Promise.all(
      pedidos.map(async (pedido) => {
        const itens = await db('itens_pedidos').where({ id_pedido: pedido.id });
        return { ...pedido, itens };
      })
    );

    reply.code(200).send({ message: `Pedidos da cidade ${cidade}`, data: pedidosComItens, error: false });
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao buscar pedidos por cidade', data: [], error: true });
  }
});

// Criar novo pedido com itens
app.post('/pedidos', async (request, reply) => {
  const { id_cliente, valor_total, itens } = request.body; // itens = [{id_produto, quantidade, preco_unitario}]

  try {
    const [id_pedido] = await db('pedidos').insert({ id_cliente, valor_total });
    
    // Inserir itens
    const itensInserir = itens.map(item => ({ ...item, id_pedido }));
    await db('itens_pedidos').insert(itensInserir);

    const novoPedido = await db('pedidos').where({ id: id_pedido }).first();
    const itensPedido = await db('itens_pedidos').where({ id_pedido });

    reply.code(201).send({ message: 'Pedido criado', data: { ...novoPedido, itens: itensPedido }, error: false });
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao criar pedido', data: {}, error: true });
  }
});




