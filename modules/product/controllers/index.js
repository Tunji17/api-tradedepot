
const mongoose = require('mongoose');
const firebase = require('firebase-admin');
const { sendJSONResponse } = require('../../../utils');

const serviceAccount = require('../../../config').firebase;

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

const db = firebase.firestore();

const create = async (req, res) => {
  const {
    name,
    geoDetails,
  } = req.body;

  const product = new (mongoose.model('Product'))();

  product.name = name;
  product.location = {
    type: 'Polygon',
    coordinates: geoDetails
  };
  await product.save();

  const productReference = db.collection('Product').doc(name);

  await productReference.set({
    name,
    location: {
      type: 'Polygon',
      coordinates: geoDetails
    },
  });
  return sendJSONResponse(res, 'Product successfully created', 'success', 200, req.body );
};

const read = async (req, res) => {
  const user = await mongoose.model('User').findOne({ email: req.decoded.email })
  const products = await mongoose.model('Product').find({
    location: {
        $geoIntersects: {
            $geometry: {
                type: "Point",
                coordinates: user.location.coordinates
            },
        }
    } 
})
  return sendJSONResponse(res, 'Product available near you', 'success', 200, products );
};

module.exports = {
  create,
  read
}