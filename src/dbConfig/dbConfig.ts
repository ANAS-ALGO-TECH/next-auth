import mongoose from 'mongoose'

export const connect = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL!)
    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log('MongoDB Connected')
    })

    connection.on('error', err => {
      console.log(
        'MongoDB connection error, please make sure db is up and running: ' +
          err
      )
      process.exit(1)
    })
  } catch (error) {
    console.log('Something Went wrong in connecting to DB')
    console.log('error = ', error)
  }
}
