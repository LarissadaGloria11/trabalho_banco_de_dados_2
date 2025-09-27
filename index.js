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
