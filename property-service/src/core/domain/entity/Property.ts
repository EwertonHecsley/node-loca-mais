import Entity from '@/core/generics/Entity'
import { Address } from '../objectValue/Address'
import Identity from '@/core/generics/Identity'
import { Optional } from '@/shared/utils/optional'
import { BadRequest } from '@/shared/errors/custom/BadRequest'

type PropertyProps = {
  description: string
  photos: string[]
  address: Address
  price: number
  createdAt: Date
}

export class Property extends Entity<PropertyProps> {
  private constructor(props: Optional<PropertyProps, 'createdAt'>, id?: Identity) {
    super({ ...props, createdAt: props.createdAt ?? new Date() }, id)
  }

  static create(props: Optional<PropertyProps, 'createdAt'>, id?: Identity): Property {
    this.validateDescription(props.description)
    this.validatePhotos(props.photos)
    this.validateAddress(props.address)
    this.validatePrice(props.price)

    return new Property(props, id);
  }

  get description(): string {
    return this.props.description
  }

  get photos(): string[] {
    return this.props.photos
  }

  get address(): Address {
    return this.props.address
  }

  get price(): number {
    return this.props.price
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  updateDescription(description: string): void {
    Property.validateDescription(description)
    this.props.description = description
  }

  updatePhotos(photos: string[]): void {
    Property.validatePhotos(photos)
    this.props.photos = photos
  }

  updatePrice(price: number): void {
    Property.validatePrice(price)
    this.props.price = price
  }

  updateAddress(address: Address): void {
    this.props.address = address
  }

  private static validateDescription(description: string) {
    if (!description || description.trim() === '') {
      throw new BadRequest('Description is required.')
    }
  }

  private static validatePhotos(photos: string[]) {
    if (!photos || photos.length === 0) {
      throw new BadRequest('At least one photo is required.')
    }
  }

  private static validateAddress(address: Address) {
    if (!address) {
      throw new BadRequest('Address is required.')
    }
  }

  private static validatePrice(price: number) {
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
      throw new BadRequest('Invalid price value.')
    }
  }
}
