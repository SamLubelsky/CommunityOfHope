import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number;  
    role?: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
}