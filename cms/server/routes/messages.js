var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');
const Contact = require('../models/contact');

async function resolveSender(senderValue) {
	if (!senderValue) {
		return null;
	}

	const senderContact = await Contact.findOne({ id: senderValue });
	if (!senderContact) {
		return null;
	}

	return senderContact._id;
}

router.get('/', (req, res, next) => {
	Message.find()
		.populate('sender')
		.sort({ id: -1 })
		.then((messages) => {
			res.status(200).json({
				message: 'Messages fetched successfully!',
				messages: messages,
			});
		})
		.catch((error) => {
			res.status(500).json({
				message: 'An error occurred',
				error: error,
			});
		});
});

router.post('/', async (req, res, next) => {
	const maxMessageId = await sequenceGenerator.nextId('messages');

	if (!maxMessageId) {
		return res.status(500).json({
			message: 'Unable to generate message id',
		});
	}

	try {
		const sender = await resolveSender(req.body.sender);
		const message = new Message({
			id: maxMessageId,
			subject: req.body.subject,
			msgText: req.body.msgText,
			sender: sender,
		});

		const createdMessage = await message.save();
		const populatedMessage = await Message.findById(createdMessage._id).populate('sender');

		res.status(201).json({
			message: 'Message added successfully',
			messageObject: populatedMessage,
		});
	} catch (error) {
		res.status(500).json({
			message: 'An error occurred',
			error: error,
		});
	}
});

router.put('/:id', async (req, res, next) => {
	try {
		const existingMessage = await Message.findOne({ id: req.params.id });

		if (!existingMessage) {
			return res.status(500).json({
				message: 'Message not found.',
				error: { message: 'Message not found' },
			});
		}

		const sender = await resolveSender(req.body.sender);

		existingMessage.subject = req.body.subject;
		existingMessage.msgText = req.body.msgText;
		existingMessage.sender = sender;

		await Message.updateOne({ id: req.params.id }, existingMessage);

		res.status(204).json({
			message: 'Message updated successfully',
		});
	} catch (error) {
		res.status(500).json({
			message: 'An error occurred',
			error: error,
		});
	}
});

router.delete('/:id', (req, res, next) => {
	Message.findOne({ id: req.params.id })
		.then((message) => {
			if (!message) {
				return res.status(500).json({
					message: 'Message not found.',
					error: { message: 'Message not found' },
				});
			}

			Message.deleteOne({ id: req.params.id })
				.then((result) => {
					res.status(204).json({
						message: 'Message deleted successfully',
					});
				})
				.catch((error) => {
					res.status(500).json({
						message: 'An error occurred',
						error: error,
					});
				});
		})
		.catch((error) => {
			res.status(500).json({
				message: 'An error occurred',
				error: error,
			});
		});
});

module.exports = router;