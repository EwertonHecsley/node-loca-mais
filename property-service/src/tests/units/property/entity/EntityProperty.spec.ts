import { Property } from '@/core/domain/entity/Property';
import { Address } from '@/core/domain/objectValue/Address';
import Identity from '@/core/generics/Identity';
import { BadRequest } from '@/shared/errors/custom/BadRequest';

describe('Property Entity', () => {
    let mockAddress: Address;
    let validPropertyProps: {
        description: string;
        photos: string[];
        address: Address;
        price: number;
    };

    beforeAll(() => {
        mockAddress = {
            street: 'Rua Mock',
            number: '100',
            district: 'Bairro Mock',
            city: 'Cidade Mock',
            state: 'MG',
            zipCode: '30000-000',
            format: () => 'Rua Mock, 100 - Bairro Mock, Cidade Mock/MG, 30000-000',
            value: {
                street: 'Rua Mock',
                number: '100',
                district: 'Bairro Mock',
                city: 'Cidade Mock',
                state: 'MG',
                zipCode: '30000-000',
            },
        } as Address;


        validPropertyProps = {
            description: 'Beautiful house with 3 bedrooms',
            photos: ['http://example.com/photo1.jpg'],
            address: mockAddress,
            price: 250000,
        };
    });

    describe('create method', () => {
        it('should create a Property instance with valid props', () => {
            const property = Property.create(validPropertyProps);

            expect(property).toBeInstanceOf(Property);
            expect(property.description).toBe(validPropertyProps.description);
            expect(property.photos).toEqual(validPropertyProps.photos);
            expect(property.address).toBe(validPropertyProps.address);
            expect(property.price).toBe(validPropertyProps.price);
            expect(property.createdAt).toBeInstanceOf(Date);
        });

        it('should create a Property instance with a provided ID', () => {
            const id = new Identity('some-uuid');
            const property = Property.create(validPropertyProps, id);

            expect(property.identityId.valueId).toBe('some-uuid');
        });

        it('should use provided createdAt date', () => {
            const specificDate = new Date('2023-01-15T10:00:00Z');
            const property = Property.create({ ...validPropertyProps, createdAt: specificDate });

            expect(property.createdAt).toEqual(specificDate);
        });

        it('should throw BadRequest if description is empty', () => {
            const props = { ...validPropertyProps, description: '' };
            expect(() => Property.create(props)).toThrow(BadRequest);
            expect(() => Property.create(props)).toThrow('Description is required.');
        });

        it('should throw BadRequest if description is whitespace only', () => {
            const props = { ...validPropertyProps, description: '   ' };
            expect(() => Property.create(props)).toThrow(BadRequest);
            expect(() => Property.create(props)).toThrow('Description is required.');
        });

        it('should throw BadRequest if photos array is empty', () => {
            const props = { ...validPropertyProps, photos: [] };
            expect(() => Property.create(props)).toThrow(BadRequest);
            expect(() => Property.create(props)).toThrow('At least one photo is required.');
        });

        it('should throw BadRequest if photos is null or undefined', () => {
            const propsUndefined = { ...validPropertyProps, photos: undefined } as any;
            expect(() => Property.create(propsUndefined)).toThrow(BadRequest);
            expect(() => Property.create(propsUndefined)).toThrow('At least one photo is required.');

            const propsNull = { ...validPropertyProps, photos: null } as any;
            expect(() => Property.create(propsNull)).toThrow(BadRequest);
            expect(() => Property.create(propsNull)).toThrow('At least one photo is required.');
        });

        it('should throw BadRequest if address is null or undefined', () => {
            const propsUndefined = { ...validPropertyProps, address: undefined } as any;
            expect(() => Property.create(propsUndefined)).toThrow(BadRequest);
            expect(() => Property.create(propsUndefined)).toThrow('Address is required.');

            const propsNull = { ...validPropertyProps, address: null } as any;
            expect(() => Property.create(propsNull)).toThrow(BadRequest);
            expect(() => Property.create(propsNull)).toThrow('Address is required.');
        });

        it('should throw BadRequest if price is not a number', () => {
            const propsString = { ...validPropertyProps, price: 'abc' } as any;
            expect(() => Property.create(propsString)).toThrow(BadRequest);
            expect(() => Property.create(propsString)).toThrow('Invalid price value.');
        });

        it('should throw BadRequest if price is NaN', () => {
            const propsNaN = { ...validPropertyProps, price: NaN };
            expect(() => Property.create(propsNaN)).toThrow(BadRequest);
            expect(() => Property.create(propsNaN)).toThrow('Invalid price value.');
        });

        it('should throw BadRequest if price is negative', () => {
            const propsNegative = { ...validPropertyProps, price: -100 };
            expect(() => Property.create(propsNegative)).toThrow(BadRequest);
            expect(() => Property.create(propsNegative)).toThrow('Invalid price value.');
        });
    });

    describe('getter methods', () => {
        let property: Property;

        beforeEach(() => {
            property = Property.create(validPropertyProps);
        });

        it('should return the correct description', () => {
            expect(property.description).toBe(validPropertyProps.description);
        });

        it('should return the correct photos array', () => {
            expect(property.photos).toEqual(validPropertyProps.photos);
        });

        it('should return the correct address object', () => {
            expect(property.address).toBe(validPropertyProps.address);
        });

        it('should return the correct price', () => {
            expect(property.price).toBe(validPropertyProps.price);
        });

        it('should return the correct createdAt date', () => {
            expect(property.createdAt).toBeInstanceOf(Date);
        });
    });

    describe('update methods', () => {
        let property: Property;

        beforeEach(() => {
            property = Property.create(validPropertyProps);
        });

        it('should update the description with a valid new value', () => {
            const newDescription = 'Updated description for a cozy apartment.';
            property.updateDescription(newDescription);
            expect(property.description).toBe(newDescription);
        });

        it('should throw BadRequest if new description is empty', () => {
            expect(() => property.updateDescription('')).toThrow(BadRequest);
            expect(() => property.updateDescription('')).toThrow('Description is required.');
        });

        it('should throw BadRequest if new description is whitespace only', () => {
            expect(() => property.updateDescription('   ')).toThrow(BadRequest);
            expect(() => property.updateDescription('   ')).toThrow('Description is required.');
        });

        it('should update the photos array with valid new values', () => {
            const newPhotos = ['http://example.com/photo2.jpg', 'http://example.com/photo3.jpg'];
            property.updatePhotos(newPhotos);
            expect(property.photos).toEqual(newPhotos);
        });

        it('should throw BadRequest if new photos array is empty', () => {
            expect(() => property.updatePhotos([])).toThrow(BadRequest);
            expect(() => property.updatePhotos([])).toThrow('At least one photo is required.');
        });

        it('should throw BadRequest if new photos is null or undefined', () => {
            expect(() => property.updatePhotos(undefined as any)).toThrow(BadRequest);
            expect(() => property.updatePhotos(undefined as any)).toThrow('At least one photo is required.');

            expect(() => property.updatePhotos(null as any)).toThrow(BadRequest);
            expect(() => property.updatePhotos(null as any)).toThrow('At least one photo is required.');
        });

        it('should update the price with a valid new value', () => {
            const newPrice = 300000;
            property.updatePrice(newPrice);
            expect(property.price).toBe(newPrice);
        });

        it('should throw BadRequest if new price is not a number', () => {
            expect(() => property.updatePrice('invalid' as any)).toThrow(BadRequest);
            expect(() => property.updatePrice('invalid' as any)).toThrow('Invalid price value.');
        });

        it('should throw BadRequest if new price is NaN', () => {
            expect(() => property.updatePrice(NaN)).toThrow(BadRequest);
            expect(() => property.updatePrice(NaN)).toThrow('Invalid price value.');
        });

        it('should throw BadRequest if new price is negative', () => {
            expect(() => property.updatePrice(-50)).toThrow(BadRequest);
            expect(() => property.updatePrice(-50)).toThrow('Invalid price value.');
        });

        it('should update the address with a new Address object', () => {
            const newMockAddress: Address = {
                street: 'Nova Rua',
                number: '456',
                district: 'Novo Bairro',
                city: 'Nova Cidade',
                state: 'RJ',
                zipCode: '20000-000',
                format: () => 'Nova Rua, 456 - Novo Bairro, Nova Cidade/RJ, 20000-000',
                value: {
                    street: 'Nova Rua',
                    number: '456',
                    district: 'Novo Bairro',
                    city: 'Nova Cidade',
                    state: 'RJ',
                    zipCode: '20000-000',
                },
            } as Address;

            property.updateAddress(newMockAddress);
            expect(property.address).toBe(newMockAddress);
        });
    });
});
