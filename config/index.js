const {
  MONGO_URI,
  PORT,
  APP_PORT = PORT
} = process.env

if(!MONGO_URI || !APP_PORT) {
  console.error("MONGO_URI or APP_PORT env not found")
  process.exit(1);
}
export {
  MONGO_URI,
  APP_PORT
}
