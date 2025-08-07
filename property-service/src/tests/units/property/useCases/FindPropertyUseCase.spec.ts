import { FindPropertyUseCase } from '@/core/application/useCase/Find'
import { Property } from '@/core/domain/entity/Property'
import { PropertyGateway } from '@/core/domain/gateway/PropertyGateway'
import { Address } from '@/core/domain/objectValue/Address'
import { NotFound } from '@/shared/errors/custom/NotFound'

describe('FindPropertyUseCase', () => {
  let findPropertyUseCase: FindPropertyUseCase
  let mockPropertyRepository: jest.Mocked<PropertyGateway>
  let mockAddressInstance: Address
  let mockPropertyInstance: Property

  let propertyRepositoryFindByIdSpy: jest.SpyInstance

  const propertyId = 'some-property-id'

  beforeAll(() => {
    mockAddressInstance = {
      street: 'Rua Mock',
      number: '100',
      district: 'Bairro Mock',
      city: 'Cidade Mock',
      state: 'MG',
      zipCode: '30000-000',
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
      id: { value: propertyId },
      updateDescription: jest.fn(),
      updatePhotos: jest.fn(),
      updatePrice: jest.fn(),
      updateAddress: jest.fn(),
    } as unknown as Property
  })

  beforeEach(() => {
    mockPropertyRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      listAll: jest.fn(),
    }

    findPropertyUseCase = new FindPropertyUseCase(mockPropertyRepository)

    propertyRepositoryFindByIdSpy = jest.spyOn(mockPropertyRepository, 'findById')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('execute method', () => {
    it('should return a property when found by ID', async () => {
      propertyRepositoryFindByIdSpy.mockResolvedValueOnce(mockPropertyInstance)

      const result = await findPropertyUseCase.execute({ id: propertyId })

      expect(result.isRight()).toBeTruthy()
      expect(result.value).toBe(mockPropertyInstance)
      expect(propertyRepositoryFindByIdSpy).toHaveBeenCalledTimes(1)
      expect(propertyRepositoryFindByIdSpy).toHaveBeenCalledWith(propertyId)
    })

    it('should return NotFound error if property is not found', async () => {
      propertyRepositoryFindByIdSpy.mockResolvedValueOnce(null)

      const result = await findPropertyUseCase.execute({ id: propertyId })

      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(NotFound)
      expect((result.value as NotFound).message).toBe('Property not found')
      expect(propertyRepositoryFindByIdSpy).toHaveBeenCalledTimes(1)
      expect(propertyRepositoryFindByIdSpy).toHaveBeenCalledWith(propertyId)
    })

    it('should return NotFound error if propertyRepository.findById returns undefined', async () => {
      propertyRepositoryFindByIdSpy.mockResolvedValueOnce(undefined)

      const result = await findPropertyUseCase.execute({ id: propertyId })

      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(NotFound)
      expect((result.value as NotFound).message).toBe('Property not found')
      expect(propertyRepositoryFindByIdSpy).toHaveBeenCalledTimes(1)
      expect(propertyRepositoryFindByIdSpy).toHaveBeenCalledWith(propertyId)
    })
  })
})
