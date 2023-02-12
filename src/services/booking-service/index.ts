import { cannotBookingError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Booking, Enrollment, Room, Ticket, TicketStatus, TicketType } from "@prisma/client";

async function listBooking(userId: number): Promise<Booking & { Room: Room }> {
  const booking: Booking & { Room: Room } = await bookingRepository.listBooking(userId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
}

async function createBooking(bookingData: BookingParams): Promise<Booking> {
  const enrollment: Enrollment = await getEnrollment(bookingData.userId);
  await canBooking(enrollment.id);
  await roomExistAndHasBed(bookingData.roomId);
  const booking: Booking = await bookingRepository.createBooking(bookingData);
  return booking;
}

async function changeBooking(bookingId: number, bookingData: BookingParams): Promise<Booking> {
  await alreadyHaveReservation(bookingId, bookingData.userId);
  await roomExistAndHasBed(bookingData.roomId);
  const booking: Booking = await bookingRepository.changeBooking(bookingId, bookingData);
  return booking;
}

async function getEnrollment(userId: number): Promise<Enrollment> {
  const enrollment: Enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  return enrollment;
}

async function canBooking(enrollmentId: number): Promise<void> {
  const ticket: Ticket & { TicketType: TicketType } = await ticketRepository.findTicketByEnrollmentId(enrollmentId);
  if (!ticket || 
    ticket.status === TicketStatus.RESERVED ||
    ticket.TicketType.isRemote || 
    !ticket.TicketType.includesHotel) {
    throw cannotBookingError();
  }
}

async function roomExistAndHasBed(roomId: number): Promise<void> {
  const room: Room & { Booking: Booking[] } = await bookingRepository.findRoom(roomId);
  if (!room) {
    throw notFoundError();
  }
  if (room.capacity === room.Booking.length) {
    throw cannotBookingError();
  }
}

async function alreadyHaveReservation(bookingId: number, userId: number): Promise<void> {
  const prevBooking: Booking & { Room: Room } = await listBooking(userId);
  if (!prevBooking || bookingId!==prevBooking.id) {
    throw cannotBookingError();
  }
}

export type BookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt">;

const bookingService = {
  listBooking,
  createBooking,
  changeBooking,
};

export default bookingService;
