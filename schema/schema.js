const graphql = require('graphql');
const _ = require('lodash');
const nation = require('../models/nations');
const player = require('../models/players');

const { GraphQLObjectType, 
        GraphQLString, 
        GraphQLSchema,
        GraphQLID,
        GraphQLInt,
        GraphQLList,
        GraphQLNonNull
} = graphql;

//graphql schema for team
const PlayerType = new GraphQLObjectType({
    name: 'Player',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        position: { type: GraphQLString },
        jersynumber: {type: GraphQLInt},
        nation: {
            type: NationType,
            resolve(parent, args){
            //while querying parent will have the whole Player object
            //From the Player object get the nationId and check in nations collction
                //return _.find(nations, { id: parent.nationId })
                return nation.findById( parent.nationId );
            }
        }
    })
});

//graphql schema for nation
const NationType = new GraphQLObjectType({
    name: 'Nation',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        players: { 
            type: new GraphQLList(PlayerType),
            resolve(parent, args){
                //parent property will have nation object
                //from the nation object get the id and check for the similar nationId in players collection
                //return _.filter(players, { nationId: parent.id });
                return player.find({ nationId: parent.id });
            } 
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        player: {
            type: PlayerType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                //to get the data from database
                //return _.find(players, { id: args.id });
                return player.findById( args.id );
            }
        },
        nation: {
            type: NationType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                //to get the data from database
                //return _.find(nations, { id: args.id })
                return nation.findById( args.id );
            }
        },
        //to get all the players
        players: {
            type: new GraphQLList(PlayerType),
            resolve(parent, args){
                //return all the players
                //return players
                return player.find();
            }
        },
        //to get all nations details
        nations: {
            type: new GraphQLList(NationType),
            resolve(parent, args){
                //return all the nations
                //return nations
                return nation.find();
            }
        }
    }
});

//create mutations to add entries from front end
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addNation:{
            type: NationType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let newNation = new nation({
                    name: args.name
                });

                //Return the new entry to graphiql
                return newNation.save()
            }
        },
        addPlayer:{
            type: PlayerType,
            args:{
                name: { type: new GraphQLNonNull(GraphQLString) },
                position: { type: new GraphQLNonNull(GraphQLString) },
                jersynumber: { type: new GraphQLNonNull(GraphQLInt) },
                nationId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let newPlayer = new player({
                    name: args.name,
                    position: args.position,
                    jersynumber: args.jersynumber,
                    nationId: args.nationId
                });

                return newPlayer.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
