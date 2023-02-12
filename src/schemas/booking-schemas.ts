import { BookingParams } from "@/services";
import Joi from "joi";

export const bookingSchema = Joi.object<BookingParams>({
  roomId: Joi.number().greater(0).required(),
});
