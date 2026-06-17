

import { prisma } from '../../database/prisma'
import {BaseRepository} from '../shared/base/BaseRepository';



export class CartaoRepository extends BaseRepository<any> {
    constructor() {
        super(prisma.cartao)
    }
    
    handle(){
        prisma.cartao.findUnique({
            where : {
                codcartao: 1
            },include:{
                movimentacao : true
            }
        })
    }
}