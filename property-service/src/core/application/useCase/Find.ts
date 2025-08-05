import { Property } from '@/core/domain/entity/Property'
import { PropertyGateway } from '@/core/domain/gateway/PropertyGateway'
import { NotFound } from '@/shared/errors/custom/NotFound'
import { Either, left, right } from '@/shared/utils/Either'

type RequestProperty = {
  id: string
}

type ResponseProperty = Either<NotFound, Property>

export class FindPropertyUseCase {
  constructor(private readonly propertyRepository: PropertyGateway) {}

  async execute({ id }: RequestProperty): Promise<ResponseProperty> {
    const property = await this.propertyRepository.findById(id)
    if (!property) return left(new NotFound('Property not found'))
    return right(property)
  }
}
