import Identity from '@/core/generics/Identity'
import * as crypto from 'crypto'

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(),
}))

describe('Identity', () => {
  const MOCK_UUID = 'mock-uuid-123-abc-456'

  beforeEach(() => {
    ;(crypto.randomUUID as jest.Mock).mockReturnValue(MOCK_UUID)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create an Identity instance with a provided value', () => {
      const customId = 'my-custom-id'
      const identity = new Identity(customId)

      expect(identity.valueId).toBe(customId)
      expect(crypto.randomUUID).not.toHaveBeenCalled()
    })

    it('should create an Identity instance with a generated UUID if no value is provided', () => {
      const identity = new Identity()

      expect(identity.valueId).toBe(MOCK_UUID)
      expect(crypto.randomUUID).toHaveBeenCalledTimes(1)
    })
  })

  describe('valueId getter', () => {
    it('should return the correct ID value', () => {
      const customId = 'another-custom-id'
      const identity = new Identity(customId)

      expect(identity.valueId).toBe(customId)
    })

    it('should return the generated ID value when no value is provided', () => {
      const identity = new Identity()

      expect(identity.valueId).toBe(MOCK_UUID)
    })
  })
})
