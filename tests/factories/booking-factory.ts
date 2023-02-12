import { prisma } from "@/config";
import { Booking } from "@prisma/client";

export async function createBooking(params: Partial<Booking> = {}): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId: params.userId,
      roomId: params.roomId,
    },
  });
}
