import { DeletePropertyUseCase } from '@/core/application/useCase/Delete'
import { PropertyGateway } from '@/core/domain/gateway/PropertyGateway'
import { NotFound } from '@/shared/errors/custom/NotFound'
import { left, right } from '@/shared/utils/Either'

describe('DeletePropertyUseCase', () => {
  let deletePropertyUseCase: DeletePropertyUseCase
  let mockPropertyRepository: jest.Mocked<PropertyGateway>

  const propertyId = '123'

  beforeEach(() => {
    mockPropertyRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PropertyGateway>

    deletePropertyUseCase = new DeletePropertyUseCase(mockPropertyRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should delete property if it exists', async () => {
    const fakeProperty = { id: propertyId, name: 'Test Property' } as any
    mockPropertyRepository.findById.mockResolvedValue(fakeProperty)
    mockPropertyRepository.delete.mockResolvedValue()

    const result = await deletePropertyUseCase.execute({ id: propertyId })

    expect(result).toEqual(right(true))
    expect(mockPropertyRepository.findById).toHaveBeenCalledTimes(1)
    expect(mockPropertyRepository.findById).toHaveBeenCalledWith(propertyId)
    expect(mockPropertyRepository.delete).toHaveBeenCalledTimes(1)
    expect(mockPropertyRepository.delete).toHaveBeenCalledWith(propertyId)
  })

  it('should return NotFound if property does not exist', async () => {
    mockPropertyRepository.findById.mockResolvedValue(null)

    const result = await deletePropertyUseCase.execute({ id: propertyId })

    expect(result).toEqual(left(new NotFound(`Property ${propertyId} not found`)))
    expect(mockPropertyRepository.findById).toHaveBeenCalledWith(propertyId)
    expect(mockPropertyRepository.delete).not.toHaveBeenCalled()
  })

  it('should propagate error if findById throws an error', async () => {
    const dbError = new Error('Database failure')
    mockPropertyRepository.findById.mockRejectedValue(dbError)

    await expect(deletePropertyUseCase.execute({ id: propertyId })).rejects.toThrow(dbError)

    expect(mockPropertyRepository.delete).not.toHaveBeenCalled()
  })

  it('should propagate error if delete throws an error', async () => {
    const fakeProperty = { id: propertyId, name: 'Test Property' } as any
    mockPropertyRepository.findById.mockResolvedValue(fakeProperty)
    const deleteError = new Error('Delete failed')
    mockPropertyRepository.delete.mockRejectedValue(deleteError)

    await expect(deletePropertyUseCase.execute({ id: propertyId })).rejects.toThrow(deleteError)

    expect(mockPropertyRepository.delete).toHaveBeenCalledWith(propertyId)
  })
})
