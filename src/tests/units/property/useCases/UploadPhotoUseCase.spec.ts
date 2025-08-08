import { UploadPhotoUseCase } from '@/core/application/useCase/UploadPhotos'
import { UploadFileGateway } from '@/core/domain/gateway/UploadFileGateway'
import { Readable } from 'stream'

describe('UploadPhotoUseCase', () => {
  let uploadPhotoUseCase: UploadPhotoUseCase
  let mockUploadFileGateway: jest.Mocked<UploadFileGateway>

  const mockReadableStream = new Readable()
  mockReadableStream._read = () => {}

  const mockPhotoInput1 = {
    stream: mockReadableStream,
    originalName: 'my-image-1.jpg',
  }

  const mockPhotoInput2 = {
    stream: mockReadableStream,
    originalName: 'another-photo.png',
  }

  const validPhotoInputs = [mockPhotoInput1, mockPhotoInput2]

  beforeEach(() => {
    mockUploadFileGateway = {
      uploadFile: jest.fn(),
    }

    uploadPhotoUseCase = new UploadPhotoUseCase(mockUploadFileGateway)

    jest.spyOn(Date, 'now').mockReturnValue(1678886400000)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('execute method', () => {
    it('should upload multiple photos and return their URLs', async () => {
      mockUploadFileGateway.uploadFile
        .mockResolvedValueOnce('http://cdn.com/photos/1678886400000-my-image-1.jpg')
        .mockResolvedValueOnce('http://cdn.com/photos/1678886400000-another-photo.png')

      const result = await uploadPhotoUseCase.execute(validPhotoInputs)

      expect(result).toEqual([
        'http://cdn.com/photos/1678886400000-my-image-1.jpg',
        'http://cdn.com/photos/1678886400000-another-photo.png',
      ])
      expect(mockUploadFileGateway.uploadFile).toHaveBeenCalledTimes(2)
      expect(mockUploadFileGateway.uploadFile).toHaveBeenCalledWith(
        mockPhotoInput1.stream,
        mockPhotoInput1.originalName,
        `photos/${Date.now()}-${mockPhotoInput1.originalName}`,
      )
      expect(mockUploadFileGateway.uploadFile).toHaveBeenCalledWith(
        mockPhotoInput2.stream,
        mockPhotoInput2.originalName,
        `photos/${Date.now()}-${mockPhotoInput2.originalName}`,
      )
    })

    it('should upload a single photo and return its URL', async () => {
      mockUploadFileGateway.uploadFile.mockResolvedValueOnce(
        'http://cdn.com/photos/1678886400000-single-photo.jpg',
      )

      const singlePhotoInput = [{ stream: mockReadableStream, originalName: 'single-photo.jpg' }]
      const result = await uploadPhotoUseCase.execute(singlePhotoInput)

      expect(result).toEqual(['http://cdn.com/photos/1678886400000-single-photo.jpg'])
      expect(mockUploadFileGateway.uploadFile).toHaveBeenCalledTimes(1)
      expect(mockUploadFileGateway.uploadFile).toHaveBeenCalledWith(
        singlePhotoInput[0].stream,
        singlePhotoInput[0].originalName,
        `photos/${Date.now()}-${singlePhotoInput[0].originalName}`,
      )
    })

    it('should return an empty array if no photos are provided', async () => {
      const result = await uploadPhotoUseCase.execute([])

      expect(result).toEqual([])
      expect(mockUploadFileGateway.uploadFile).not.toHaveBeenCalled()
    })

    it('should propagate error if uploadFileGateway.uploadFile fails for any photo', async () => {
      const uploadError = new Error('Failed to upload file to storage')

      mockUploadFileGateway.uploadFile
        .mockResolvedValueOnce('http://cdn.com/photos/1678886400000-my-image-1.jpg')
        .mockRejectedValueOnce(uploadError)

      await expect(uploadPhotoUseCase.execute(validPhotoInputs)).rejects.toThrow(uploadError)

      expect(mockUploadFileGateway.uploadFile).toHaveBeenCalledTimes(2)
    })

    it('should propagate error if uploadFileGateway.uploadFile fails on the first photo', async () => {
      const uploadError = new Error('Initial upload failed')
      mockUploadFileGateway.uploadFile.mockRejectedValueOnce(uploadError)

      await expect(uploadPhotoUseCase.execute(validPhotoInputs)).rejects.toThrow(uploadError)

      expect(mockUploadFileGateway.uploadFile).toHaveBeenCalledTimes(1)
      expect(mockUploadFileGateway.uploadFile).toHaveBeenCalledWith(
        mockPhotoInput1.stream,
        mockPhotoInput1.originalName,
        `photos/${Date.now()}-${mockPhotoInput1.originalName}`,
      )
    })
  })
})
