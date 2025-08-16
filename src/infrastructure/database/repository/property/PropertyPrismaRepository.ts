import { FindAllParams, PaginatedResponse, PropertyGateway } from "@/core/domain/gateway/PropertyGateway";
import { getPrismaInstance } from "../../prisma/singletonPrisma";
import { Property } from "@/core/domain/entity/Property";
import { PropertyPrismaMapper } from "../../prisma/mappers/PropertyPrismaMapper";

export class PropertyPrismaRepository implements PropertyGateway {
    private prisma = getPrismaInstance();

    async create(entity: Property): Promise<Property> {
        const data = PropertyPrismaMapper.toDatabase(entity);
        const property = await this.prisma.property.create({ data });
        return PropertyPrismaMapper.toDomain(property);
    }

    async findById(id: string): Promise<Property | null> {
        const property = await this.prisma.property.findUnique({ where: { id } });
        return property ? PropertyPrismaMapper.toDomain(property) : null;
    }

    async listAll(params: FindAllParams): Promise<PaginatedResponse<Property>> {
        const { page, limit } = params;
        const total = await this.prisma.property.count();
        const properties = await this.prisma.property.findMany({
            skip: (page - 1) * limit,
            take: limit,
        });
        const data = properties.map(PropertyPrismaMapper.toDomain);
        return {
            data,
            total,
            page,
            limit,
        };
    }

    async delete(id: string): Promise<void> {
        await this.prisma.property.delete({ where: { id } });
    }
}