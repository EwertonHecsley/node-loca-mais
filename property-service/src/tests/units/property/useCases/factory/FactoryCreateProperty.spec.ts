import { CreatePropertyFactory } from '@/core/application/useCase/factory/CreatePropertyFactory'
import { Property } from '@/core/domain/entity/Property'
import { Address } from '@/core/domain/objectValue/Address'
import { BadRequest } from '@/shared/errors/custom/BadRequest'
import { left, right } from '@/shared/utils/Either'

describe('CreatePropertyFactory', () => {
  let mockAddressInstance: Address
  let mockPropertyInstance: Property
  let addressCreateSpy: jest.SpyInstance
  let propertyCreateSpy: jest.SpyInstance

  const validCreatePropertyDTO = {
    description: 'Beautiful apartment with city view',
    photos: ['http://photo.com/1.jpg', 'http://photo.com/2.jpg'],
    address: {
      street: 'Rua Teste',
      number: '123',
      district: 'Centro',
      city: 'Cidade Teste',
      state: 'TS',
      zipCode: '12345-678',
    },
    price: 150000,
  }

  beforeAll(() => {
    mockAddressInstance = {
      street: 'Rua Teste',
      number: '123',
      district: 'Centro',
      city: 'Cidade Teste',
      state: 'TS',
      zipCode: '12345-678',
      format: () => 'Mock Address Format',
      value: {
        /* ... */
      },
    } as Address

    mockPropertyInstance = {
      description: 'Beautiful apartment with city view',
      photos: ['http://photo.com/1.jpg'],
      address: mockAddressInstance,
      price: 150000,
      createdAt: new Date(),
      id: { value: 'some-id' },
      updateDescription: jest.fn(),
      updatePhotos: jest.fn(),
      updatePrice: jest.fn(),
      updateAddress: jest.fn(),
    } as unknown as Property
  })

  beforeEach(() => {
    addressCreateSpy = jest.spyOn(Address, 'create')
    propertyCreateSpy = jest.spyOn(Property, 'create')

    addressCreateSpy.mockReturnValue(right(mockAddressInstance))
    propertyCreateSpy.mockReturnValue(mockPropertyInstance)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('create method', () => {
    it('should create a Property instance when all inputs are valid', () => {
      const result = CreatePropertyFactory.create(validCreatePropertyDTO)

      expect(result.isRight()).toBeTruthy()
      expect(result.value).toBe(mockPropertyInstance)
      expect(addressCreateSpy).toHaveBeenCalledTimes(1)
      expect(addressCreateSpy).toHaveBeenCalledWith(validCreatePropertyDTO.address)
      expect(propertyCreateSpy).toHaveBeenCalledTimes(1)
      expect(propertyCreateSpy).toHaveBeenCalledWith({
        description: validCreatePropertyDTO.description,
        photos: validCreatePropertyDTO.photos,
        price: validCreatePropertyDTO.price,
        address: mockAddressInstance,
      })
    })

    it('should return BadRequest if description is missing or empty', () => {
      const dtoEmpty = { ...validCreatePropertyDTO, description: '' }
      const resultEmpty = CreatePropertyFactory.create(dtoEmpty)
      expect(resultEmpty.isLeft()).toBeTruthy()
      expect(resultEmpty.value).toBeInstanceOf(BadRequest)
      expect((resultEmpty.value as BadRequest).message).toBe('Description is required.')

      const dtoUndefined = { ...validCreatePropertyDTO, description: undefined } as any
      const resultUndefined = CreatePropertyFactory.create(dtoUndefined)
      expect(resultUndefined.isLeft()).toBeTruthy()
      expect(resultUndefined.value).toBeInstanceOf(BadRequest)
      expect((resultUndefined.value as BadRequest).message).toBe('Description is required.')
    })

    it('should return BadRequest if photos array is missing or empty', () => {
      const dtoEmpty = { ...validCreatePropertyDTO, photos: [] }
      const resultEmpty = CreatePropertyFactory.create(dtoEmpty)
      expect(resultEmpty.isLeft()).toBeTruthy()
      expect(resultEmpty.value).toBeInstanceOf(BadRequest)
      expect((resultEmpty.value as BadRequest).message).toBe('At least one photo is required.')

      const dtoUndefined = { ...validCreatePropertyDTO, photos: undefined } as any
      const resultUndefined = CreatePropertyFactory.create(dtoUndefined)
      expect(resultUndefined.isLeft()).toBeTruthy()
      expect(resultUndefined.value).toBeInstanceOf(BadRequest)
      expect((resultUndefined.value as BadRequest).message).toBe('At least one photo is required.')
    })

    it('should return BadRequest if address is missing or null', () => {
      const dtoUndefined = { ...validCreatePropertyDTO, address: undefined } as any
      const resultUndefined = CreatePropertyFactory.create(dtoUndefined)
      expect(resultUndefined.isLeft()).toBeTruthy()
      expect(resultUndefined.value).toBeInstanceOf(BadRequest)
      expect((resultUndefined.value as BadRequest).message).toBe('Address is required.')

      const dtoNull = { ...validCreatePropertyDTO, address: null } as any
      const resultNull = CreatePropertyFactory.create(dtoNull)
      expect(resultNull.isLeft()).toBeTruthy()
      expect(resultNull.value).toBeInstanceOf(BadRequest)
      expect((resultNull.value as BadRequest).message).toBe('Address is required.')
    })

    it('should return BadRequest if price is invalid (not a number, NaN, or negative)', () => {
      const dtoString = { ...validCreatePropertyDTO, price: 'abc' } as any
      const resultString = CreatePropertyFactory.create(dtoString)
      expect(resultString.isLeft()).toBeTruthy()
      expect(resultString.value).toBeInstanceOf(BadRequest)
      expect((resultString.value as BadRequest).message).toBe('Invalid price value.')

      const dtoNaN = { ...validCreatePropertyDTO, price: NaN }
      const resultNaN = CreatePropertyFactory.create(dtoNaN)
      expect(resultNaN.isLeft()).toBeTruthy()
      expect(resultNaN.value).toBeInstanceOf(BadRequest)
      expect((resultNaN.value as BadRequest).message).toBe('Invalid price value.')

      const dtoNegative = { ...validCreatePropertyDTO, price: -100 }
      const resultNegative = CreatePropertyFactory.create(dtoNegative)
      expect(resultNegative.isLeft()).toBeTruthy()
      expect(resultNegative.value).toBeInstanceOf(BadRequest)
      expect((resultNegative.value as BadRequest).message).toBe('Invalid price value.')
    })

    it('should return BadRequest if Address.create fails', () => {
      const addressBadRequest = new BadRequest('Invalid zip code')
      addressCreateSpy.mockReturnValueOnce(left(addressBadRequest))

      const result = CreatePropertyFactory.create(validCreatePropertyDTO)

      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBe(addressBadRequest)
      expect(propertyCreateSpy).not.toHaveBeenCalled()
    })
  })
})
