var Sequence = require('../models/sequence');
var Contact = require('../models/contact');
var Message = require('../models/message');
var Document = require('../models/document');

function SequenceGenerator() {
  return;
}

SequenceGenerator.prototype.getCollectionMaxId = async function(model) {
  var result = await model.aggregate([
    {
      $project: {
        numericId: {
          $convert: {
            input: '$id',
            to: 'int',
            onError: 0,
            onNull: 0,
          },
        },
      },
    },
    { $sort: { numericId: -1 } },
    { $limit: 1 },
  ]);

  if (!result || result.length === 0) {
    return 0;
  }

  return result[0].numericId || 0;
};

SequenceGenerator.prototype.nextId = function(collectionType) {
  var fieldName;
  var model;

  switch (collectionType) {
    case 'documents':
      fieldName = 'maxDocumentId';
      model = Document;
      break;
    case 'messages':
      fieldName = 'maxMessageId';
      model = Message;
      break;
    case 'contacts':
      fieldName = 'maxContactId';
      model = Contact;
      break;
    default:
      return Promise.resolve(null);
  }

  var self = this;

  return Sequence.findOneAndUpdate(
    {},
    {
      $setOnInsert: {
        maxDocumentId: 0,
        maxMessageId: 0,
        maxContactId: 0,
      },
    },
    { returnDocument: 'after', upsert: true }
  )
    .then(async function(sequence) {
      if (!sequence) {
        return null;
      }

      var sequenceValue = Number(sequence[fieldName]) || 0;
      var actualMax = await self.getCollectionMaxId(model);
      var nextId = Math.max(sequenceValue, actualMax) + 1;

      await Sequence.updateOne(
        { _id: sequence._id },
        { $set: { [fieldName]: nextId } }
      );

      return nextId.toString();
    })
    .catch(function(err) {
      console.log('nextId error = ' + err);
      return null;
    });
};

module.exports = new SequenceGenerator();