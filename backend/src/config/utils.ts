import dotenv from 'dotenv'
dotenv.config()

export function getDbName() {
  if (process.env.NODE_ENV === 'test') {
    return 'coh-data-test'
  }
  if (process.env.NODE_ENV === 'development') {
    return 'coh-data-dev'
  }
  if (process.env.NODE_ENV === 'production') {
    return 'coh-data'
  }
  throw new Error('Invalid environment, cannot determine db name')
}
