import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken"; 

interface Decoded {
    role: string;
    codUsuario: number;
    email: string;
}

export async function autenticarUsuario(request: FastifyRequest, reply: FastifyReply): Promise<Decoded | null> {
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