import Entity from '@/core/generics/Entity'
import { Address } from '../objectValue/Address'
import Identity from '@/core/generics/Identity'

type PropertyProps = {
  description: string
  photos: string[]
  address: Address
}

export class Property extends Entity<PropertyProps> {
  private constructor(props: PropertyProps, id?: Identity) {
    super(props, id)
  }

  static create(props: PropertyProps, id?: Identity): Property {
    if (!props.description || props.description.trim() === '') {
      throw new Error('Description is required')
    }

    if (!props.photos || props.photos.length === 0) {
      throw new Error('At least one photo is required')
    }

    if (!props.address) {
      throw new Error('Address is required')
    }

    return new Property(props, id)
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

  updateDescription(description: string): void {
    if (!description || description.trim() === '') {
      throw new Error('Description is required')
    }

    this.props.description = description
  }

  updatePhotos(photos: string[]): void {
    if (!photos || photos.length === 0) {
      throw new Error('At least one photo is required')
    }

    this.props.photos = photos
  }

  updateAddress(address: Address): void {
    this.props.address = address
  }
}
