import assert from 'assert';

import { buildSchema, JsonSchema } from '../main';

interface Person {
    name: string;
    age?: number;
    gender: string | null;
}

const Person: JsonSchema<Person> = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        age: { type: 'number', optional: true },
        gender: { type: 'string', nullable: true },
    }
};

interface Book {
    id: string;
    title: string;
    year: number;
    tags: string[];
    author: Person;
}

const Book: JsonSchema<Book> = {
    type: 'object',
    properties: {
        id: { type: 'string', minLength: 1 },
        title: { type: 'string', minLength: 1 },
        year: { type: 'integer', minimum: 0, maximum: 3000 },
        tags: {
            type: 'array',
            items: { type: 'string', minLength: 1 },
        },
        author: Person,
    }
};

describe('JsonSchema', () => {

    describe('buildSchema', () => {

        it('returns processed schema', () => {
            const schema = buildSchema(Book);
            assert.deepStrictEqual(schema, {
                type: 'object',
                required: ['id', 'title', 'year', 'tags', 'author'],
                properties: {
                    id: { type: 'string', minLength: 1 },
                    title: { type: 'string', minLength: 1 },
                    year: { type: 'integer', minimum: 0, maximum: 3000 },
                    tags: {
                        type: 'array',
                        items: { type: 'string', minLength: 1 },
                    },
                    author: {
                        type: 'object',
                        required: ['name', 'gender'],
                        properties: {
                            name: { type: 'string' },
                            age: { type: 'number', optional: true },
                            gender: { type: 'string', nullable: true },
                        },
                        additionalProperties: false,
                    }
                },
                additionalProperties: false,
            });
        });

    });

});
