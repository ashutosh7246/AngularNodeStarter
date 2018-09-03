var config = {
  default: {
    database:'', // give your MLAB DB path eg: `mongodb://<user>:<password>@ds131942.mlab.com:31942/<dbname>`
    environment: {
      host: 'reactjs-nodejs-demo.com',
      sjclKey: 'ashutosh@123'
    },
    redisPublisher: {
      redisHost: 'reactjs-nodejs-demo.com',
      reditPort: '5000'
    },
  }
}

module.exports = config;