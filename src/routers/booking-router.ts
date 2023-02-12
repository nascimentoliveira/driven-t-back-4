import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { changeBooking, createBooking, listBooking } from "@/controllers";
import { bookingSchema } from "@/schemas";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", listBooking)
  .post("/", validateBody(bookingSchema), createBooking)
  .put("/:bookingId", validateBody(bookingSchema), changeBooking);

export { bookingRouter };
