var config = {
  default: {
    database:'mongodb://ashutosh:vivla1@ds131942.mlab.com:31942/reactjs-nodejs-starter',
    environment: {
      host: 'localhost',
      sjclKey: 'ashutosh@123'
    },
    redisPublisher: {
      redisHost: 'localhost',
      reditPort: '5000'
    },
  }
}

module.exports = config;