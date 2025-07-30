import { Property } from '../entity/Property'

export abstract class PropertyGateway {
  abstract create(entity: Property): Promise<Property>
}
