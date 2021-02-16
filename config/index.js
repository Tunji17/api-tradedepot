module.exports = {
  mongo: {
    url: process.env.MONGODB_URL,
  },
  logger: {
    level: process.env.LOGGERLEVEL || 'debug',
  },
  baseUrl: process.env.BASEURL,
  secret: process.env.SECRET,
  firebase: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBSE_CLIENT_EMAIL,
    client_id: process.env.FIREBSE_CLIENT_ID,
    auth_uri: process.env.FIREBSE_AUTH_URI,
    token_uri: process.env.FIREBSE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBSE_AUTH_PROVIDER,
    client_x509_cert_url: process.env.FIREBSE_CLIENT
  }
}
