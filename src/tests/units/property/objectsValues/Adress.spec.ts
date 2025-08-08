import { Address, AddressProps } from '@/core/domain/objectValue/Address'
import { BadRequest } from '@/shared/errors/custom/BadRequest'

describe('Address Value Object', () => {
  const validAddressProps: AddressProps = {
    street: 'Rua Principal',
    number: '123',
    district: 'Centro',
    city: 'Cidade Exemplo',
    state: 'SP',
    zipCode: '12345-678',
  }

  describe('create method', () => {
    it('should create an Address instance with valid props', () => {
      const result = Address.create(validAddressProps)

      expect(result.isRight()).toBeTruthy()
      expect(result.value).toBeInstanceOf(Address)

      const address = result.value as Address
      expect(address.street).toBe(validAddressProps.street)
      expect(address.number).toBe(validAddressProps.number)
      expect(address.district).toBe(validAddressProps.district)
      expect(address.city).toBe(validAddressProps.city)
      expect(address.state).toBe(validAddressProps.state.toUpperCase())
      expect(address.zipCode).toBe(validAddressProps.zipCode)
    })

    it('should convert state to uppercase when creating an address', () => {
      const propsWithLowercaseState = { ...validAddressProps, state: 'rj' }
      const result = Address.create(propsWithLowercaseState)

      expect(result.isRight()).toBeTruthy()
      const address = result.value as Address
      expect(address.state).toBe('RJ')
    })

    it('should return BadRequest for empty street', () => {
      const props = { ...validAddressProps, street: '' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('Street is required')
    })

    it('should return BadRequest for whitespace only street', () => {
      const props = { ...validAddressProps, street: '   ' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('Street is required')
    })

    // Validação de 'number'
    it('should return BadRequest for empty number', () => {
      const props = { ...validAddressProps, number: '' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('Number is required')
    })

    it('should return BadRequest for whitespace only number', () => {
      const props = { ...validAddressProps, number: '   ' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('Number is required')
    })

    it('should return BadRequest for empty district', () => {
      const props = { ...validAddressProps, district: '' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('District is required')
    })

    it('should return BadRequest for whitespace only district', () => {
      const props = { ...validAddressProps, district: '   ' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('District is required')
    })

    it('should return BadRequest for empty city', () => {
      const props = { ...validAddressProps, city: '' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('City is required')
    })

    it('should return BadRequest for whitespace only city', () => {
      const props = { ...validAddressProps, city: '   ' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('City is required')
    })

    it('should return BadRequest for invalid state length (too short)', () => {
      const props = { ...validAddressProps, state: 'S' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('State must be a 2-letter code')
    })

    it('should return BadRequest for invalid state length (too long)', () => {
      const props = { ...validAddressProps, state: 'SPQ' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('State must be a 2-letter code')
    })

    it('should return BadRequest for empty state', () => {
      const props = { ...validAddressProps, state: '' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('State must be a 2-letter code')
    })

    it('should return BadRequest for whitespace only state', () => {
      const props = { ...validAddressProps, state: '  ' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('State must be a 2-letter code')
    })

    it('should return BadRequest for invalid zip code format (too short)', () => {
      const props = { ...validAddressProps, zipCode: '1234567' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('Invalid zip code format')
    })

    it('should return BadRequest for invalid zip code format (alphanumeric)', () => {
      const props = { ...validAddressProps, zipCode: 'abcde-fgh' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('Invalid zip code format')
    })

    it('should return BadRequest for empty zip code', () => {
      const props = { ...validAddressProps, zipCode: '' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('Invalid zip code format')
    })

    it('should return BadRequest for whitespace only zip code', () => {
      const props = { ...validAddressProps, zipCode: '         ' }
      const result = Address.create(props)
      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('Invalid zip code format')
    })
  })

  describe('getter methods', () => {
    let address: Address

    beforeEach(() => {
      const result = Address.create(validAddressProps)
      if (result.isRight()) {
        address = result.value
      } else {
        fail('Failed to create address for getter tests, check create method or validAddressProps')
      }
    })

    it('should return the correct street', () => {
      expect(address.street).toBe(validAddressProps.street)
    })

    it('should return the correct number', () => {
      expect(address.number).toBe(validAddressProps.number)
    })

    it('should return the correct district', () => {
      expect(address.district).toBe(validAddressProps.district)
    })

    it('should return the correct city', () => {
      expect(address.city).toBe(validAddressProps.city)
    })

    it('should return the correct state (uppercase)', () => {
      expect(address.state).toBe(validAddressProps.state.toUpperCase())
    })

    it('should return the correct zip code', () => {
      expect(address.zipCode).toBe(validAddressProps.zipCode)
    })

    it('should return the correct value object via the value getter', () => {
      expect(address.value).toEqual({
        ...validAddressProps,
        state: validAddressProps.state.toUpperCase(),
      })
    })
  })

  describe('format method', () => {
    let address: Address

    beforeEach(() => {
      const result = Address.create(validAddressProps)
      if (result.isRight()) {
        address = result.value
      } else {
        fail('Failed to create address for format test, check create method or validAddressProps')
      }
    })

    it('should return the address in a correctly formatted string', () => {
      const expectedFormat = `${validAddressProps.street}, ${validAddressProps.number} - ${validAddressProps.district}, ${validAddressProps.city}/${validAddressProps.state.toUpperCase()}, ${validAddressProps.zipCode}`
      expect(address.format()).toBe(expectedFormat)
    })
  })
})
