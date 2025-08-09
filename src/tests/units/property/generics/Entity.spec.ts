import Entity from '@/core/generics/Entity'
import Identity from '@/core/generics/Identity'

class TestEntity extends Entity<{ name: string }> {
  constructor(props: { name: string }, id?: Identity) {
    super(props, id)
  }

  get propsValue() {
    return this.props
  }
}

describe('Entity', () => {
  const MOCK_ID = new Identity('test-id-123')

  it('should create an entity with a given Identity', () => {
    const entity = new TestEntity({ name: 'Ewerton' }, MOCK_ID)

    expect(entity.identityId).toBe(MOCK_ID)
    expect(entity.identityId.valueId).toBe('test-id-123')
    expect(entity.propsValue).toEqual({ name: 'Ewerton' })
  })

  it('should create an entity with a generated Identity when none is provided', () => {
    const entity = new TestEntity({ name: 'Hecsley' })

    expect(entity.identityId).toBeInstanceOf(Identity)
    expect(entity.identityId.valueId).toBeDefined()
    expect(typeof entity.identityId.valueId).toBe('string')
    expect(entity.propsValue).toEqual({ name: 'Hecsley' })
  })

  it('should store props correctly', () => {
    const props = { name: 'Custom Name' }
    const entity = new TestEntity(props, MOCK_ID)

    expect(entity.propsValue).toEqual(props)
  })
})
