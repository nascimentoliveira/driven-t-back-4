import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import bookingService from "@/services/booking-service";
import httpStatus from "http-status";
import { Booking, Room } from "@prisma/client";
import { BookingParams } from "@/services/booking-service";

export async function listBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking: Booking & { Room: Room } = await bookingService.listBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as Record<string, string>;
  const bookingData: BookingParams = {
    userId: userId,
    roomId: Number(roomId),
  };
  try {
    const booking: Booking = await bookingService.createBooking(bookingData);
    return res.status(httpStatus.OK).send({ id: booking.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as Record<string, string>;
  const { bookingId } = req.params as Record<string, string>;
  const bookingData: BookingParams = {
    userId: userId,
    roomId: Number(roomId),
  };
  try {
    const booking: Booking = await bookingService.changeBooking(Number(bookingId), bookingData);
    return res.status(httpStatus.OK).send({ id: booking.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
