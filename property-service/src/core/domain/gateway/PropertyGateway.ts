import { Property } from '../entity/Property'

export type FindAllParams = {
  page: number
  limit: number
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
}

export abstract class PropertyGateway {
  abstract create(entity: Property): Promise<Property>
  abstract listAll(params: FindAllParams): Promise<PaginatedResponse<Property>>
}
