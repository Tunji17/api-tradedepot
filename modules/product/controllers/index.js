
const mongoose = require('mongoose');
const firebase = require('firebase-admin');
const { sendJSONResponse, uploadImageToStorage } = require('../../../utils');
const serviceAccount = require('../../../config/firebase.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

const db = firebase.firestore();
db.settings({ ignoreUndefinedProperties: true })

const create = async (req, res) => {
  const {
    name,
    distanceInMeters,
    address,
    geoDetails,
    image
  } = req.body;
  const user = await mongoose.model('User').findOne({ email: req.decoded.email })
  const product = new (mongoose.model('Product'))();

  let uploadImage = null;
  if (image) {
    uploadImage = await uploadImageToStorage(image)
  }
  product.name = name;
  product.maxDistance = distanceInMeters;
  product.address = address;
  product.image = uploadImage;
  product.location = {
    type: 'Point',
    coordinates: geoDetails
  };
  product.createdBy = user;
  await product.save();


  const productReference = db.collection('Product').doc(name);

  await productReference.set({
    name,
    maxDistance: distanceInMeters,
    address,
    image: uploadImage,
    location: {
      type: 'Point',
      coordinates: geoDetails
    },
  });
  return sendJSONResponse(res, 'Product successfully created', 'success', 200, product );
};

const read = async (req, res) => {
  const user = await mongoose.model('User').findOne({ email: req.decoded.email })
  const products = await mongoose.model('Product').aggregate(
    [
        { $geoNear: {
          near: {type: 'Point', coordinates: user.location.coordinates},
          distanceField: "distance"
        }},
        { $redact: {
          $cond: {
            if: { $lt: [ "$distance", "$maxDistance" ] },
            then: '$$KEEP',
            else: '$$PRUNE'
            }
        }},
    ])
    await mongoose.model('Product').populate(products, { path: 'createdBy', select: 'fullName email' });
  return sendJSONResponse(res, 'Product available near you', 'success', 200, products );
};

module.exports = {
  create,
  read
}