import bcrypt from "bcrypt";
import passport from "passport";
import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import { Account } from "@/models/accounts.model";
import { logger } from "./logger";

passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user);
});

passport.deserializeUser(async (user, done) => {
  try {
    done(undefined, user as Account);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        logger.info(`<${email}> START LOGIN`)
        const user = await Account.findByEmail(email.toLowerCase());
        
        if (!user) {
          return done(undefined, false, {
            message: `Email ${email} not found.`,
          });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
          return done(undefined, user);
        }
        return done(undefined, false, {
          message: "Invalid email or password.",
        }); 
      } catch (error) {
        return done(error);
      }
    }
  )
);
