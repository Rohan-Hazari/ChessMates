import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
  }
}
declare module "next-auth" {
  interface Session {
    user: User;
  }
}

// By using the & operator,the user property inside the Session interface
// becomes a combination of the User type and the two additional properties (id and username).
//  So, the resulting user property will include all the properties
// from the original User type along with the id and username properties.
