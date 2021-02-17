
const mongoose = require('mongoose');
const firebase = require('firebase-admin');
const { sendJSONResponse, uploadImageToStorage, sendMail } = require('../../../utils');
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

const createComments = async (req, res) => {
  const { 
    body,
    productId,
    commentId,
  } = req.body;
  const user = await mongoose.model('User').findOne({ email: req.decoded.email });
  const product = await mongoose.model('Product').findOne({ _id: productId }).populate({ path: 'createdBy', select: 'fullName email' });
  if (!product) return sendJSONResponse(res, 'Product not found', 'error', 400, null );
  if (commentId) {
    const comment = await mongoose.model('Comment').findOne({ _id: commentId, product }).populate({ path: 'createdBy', select: 'fullName email' });
    if (!comment) return sendJSONResponse(res, 'The Comment you replied to not longer exists', 'error', 400, null );
    comment.replies.push({ body, createdBy: user})
    await comment.save()
    const data = {
      from: 'Trade depot demo <contact@samples.mailgun.org>',
      to: comment.createdBy.email,
      subject: 'Hello',
      text: `${user.fullName} replied to your comment with ${body}`
    };
    await sendMail(data) // ideally we should use a message broker to handle send email retries when it fails but because of time i would skip that
    return sendJSONResponse(res, 'Comment saved successfully', 'success', 200, comment);
  }
  const comment = new (mongoose.model('Comment'))();
  comment.body = body;
  comment.product = product
  comment.createdBy = user
  await comment.save()
  // sending sms would also occur here using https://developers.africastalking.com/docs/sms/overview. but i didn't collect the users phone numbers on registration so i would leave that feature out right now
  const data = {
    from: 'Trade depot demo <contact@samples.mailgun.org>',
    to: product.createdBy.email,
    subject: 'Hello',
    text: `${user.fullName} replied to your product posting with ${body}`
  };
  await sendMail(data)
  return sendJSONResponse(res, 'Comment saved successfully', 'success', 200, comment);
};

module.exports = {
  create,
  read,
  createComments,
}