import { Property } from '@/core/domain/entity/Property'
import { Address } from '@/core/domain/objectValue/Address'
import Identity from '@/core/generics/Identity'
import { Property as PropertyDatabase } from '@/generated/prisma'
import { InternalServerErrorException } from '@/shared/errors/custom/InternalServerErrorException'

export class PropertyPrismaMapper {
  static toDomain(entity: PropertyDatabase): Property {
    const address = Address.create({
      street: entity.street,
      city: entity.city,
      state: entity.state,
      district: entity.district,
      zipCode: entity.zipCode,
      number: entity.number,
    })

    if (address.isLeft()) {
      throw new InternalServerErrorException('Error to create address')
    }

    return Property.create(
      {
        description: entity.description,
        price: entity.price,
        photos: entity.photos,
        address: address.value,
      },
      new Identity(entity.id),
    )
  }

  static toDatabase(entity: Property): PropertyDatabase {
    return {
      id: entity.identityId.valueId,
      description: entity.description,
      price: entity.price,
      photos: entity.photos,
      street: entity.address.street,
      city: entity.address.city,
      state: entity.address.state,
      district: entity.address.district,
      zipCode: entity.address.zipCode,
      number: entity.address.number,
      createdAt: entity.createdAt,
    }
  }
}
