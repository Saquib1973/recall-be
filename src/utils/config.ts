const env = {
  PORT : process.env.PORT || 3000,
  MONGODB_URL : process.env.MONGODB_URL || null,
  JWT_SECRET : process.env.JWT_SECRET || "TEST",
}

export default env;