import { gql } from 'apollo-server-express';

export const shipmentSchema = gql(`
  type Shipment {
    id: ID!
    senderName: String!
    senderAddress: String!
    recipientName: String!
    recipientAddress: String!
    packageDescription: String!
    packageWeight: Float!
    packageDimensions: String!
    shipmentDate: String!
    expectedDeliveryDate: String!
    shipmentStatus: String!
    trackingNumber: String!
    shippingMethod: String!
    insuranceValue: Float!
    specialInstructions: String
    shipmentCost: Float!
    paymentMethod: String!
    statusHistory: [StatusHistory!]!
  }

  type StatusHistory {
    id: ID!
    status: String!
    updatedAt: String!
  }

  input ShipmentInput {
    recipientName: String!
    recipientAddress: String!
    packageDescription: String!
    packageWeight: Float!
    packageDimensions: String!
    expectedDeliveryDate: String!
    shipmentStatus: String!
    trackingNumber: String!
    shippingMethod: String!
    insuranceValue: Float!
    specialInstructions: String
    shipmentCost: Float!
    paymentMethod: String!
  }

  input StatusUpdateInput {
    shipmentId: ID!
    status: String!
  }

  type Query {
    getShipment(trackingNumber: String!): Shipment!
    getShipmentStatusHistory(shipmentId: ID!): [StatusHistory!]!
  }

  type Mutation {
    createShipment(shipmentInput: ShipmentInput!): Shipment
    updateShipmentStatus(statusUpdateInput: StatusUpdateInput!): Shipment
  }
`);
