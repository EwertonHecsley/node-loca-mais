import { UploadFileCloud } from '@/infrastructure/services/bucket/UploadFileCloud'
import { BadRequest } from '@/shared/errors/custom/BadRequest'
import { Readable, Writable } from 'stream'

jest.mock('@google-cloud/storage', () => {
  const { Writable } = require('stream')

  return {
    Storage: jest.fn(() => ({
      bucket: jest.fn(() => ({
        file: jest.fn(() => ({
          createWriteStream: jest.fn(() => {
            const writable = new Writable({
              write(
                chunk: Buffer | string,
                encoding: BufferEncoding,
                callback: (error?: Error | null) => void,
              ) {
                callback()
              },
            })
            process.nextTick(() => writable.emit('finish'))
            return writable
          }),
          makePublic: jest.fn().mockResolvedValue(undefined),
        })),
      })),
    })),
  }
})

describe('UploadFileCloud', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV, GOOGLE_CLOUD_STORAGE_BUCKET: 'test-bucket' }
  })

  afterEach(() => {
    process.env = OLD_ENV
    jest.clearAllMocks()
  })

  it('should throw BadRequest if bucket env variable is missing', () => {
    process.env.GOOGLE_CLOUD_STORAGE_BUCKET = ''
    expect(() => new UploadFileCloud()).toThrow(BadRequest)
  })

  it('should upload a file and return its public URL', async () => {
    const uploader = new UploadFileCloud()
    const fakeStream = new Readable({
      read() {
        this.push(null)
      },
    })

    const result = await uploader.uploadFile(fakeStream, 'file.txt', 'path/to/file.txt')
    expect(result).toBe('https://storage.googleapis.com/test-bucket/path/to/file.txt')
  })
})
