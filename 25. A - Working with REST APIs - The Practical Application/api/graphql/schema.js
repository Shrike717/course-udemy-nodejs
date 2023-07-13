// Allows to build schema which than gets parsed
const { buildSchema } = require("graphql");

// Funcion that returns the schema object this will generate
module.exports = buildSchema(`
    type TestData {
        text: String!
        views: Int!
    }

    type RootQuery {
        hello: TestData!
    }

    schema {
        query: RootQuery
    }
`);
