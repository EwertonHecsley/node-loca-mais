import { ListAllPropertyUseCase } from '@/core/application/useCase/List'
import { Property } from '@/core/domain/entity/Property'
import { PaginatedResponse, PropertyGateway } from '@/core/domain/gateway/PropertyGateway'
import { Address } from '@/core/domain/objectValue/Address'
import { InternalServerErrorException } from '@/shared/errors/custom/InternalServerErrorException'

const mockyAddress = Address.create({
  city: 'Mocky City',
  district: 'Mocky District',
  state: 'MC',
  street: '123 Mocky St',
  number: '456',
  zipCode: '12345-678',
})

const mockyAddressValid = mockyAddress.isRight() ? mockyAddress.value : null

const mockyProperty = Property.create({
  address: mockyAddressValid!,
  description: 'A nice property',
  price: 100000,
  photos: ['photo1.jpg', 'photo2.jpg'],
})

describe('ListAllPropertyUseCase', () => {
  it('should return a list of properties when repository succeeds', async () => {
    const fakeRepo: PropertyGateway = {
      listAll: async () => ({
        data: [mockyProperty],
        page: 1,
        total: 1,
      }),
    } as unknown as PropertyGateway

    const useCase = new ListAllPropertyUseCase(fakeRepo)
    const result = await useCase.execute(1, 10)

    expect(result.isRight()).toBe(true)
    const value = result.value as PaginatedResponse<Property>
    expect(value.data).toHaveLength(1)
    expect(value.data[0].description).toBe('A nice property')
    expect(value.page).toBe(1)
    expect(value.total).toBe(1)
  })

  it('should return InternalServerErrorException when repository throws an error', async () => {
    const fakeRepo: PropertyGateway = {
      listAll: async () => {
        throw new Error('Database connection failed')
      },
    } as unknown as PropertyGateway

    const useCase = new ListAllPropertyUseCase(fakeRepo)
    const result = await useCase.execute(1, 10)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InternalServerErrorException)
    expect((result.value as InternalServerErrorException).message).toContain(
      'Failed to list properties: Error: Database connection failed'
    )
  })
})
