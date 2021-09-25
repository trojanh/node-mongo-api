import mongoose from 'mongoose'

/**
 * used to intialize the mongodb with the specified connection URI
 * @param {string} connectionURI
 */
export async function initializeMongo(connectionURI) {
  return mongoose.connect(connectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
