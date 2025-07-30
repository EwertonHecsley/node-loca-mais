import { BadRequest } from '@/shared/errors/custom/BadRequest'
import { Either, left, right } from '@/shared/utils/Either'

export type AddressProps = {
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

export class Address {
  private constructor(private props: AddressProps) { }

  static create(props: AddressProps): Either<BadRequest, Address> {
    if (!props.street || props.street.trim() === '') {
      return left(new BadRequest('Street is required'))
    }

    if (!props.number || props.number.trim() === '') {
      return left(new BadRequest('Number is required'))
    }

    if (!props.district || props.district.trim() === '') {
      return left(new BadRequest('District is required'))
    }

    if (!props.city || props.city.trim() === '') {
      return left(new BadRequest('City is required'))
    }

    if (!props.state || props.state.trim().length !== 2) {
      return left(new BadRequest('State must be a 2-letter code'))
    }

    if (!props.zipCode || !/^\d{5}-?\d{3}$/.test(props.zipCode)) {
      return left(new BadRequest('Invalid zip code format'))
    }

    return right(
      new Address({
        ...props,
        state: props.state.toUpperCase(),
      }),
    )
  }

  get street(): string {
    return this.props.street
  }

  get number(): string {
    return this.props.number
  }

  get district(): string {
    return this.props.district
  }

  get city(): string {
    return this.props.city
  }

  get state(): string {
    return this.props.state
  }

  get zipCode(): string {
    return this.props.zipCode
  }

  get value(): AddressProps {
    return this.props
  }

  format(): string {
    return `${this.street}, ${this.number} - ${this.district}, ${this.city}/${this.state}, ${this.zipCode}`
  }
}
