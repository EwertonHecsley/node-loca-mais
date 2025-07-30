import { Property } from '@/core/domain/entity/Property'
import { PropertyGateway } from '@/core/domain/gateway/PropertyGateway'
import { Address } from '@/core/domain/objectValue/Address'
import { BadRequest } from '@/shared/errors/custom/BadRequest'
import { Either, left, right } from '@/shared/utils/Either'
import { CreatePropertyFactory } from './factory/CreatePropertyFactory'

type addresProps = {
  street: string
  number: string
  district: string
  city: string
  state: string
  zipCode: string
}

type RequestProperty = {
  description: string
  photos: string[]
  address: addresProps
}

type ResponseProperty = Either<BadRequest, Property>

export class CreatePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyGateway) {}

  async execute(request: RequestProperty): Promise<ResponseProperty> {
    const propertyOrError = CreatePropertyFactory.create(request)

    if (propertyOrError.isLeft()) {
      return left(propertyOrError.value)
    }

    const property = propertyOrError.value
    const createdProperty = await this.propertyRepository.create(property)

    return right(createdProperty)
  }
}
