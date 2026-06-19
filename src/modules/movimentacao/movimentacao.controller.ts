import { FastifyReply, FastifyRequest } from 'fastify'
import { MovimentacaoService } from './movimentacao.service'
import { createMovimentacaoSchema } from './dto/create-movimentacao.dto'
import jwt from 'jsonwebtoken'; 

interface Decoded {
    role: string;
    codusuario: number;
    email: string;
}

export class MovimentacaoController {
    constructor(
        private service = new MovimentacaoService(),
    ) { }
    private autenticarUsuario = async (request: FastifyRequest, reply: FastifyReply): Promise<Decoded | null> => {
        try {
            const authHeader = request.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                reply.status(401).send({
                    statusCode: 401,
                    error: 'Unauthorized',
                    message: 'Token não fornecido ou inválido.'
                });
                return null;
            }

            const token = authHeader.split(' ')[1];
            const secretKey = process.env.JWT_SECRET || 'chave_secreta_reserva';

            const decoded = jwt.verify(token, secretKey) as Decoded;
            return decoded;

        } catch (error) {
            reply.status(401).send({
                statusCode: 401,
                error: 'Unauthorized',
                message: 'Token inválido ou expirado.'
            });
            return null;
        }
    }

    create = async (request: FastifyRequest, reply: FastifyReply) => {
        const usuarioLogado = await this.autenticarUsuario(request, reply);
        if (!usuarioLogado) return; 

        const result = await this.service.create(request.body, usuarioLogado.codusuario)
        return reply.status(201).send(result)
    }

    update = async (request: any, reply: FastifyReply) => {
        const usuarioLogado = await this.autenticarUsuario(request, reply);
        if (!usuarioLogado) return;

        const data = createMovimentacaoSchema.parse(request.body)

        const result = await this.service.update(
            request.params.id,
            usuarioLogado.codusuario,
            data,
        )

        return reply.send(result)
    }

    findAll = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const usuarioLogado = await this.autenticarUsuario(request, reply);
            if (!usuarioLogado) return;

            const {
                page,
                size,
                sort,
                descmovimento,
                categoria,
                conta
            } = request.query as any;

            const result = await this.service.findAll({
                page: page ? Number(page) : 0,
                size: size ? Number(size) : 10,
                sort: sort,
                descmovimento: descmovimento,
                codcategoria: categoria ? Number(categoria) : undefined,
                codconta: conta ? Number(conta) : undefined,
            }, usuarioLogado.codusuario);

            return reply.status(200).send(result);
        } catch (error) {
            throw error;
        }
    }

    findById = async (request: any, reply: FastifyReply) => {
        const usuarioLogado = await this.autenticarUsuario(request, reply);
        if (!usuarioLogado) return;

        const result = await this.service.findById(request.params.id, usuarioLogado.codusuario)
        return reply.send(result)
    }

    delete = async (request: any, reply: FastifyReply) => {
        try {
            const usuarioLogado = await this.autenticarUsuario(request, reply);
            if (!usuarioLogado) return;

            await this.service.delete(request.params.id, usuarioLogado.codusuario)
            return reply.status(204).send()
        } catch (error: any) {
            if (error.message.includes('Impossível deletar')) {
                return reply.status(404).send({
                    statusCode: 404,
                    error: 'Not Found',
                    message: error.message
                })
            }
            throw error;
        }
    }

    finalizar = async (request: any, reply: FastifyReply) => {
        const usuarioLogado = await this.autenticarUsuario(request, reply);
        if (!usuarioLogado) return;

        const result = await this.service.finalizar(request.params.id, usuarioLogado.codusuario)
        return reply.send(result)
    }

    findAllView = async (request: FastifyRequest, reply: FastifyReply) => {
        const usuarioLogado = await this.autenticarUsuario(request, reply);
        if (!usuarioLogado) return;

        const result = await this.service.findAllView(usuarioLogado.codusuario)
        return reply.send(result)
    }
}