const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');
const Contact = require('../models/contact');

router.get('/', (req, res, next) => {
  Message.find()
    .populate('sender')
    .then((messages) => {
      res.status(200).json({
        message: 'Messages fetched successfully!',
        messages: messages
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.post('/', (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId('messages');

  const resolveSender = (sender) => {
    if (!sender) return Promise.resolve(null);
    if (mongoose.Types.ObjectId.isValid(sender) && String(sender).length === 24) {
      return Promise.resolve(sender);
    }
    return Contact.findOne({ id: String(sender) }).then((c) => (c ? c._id : null));
  };

  resolveSender(req.body.sender).then((senderId) => {
    const message = new Message({
      id: String(maxMessageId),
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: senderId
    });

    message
      .save()
      .then((createdMessage) => {
        return createdMessage.populate('sender');
      })
      .then((populatedMessage) => {
        res.status(201).json({
          message: 'Message added successfully',
          msg: populatedMessage
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: 'An error occurred',
          error: error
        });
      });
  });
});

router.put('/:id', (req, res, next) => {
  const resolveSender = (sender) => {
    if (!sender) return Promise.resolve(null);
    if (mongoose.Types.ObjectId.isValid(sender) && String(sender).length === 24) {
      return Promise.resolve(sender);
    }
    return Contact.findOne({ id: String(sender) }).then((c) => (c ? c._id : null));
  };

  Message.findOne({ id: req.params.id })
    .then((message) => {
      if (!message) {
        throw { status: 404, msg: 'Message not found' };
      }
      message.subject = req.body.subject;
      message.msgText = req.body.msgText;

      return resolveSender(req.body.sender || message.sender).then((senderId) => {
        message.sender = senderId;

        return Message.updateOne({ id: req.params.id }, message);
      });
    })
    .then(() => {
      res.status(204).json({
        message: 'Message updated successfully'
      });
    })
    .catch((error) => {
      if (error.status === 404) {
        res.status(500).json({
          message: 'Message not found.',
          error: { message: 'Message not found' }
        });
      } else {
        res.status(500).json({
          message: 'An error occurred',
          error: error
        });
      }
    });
});

router.delete('/:id', (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then(() => {
      Message.deleteOne({ id: req.params.id })
        .then(() => {
          res.status(204).json({
            message: 'Message deleted successfully'
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Message not found.',
        error: { message: 'Message not found' }
      });
    });
});

module.exports = router;
