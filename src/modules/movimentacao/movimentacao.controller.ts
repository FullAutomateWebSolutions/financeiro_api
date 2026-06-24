import { FastifyReply, FastifyRequest } from 'fastify'
import { MovimentacaoService } from './movimentacao.service'
import { createMovimentacaoSchema } from './dto/create-movimentacao.dto'
import jwt from 'jsonwebtoken'; 

interface Decoded {
    role: string;
    codUsuario: number;
    email: string;
}

interface FindAllPage {
    page?: string | number; 
    size?: string | number; 
    sort?: string; 
    descMovimento?: string; 
    codCategoria?: string | number; 
    codConta?: string | number; 
    dataInicio?: string | Date; 
    dataFim?: string | Date;  
    codCartao?: string | number;  
}

interface IdParam {
    id: string;
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

        const result = await this.service.create(request.body, usuarioLogado.codUsuario)
        return reply.status(201).send(result)
    }

    update = async (request: FastifyRequest, reply: FastifyReply) => {
        const usuarioLogado = await this.autenticarUsuario(request, reply);
        if (!usuarioLogado) return;

        const { id } = request.params as IdParam;
        const data = createMovimentacaoSchema.parse(request.body)

        const result = await this.service.update(
            id,
            usuarioLogado.codUsuario,
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
                descMovimento,
                codCategoria,
                codConta,
                dataFim,
                dataInicio,
                codCartao
            } = request.query as FindAllPage;
            
            console.log(request.query)

            const result = await this.service.findAll({
                page: page ? Number(page) : 0,
                size: size ? Number(size) : 10,
                sort: sort,
                descMovimento: descMovimento,
                codCategoria: codCategoria ? Number(codCategoria) : undefined,
                codCartao: codCartao ? Number(codCartao) : undefined,
                codConta: codConta ? Number(codConta) : undefined,
                dataInicio: dataInicio ? dataInicio : undefined,
                dataFim: dataFim ? dataFim : undefined
            }, usuarioLogado.codUsuario);

            return reply.status(200).send(result);
        } catch (error) {
            throw error;
        }
    }

    findById = async (request: FastifyRequest, reply: FastifyReply) => {
        const usuarioLogado = await this.autenticarUsuario(request, reply);
        if (!usuarioLogado) return;

        const { id } = request.params as IdParam;
        const result = await this.service.findById(id, usuarioLogado.codUsuario)
        return reply.send(result)
    }

    delete = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const usuarioLogado = await this.autenticarUsuario(request, reply);
            if (!usuarioLogado) return;

            const { id } = request.params as IdParam;
            await this.service.delete(id, usuarioLogado.codUsuario)
            return reply.status(204).send()
        } catch (error: any) {
            if (error.message && error.message.includes('Impossível deletar')) {
                return reply.status(404).send({
                    statusCode: 404,
                    error: 'Not Found',
                    message: error.message
                })
            }
            throw error;
        }
    }

    finalizar = async (request: FastifyRequest, reply: FastifyReply) => {
        const usuarioLogado = await this.autenticarUsuario(request, reply);
        if (!usuarioLogado) return;

        const { id } = request.params as IdParam;
        const result = await this.service.finalizar(id, usuarioLogado.codUsuario)
        return reply.send(result)
    }

    findAllView = async (request: FastifyRequest, reply: FastifyReply) => {
        const usuarioLogado = await this.autenticarUsuario(request, reply);
        if (!usuarioLogado) return;

        const result = await this.service.findAllView(usuarioLogado.codUsuario)
        return reply.send(result)
    }
}