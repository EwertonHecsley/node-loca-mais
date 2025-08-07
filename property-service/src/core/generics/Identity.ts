import { randomUUID } from 'crypto'

export default class Identity {
  private readonly _id: string

  constructor(value?: string) {
    this._id = value ?? randomUUID()
  }

  get valueId(): string {
    return this._id
  }
}
