module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT'),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL'),
    },
  },
acquireConnectionTimeout: 1000000,
pool: {
  min: 2,
  max: 100,
  acquireTimeoutMillis: 600000,
  createTimeoutMillis: 600000,
  destroyTimeoutMillis: 600000,
  idleTimeoutMillis: 60000,
  reapIntervalMillis:2000,
  createRetryIntervalMillis: 4000,
  propagateCreateError: false
}
});
