import { FastifyInstance } from "fastify";
import { UsuarioController } from "./usuario.controller";

export async function usuarioRoutes(app: FastifyInstance) {
    const controller = new UsuarioController();

    // // Adiciona o gancho (hook) para exigir autenticação JWT em todas as rotas deste plugin
    // app.addHook('preHandler', async (request, reply) => {
    //     try {
    //         await request.jwtVerify(); // Valida o token recebido no Header (Authorization: Bearer TOKEN)
    //     } catch (err) {
    //         return reply.status(401).send({
    //             statusCode: 401,
    //             error: 'Unauthorized',
    //             message: 'Token de autenticação ausente ou inválido.'
    //         });
    //     }
    // });

    // Definição das rotas apontando para o Controller do Usuário
    app.get('/', controller.findAllUser);
    app.get('/:id',controller.findById);
    app.put('/:id', controller.updateUser);
    app.delete('/:id', controller.deleteUser);
}