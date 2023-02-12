import { ApplicationError } from "@/protocols";

export function cannotBookingError(): ApplicationError {
  return {
    name: "CannotBookingError",
    message: "You are not allowed to book a room or there are no vacancies for the selected room!",
  };
}
