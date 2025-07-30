import { Property } from '@/core/domain/entity/Property'
import { Address } from '@/core/domain/objectValue/Address'
import { BadRequest } from '@/shared/errors/custom/BadRequest'
import { Either, left, right } from '@/shared/utils/Either'

type CreatePropertyDTO = {
  description: string;
  price: number;
  photos: string[];
  address: {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
  }
}

export class CreatePropertyFactory {
  static create(dto: CreatePropertyDTO): Either<BadRequest, Property> {
    const { description, photos, address, price } = dto;

    if (!description) return left(new BadRequest('Description is required.'));

    if (!photos || photos.length === 0) return left(new BadRequest('At least one photo is required.'));

    if (!address) return left(new BadRequest('Address is required.'));

    const createdAddress = Address.create(address)
    if (createdAddress.isLeft()) {
      return left(createdAddress.value)
    }

    if (typeof price !== 'number' || isNaN(price) || price < 0) {
      return left(new BadRequest('Invalid price value.'));
    }

    const property = Property.create({
      description,
      photos,
      price,
      address: createdAddress.value,
    })

    return right(property);
  }
}
