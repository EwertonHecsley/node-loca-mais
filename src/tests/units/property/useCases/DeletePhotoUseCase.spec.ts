import { DeletePhoto } from '@/core/application/useCase/DeletePhoto'
import { DeleteFileGateway } from '@/core/domain/gateway/DeleteFileGateway'
import { GetFileGateway } from '@/core/domain/gateway/GetFileGateway'
import { NotFound } from '@/shared/errors/custom/NotFound'
import { InternalServerErrorException } from '@/shared/errors/custom/InternalServerErrorException'

describe('DeletePhoto', () => {
  let deletePhoto: DeletePhoto
  let mockDeleteFileGateway: jest.Mocked<DeleteFileGateway>
  let mockGetFileGateway: jest.Mocked<GetFileGateway>

  const filePath = 'photos/user123/avatar.png'

  beforeEach(() => {
    mockDeleteFileGateway = {
      deleteFile: jest.fn(),
    }

    mockGetFileGateway = {
      getFile: jest.fn(),
    }

    deletePhoto = new DeletePhoto(mockDeleteFileGateway, mockGetFileGateway)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should delete file if it exists', async () => {
    mockGetFileGateway.getFile.mockResolvedValue(true)
    mockDeleteFileGateway.deleteFile.mockResolvedValue()

    await deletePhoto.execute(filePath)

    expect(mockGetFileGateway.getFile).toHaveBeenCalledTimes(1)
    expect(mockGetFileGateway.getFile).toHaveBeenCalledWith(filePath)
    expect(mockDeleteFileGateway.deleteFile).toHaveBeenCalledTimes(1)
    expect(mockDeleteFileGateway.deleteFile).toHaveBeenCalledWith(filePath)
  })

  it('should throw InternalServerErrorException if getFile throws an error', async () => {
    mockGetFileGateway.getFile.mockRejectedValue(new Error('Storage unavailable'))

    await expect(deletePhoto.execute(filePath)).rejects.toThrow(InternalServerErrorException)

    expect(mockDeleteFileGateway.deleteFile).not.toHaveBeenCalled()
  })

  it('should throw InternalServerErrorException if deleteFile throws an error', async () => {
    mockGetFileGateway.getFile.mockResolvedValue(true)
    mockDeleteFileGateway.deleteFile.mockRejectedValue(new Error('Delete failed'))

    await expect(deletePhoto.execute(filePath)).rejects.toThrow(InternalServerErrorException)

    expect(mockDeleteFileGateway.deleteFile).toHaveBeenCalledWith(filePath)
  })
})
