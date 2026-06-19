
import { categoria } from '@prisma/client'; 
import { prisma } from '../../database/prisma';
import { BaseRepository } from '../shared/base/BaseRepository';

export class CategoriaRepository extends BaseRepository<categoria> {
  constructor() {
    super(prisma.categoria);
  }
}