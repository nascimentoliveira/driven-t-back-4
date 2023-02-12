import { prisma } from "@/config";
import { Booking, Room } from "@prisma/client";

async function listBooking(userId: number): Promise<Booking & { Room: Room }> {
  return prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true,
    }
  });
}

async function findRoom(id: number): Promise<Room & { Booking: Booking[] }> {
  return prisma.room.findUnique({
    where: { id },
    include: {
      Booking: true,
    }
  });
}

async function createBooking(bookingData: BookingParams): Promise<Booking> {
  return prisma.booking.create({
    data: bookingData
  });
}

async function changeBooking(bookingId: number, bookingData: BookingParams): Promise<Booking> {
  return prisma.booking.update({
    data: bookingData,
    where: {
      id: bookingId,
    },
  });
}

type BookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt">;

const bookingRepository = {
  listBooking,
  findRoom,
  createBooking,
  changeBooking,
};

export default bookingRepository;
