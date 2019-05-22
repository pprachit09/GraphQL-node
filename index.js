const express = require('express');
const app = express();
const port =  process.env.PORT || 6200;

const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

const mongoose = require('mongoose');
const key = require('./key/keys');

const cors = require('cors');
//allow cross origin requests
app.use(cors());

//connect to mongodb
mongoose.connect(`mongodb+srv://Prachit:${key.mongo.pass}@cluster0-fp8zw.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true })
mongoose.connection.once('open', () => {
    console.log('Connection Done..Now make Fireworks...!!!');
})

//route the traffic to graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen( port, () => {
    console.log('running on http://localhost:6200')
})