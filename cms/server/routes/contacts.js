var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');

async function mapGroupToObjectIds(group) {
	if (!Array.isArray(group) || group.length === 0) {
		return [];
	}

	const ids = [];

	for (const item of group) {
		if (!item) {
			continue;
		}

		if (typeof item === 'string') {
			const byNaturalId = await Contact.findOne({ id: item });
			if (byNaturalId) {
				ids.push(byNaturalId._id);
			}
			continue;
		}

		if (item._id) {
			ids.push(item._id);
			continue;
		}

		if (item.id) {
			const byNaturalId = await Contact.findOne({ id: item.id });
			if (byNaturalId) {
				ids.push(byNaturalId._id);
			}
		}
	}

	return ids;
}

router.get('/', (req, res, next) => {
	Contact.find()
		.populate('group')
		.sort({ name: 1 })
		.then((contacts) => {
			res.status(200).json({
				message: 'Contacts fetched successfully!',
				contacts: contacts,
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
	const maxContactId = await sequenceGenerator.nextId('contacts');

	if (!maxContactId) {
		return res.status(500).json({
			message: 'Unable to generate contact id',
		});
	}

	try {
		const mappedGroup = await mapGroupToObjectIds(req.body.group);

		const contact = new Contact({
			id: maxContactId,
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			imageUrl: req.body.imageUrl,
			group: mappedGroup,
		});

		const createdContact = await contact.save();
		const populatedContact = await Contact.findById(createdContact._id).populate('group');

		res.status(201).json({
			message: 'Contact added successfully',
			contact: populatedContact,
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
		const existingContact = await Contact.findOne({ id: req.params.id });

		if (!existingContact) {
			return res.status(500).json({
				message: 'Contact not found.',
				error: { contact: 'Contact not found' },
			});
		}

		const mappedGroup = await mapGroupToObjectIds(req.body.group);

		existingContact.name = req.body.name;
		existingContact.email = req.body.email;
		existingContact.phone = req.body.phone;
		existingContact.imageUrl = req.body.imageUrl;
		existingContact.group = mappedGroup;

		await Contact.updateOne({ id: req.params.id }, existingContact);

		res.status(204).json({
			message: 'Contact updated successfully',
		});
	} catch (error) {
		res.status(500).json({
			message: 'An error occurred',
			error: error,
		});
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const existingContact = await Contact.findOne({ id: req.params.id });

		if (!existingContact) {
			return res.status(500).json({
				message: 'Contact not found.',
				error: { contact: 'Contact not found' },
			});
		}

		await Contact.deleteOne({ id: req.params.id });
		await Contact.updateMany(
			{ group: existingContact._id },
			{ $pull: { group: existingContact._id } }
		);

		res.status(204).json({
			message: 'Contact deleted successfully',
		});
	} catch (error) {
		res.status(500).json({
			message: 'An error occurred',
			error: error,
		});
	}
});

module.exports = router;