import { CreatePropertyUseCase } from '@/core/application/useCase/Create'
import { CreatePropertyFactory } from '@/core/application/useCase/factory/CreatePropertyFactory'
import { Property } from '@/core/domain/entity/Property'
import { PropertyGateway } from '@/core/domain/gateway/PropertyGateway'
import { Address } from '@/core/domain/objectValue/Address'
import { BadRequest } from '@/shared/errors/custom/BadRequest'
import { left, right } from '@/shared/utils/Either'

describe('CreatePropertyUseCase', () => {
  let createPropertyUseCase: CreatePropertyUseCase
  let mockPropertyRepository: jest.Mocked<PropertyGateway>
  let mockAddressInstance: Address
  let mockPropertyInstance: Property

  let createPropertyFactorySpy: jest.SpyInstance
  let propertyRepositoryCreateSpy: jest.SpyInstance

  const validRequestProperty = {
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
    mockPropertyRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      listAll: jest.fn(),
      delete: jest.fn(),
    }

    createPropertyUseCase = new CreatePropertyUseCase(mockPropertyRepository)

    createPropertyFactorySpy = jest.spyOn(CreatePropertyFactory, 'create')
    propertyRepositoryCreateSpy = jest.spyOn(mockPropertyRepository, 'create')

    createPropertyFactorySpy.mockReturnValue(right(mockPropertyInstance))
    propertyRepositoryCreateSpy.mockResolvedValue(mockPropertyInstance)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('execute method', () => {
    it('should create a property successfully when all inputs are valid', async () => {
      const result = await createPropertyUseCase.execute(validRequestProperty)

      expect(result.isRight()).toBeTruthy()
      expect(result.value).toBe(mockPropertyInstance)
      expect(createPropertyFactorySpy).toHaveBeenCalledTimes(1)
      expect(createPropertyFactorySpy).toHaveBeenCalledWith(validRequestProperty)
      expect(propertyRepositoryCreateSpy).toHaveBeenCalledTimes(1)
      expect(propertyRepositoryCreateSpy).toHaveBeenCalledWith(mockPropertyInstance)
    })

    it('should return BadRequest if CreatePropertyFactory fails', async () => {
      const factoryError = new BadRequest('Invalid DTO from factory')
      createPropertyFactorySpy.mockReturnValueOnce(left(factoryError))

      const result = await createPropertyUseCase.execute(validRequestProperty)

      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequest)
      expect((result.value as BadRequest).message).toBe('Invalid DTO from factory')
      expect(propertyRepositoryCreateSpy).not.toHaveBeenCalled()
    })

    it('should handle repository creation failure (e.g., database error)', async () => {
      const repositoryError = new Error('Database connection failed')

      propertyRepositoryCreateSpy.mockRejectedValueOnce(repositoryError)
      await expect(createPropertyUseCase.execute(validRequestProperty)).rejects.toThrow(
        repositoryError,
      )

      expect(createPropertyFactorySpy).toHaveBeenCalledTimes(1)
      expect(propertyRepositoryCreateSpy).toHaveBeenCalledTimes(1)
    })
  })
})
