module.exports = {
    //Port for app server
    port: process.env.port || 4000,
    //used for authenticated account timeout
    tokenExpiration: 604800,
    jwtSecret: 'Prakalp',
    tokenExpirationTime: '1h',
    refreshTokenExpirationTime: 60 * 60, // In Seconds
    otpExpirationTime: 15 * 60 * 1000, // otp expiration time in milliseconds (15 minutes)
    passwordHistoryLength: 6
}
