import { bookingParams } from "@/services";
import Joi from "joi";

export const bookingSchema = Joi.object<bookingParams>({
  roomId: Joi.number().greater(0).required(),
});
