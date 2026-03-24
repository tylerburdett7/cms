var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;
var sequenceReady = false;
var sequencePromise = null;

function SequenceGenerator() {
  sequencePromise = Sequence.findOne()
    .exec()
    .then(function (sequence) {
      if (!sequence) {
        console.error('No sequence found in database');
        return;
      }
      sequenceId = sequence._id;
      maxDocumentId = sequence.maxDocumentId;
      maxMessageId = sequence.maxMessageId;
      maxContactId = sequence.maxContactId;
      sequenceReady = true;
    })
    .catch(function (err) {
      console.error('SequenceGenerator error:', err);
    });
}

SequenceGenerator.prototype.nextId = function (collectionType) {
  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = { maxDocumentId: maxDocumentId };
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = { maxMessageId: maxMessageId };
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = { maxContactId: maxContactId };
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  if (sequenceId) {
    Sequence.updateOne({ _id: sequenceId }, { $set: updateObject }).exec().catch(function (err) {
      console.log('nextId error = ' + err);
    });
  }

  return nextId;
};

module.exports = new SequenceGenerator();
