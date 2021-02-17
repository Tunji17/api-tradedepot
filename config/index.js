module.exports = {
  mongo: {
    url: process.env.MONGODB_URL,
  },
  logger: {
    level: process.env.LOGGERLEVEL || 'debug',
  },
  baseUrl: process.env.BASEURL,
  secret: process.env.SECRET,
  mailgun: {
    apiKey: process.env.MAIL_GUN_API_KEY,
    domain: process.env.MAIL_GUN_DOMAIN,
  }
}
