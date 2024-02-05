const { MongoClient } = require ('mongodb')

let dbConection

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect('mongodb://localhost:27017/infokiosk')
    .then((client) => {
      dbConection = client.db()
      return cb()
    })
    .catch(err => {
      console.log(err)
    return cb(err)
    })
  },
  getDb: () => dbConection
}