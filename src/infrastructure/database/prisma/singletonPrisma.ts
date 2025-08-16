import { PrismaService } from './PrismaService'

let prisma: PrismaService

export function getPrismaInstance(): PrismaService {
  if (!prisma) {
    prisma = new PrismaService()
  }
  return prisma
}
