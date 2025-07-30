import { Property } from '@/core/domain/entity/Property'
import { Address } from '@/core/domain/objectValue/Address'
import { BadRequest } from '@/shared/errors/custom/BadRequest'
import { Either, left, right } from '@/shared/utils/Either'

type CreatePropertyDTO = {
  description: string
  photos: string[]
  address: {
    street: string
    number: string
    district: string
    city: string
    state: string
    zipCode: string
  }
}

export class CreatePropertyFactory {
  static create(dto: CreatePropertyDTO): Either<BadRequest, Property> {
    const { description, photos, address } = dto

    if (!description || !photos || !address) {
      return left(new BadRequest('Invalid property data'))
    }

    const createdAddress = Address.create(address)
    if (createdAddress.isLeft()) {
      return left(createdAddress.value)
    }

    const property = Property.create({
      description,
      photos,
      address: createdAddress.value,
    })

    return right(property)
  }
}
