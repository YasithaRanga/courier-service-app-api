import { PrismaClient } from '@prisma/client';
import { userResolvers } from '../user/resolvers';

const prisma = new PrismaClient();

export const shipmentResolvers = {
  Query: {
    getShipment: async (_: any, args: { trackingNumber: string }) => {
      return await prisma.shipment.findUnique({
        where: { trackingNumber: args.trackingNumber },
        include: { statusHistory: true },
      });
    },
    getShipmentStatusHistory: async (_: any, args: { shipmentId: number }) => {
      return await prisma.statusHistory.findMany({
        where: { shipmentId: args.shipmentId },
      });
    },
  },
  Mutation: {
    createShipment: async (
      _: any,
      args: { shipmentInput: any },
      context: any
    ) => {
      if (!context.user) throw new Error('Not authenticated');
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
    updateShipmentStatus: async (
      _: any,
      args: { statusUpdateInput: any },
      context: any
    ) => {
      if (!context.user) throw new Error('Not authenticated');
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
  },
};
