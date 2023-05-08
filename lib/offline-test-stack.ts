import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';



const fn = (code: Function) => code.toString()

import {
  GraphQlApiConstruct,
  RestApiConstruct,
  DynamoCostruct,
} from 'dt-cdk-lib'

export class OfflineTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // @ts-ignore
    const gql = new GraphQlApiConstruct(this, 'gqlApi')

    // @ts-ignore
    const eventsTable = new DynamoCostruct(this, 'eventsTable')
    eventsTable.addKeys('id', 'eventName')


    gql
      .authorization(fn(async function (event) {
        // Warning! The total size of this JSON object must not exceed 5MB.
        console.log(JSON.stringify(event, undefined, 2))
        if (event.authorizationToken === 'error') {
          const error = new Error('here is some custom error message')
          error.name = 'my custom error'
          throw error
        }

        const res = {
          isAuthorized: event.authorizationToken === 'accept',
        }

        console.log(res)
        return res
      }))
      .schema(`
      input CustomEventInput {
        id: String!
        name: String!
        detail: String!
        headers: String
        timestamp: Int!
      }
      
      type Query {
        customEvent(id: String!): CustomEvent
        allCustomEvents: [CustomEvent]
      }
      
      type Mutation {
        createCustomEvent(input: CustomEventInput!): CustomEvent
        updateCustomEvent(id: String!, input: CustomEventInput!): CustomEvent
        deleteCustomEvent(id: String!): CustomEvent
      }

      type Subscription {
        onCreateCustomEvent(eventFilter: CustomEventInput): CustomEvent
        @aws_subscribe(mutations:["createCustomEvent"])
      }
      
      type CustomEvent {
        id: String!
        name: String!
        detail: String!
        headers: String
        timestamp: Int!
      }
    `)

    gql.query('allCustomEvents', fn(async function (event) {
      console.log('on allCustomEvents query')
      console.log(JSON.stringify(event, undefined, 2))
      const sampleData = [
        {
          id: 'String!',
          name: 'String!',
          detail: 'String!',
          headers: 'String',
          timestamp: 344,
        }
      ]
      console.log(sampleData)
      return sampleData
    }))
    // .query('customEvent')
    // .table()
    // .get()
    // .list()
    // .delete()
    // .put()

    gql.mutation('createCustomEvent', fn(async function (event) {
      console.log(JSON.stringify(event, undefined, 2))
      return {
        id: 'String!',
        name: 'String!',
        detail: 'String!',
        headers: 'String',
        timestamp: 344,
      }
    }))

  }
}

