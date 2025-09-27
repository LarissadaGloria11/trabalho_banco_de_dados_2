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

