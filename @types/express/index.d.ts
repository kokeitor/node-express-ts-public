import { Session } from "../../src/domain";

declare global {
  namespace Express {
    interface Request {
      session: Session;
    }
  }
}
