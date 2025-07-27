import Identity from './Identity'

export default class Entity<T> {
  private valueIdentity: Identity
  protected props: T

  protected constructor(props: T, id?: Identity) {
    this.props = props
    this.valueIdentity = id ?? new Identity()
  }

  get identityId(): Identity {
    return this.valueIdentity
  }
}
