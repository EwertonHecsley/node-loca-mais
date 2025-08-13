import { PropertyGateway } from '@/core/domain/gateway/PropertyGateway'
import { NotFound } from '@/shared/errors/custom/NotFound'
import { Either, left, right } from '@/shared/utils/Either'

type Request = {
  id: string
}

type Response = Either<NotFound, boolean>

export class DeletePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyGateway) {}

  async execute({ id }: Request): Promise<Response> {
    const property = await this.propertyRepository.findById(id)
    if (!property) return left(new NotFound(`Property ${id} not found`))
    await this.propertyRepository.delete(id)
    return right(true)
  }
}
