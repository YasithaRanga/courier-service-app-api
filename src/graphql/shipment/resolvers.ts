import { PrismaClient } from '@prisma/client';
import { userResolvers } from '../user/resolvers';

const prisma = new PrismaClient();

export const shipmentResolvers = {
  Query: {
    getShipment: async (_: any, args: { trackingNumber: string }) => {
      const shipment = await prisma.shipment.findUnique({
        where: { trackingNumber: args.trackingNumber },
        include: { statusHistory: true },
      });
      if (!shipment) throw new Error('Tracking Number is invalid');
      return shipment;
    },
    getShipments: async () => {
      const shipments = await prisma.shipment.findMany({
        include: { statusHistory: true, sender: true },
      });
      if (!shipments) throw new Error('No Shipments found');
      return shipments;
    },
    getShipmentsByUser: async (_: any, args: { userId: number }) => {
      const shipments = await prisma.shipment.findMany({
        where: { senderId: args.userId },
        include: { statusHistory: true },
      });
      if (!shipments) throw new Error('No Shipments found for this user');
      return shipments;
    },
    getShipmentStatusHistory: async (_: any, args: { shipmentId: number }) => {
      const shipmentHistory = await prisma.statusHistory.findMany({
        where: { shipmentId: args.shipmentId },
      });
      if (!shipmentHistory) throw new Error('Shipment Id is invalid');
      return shipmentHistory;
    },
  },
  Mutation: {
    createShipment: async (
      _: any,
      args: { shipmentInput: any },
      context: any
    ) => {
      const { name: senderName, address: senderAddress } =
        await userResolvers.Query.getUser(_, {
          email: context.user.email,
        });
      const {
        recipientName,
        recipientAddress,
        packageDescription,
        packageWeight,
        packageDimensions,
        expectedDeliveryDate,
        shipmentStatus,
        trackingNumber,
        shippingMethod,
        insuranceValue,
        specialInstructions,
        shipmentCost,
        paymentMethod,
      } = args.shipmentInput;
      return await prisma.shipment.create({
        data: {
          senderId: context.user.userId,
          senderName,
          senderAddress,
          recipientName,
          recipientAddress,
          packageDescription,
          packageWeight,
          packageDimensions,
          expectedDeliveryDate: new Date(expectedDeliveryDate),
          shipmentStatus,
          trackingNumber,
          shippingMethod,
          insuranceValue,
          specialInstructions,
          shipmentCost,
          paymentMethod,
        },
        include: { statusHistory: true },
      });
    },
    updateShipmentStatus: async (_: any, args: { statusUpdateInput: any }) => {
      const { shipmentId, status } = args.statusUpdateInput;
      return await prisma.shipment.update({
        where: { id: parseInt(shipmentId) },
        data: {
          shipmentStatus: status,
          statusHistory: {
            create: {
              status,
            },
          },
        },
        include: { statusHistory: true },
      });
    },
    deleteShipment: async (_: any, args: { id: number }) => {
      await prisma.statusHistory.deleteMany({
        where: { shipmentId: args.id },
      });
      return await prisma.shipment.delete({
        where: { id: args.id },
        include: { statusHistory: true },
      });
    },
  },
};
