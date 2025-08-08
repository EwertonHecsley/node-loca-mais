import { ListAllPropertyUseCase } from '@/core/application/useCase/List'
import { Property } from '@/core/domain/entity/Property'
import { PaginatedResponse, PropertyGateway } from '@/core/domain/gateway/PropertyGateway'
import { Address } from '@/core/domain/objectValue/Address'

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
  it('should return a list of properties', async () => {
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
    expect((result.value as PaginatedResponse<Property>).data.length).toBe(1)
    expect((result.value as PaginatedResponse<Property>).data[0].description).toBe(
      'A nice property',
    )
  })
})
