import { Property } from '@/core/domain/entity/Property'
import { PaginatedResponse, PropertyGateway } from '@/core/domain/gateway/PropertyGateway'
import { InternalServerErrorException } from '@/shared/errors/custom/InternalServerErrorException'
import { Either, left, right } from '@/shared/utils/Either'

type ResponseProperty = Either<InternalServerErrorException, PaginatedResponse<Property>>

export class ListAllPropertyUseCase {
  constructor(private readonly propertyRepository: PropertyGateway) {}

  async execute(page: number, limit: number): Promise<ResponseProperty> {
    try {
      const properties = await this.propertyRepository.listAll({ page, limit })
      return right(properties)
    } catch (error) {
      return left(new InternalServerErrorException(`Failed to list properties: ${String(error)}`))
    }
  }
}
