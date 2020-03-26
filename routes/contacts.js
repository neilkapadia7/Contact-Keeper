const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');
const Contact = require('../models/Contact');


// @route   GET api/contacts
// @desc    Get all user contacts
// @access  Private
router.get('/', auth , async (req, res) => {
    try{
        const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
        res.json(contacts) 
    }
    catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   Post api/contacts
// @desc    Add New Contact
// @access  Private
router.post('/', [ auth , [
    check('name', 'Name is required')
     .not()
     .isEmpty()
] ] , async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        });

        const contact = await newContact.save();

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

})

// @route   Update api/contacts/:id
// @desc    Update Contact
// @access  Private
router.put('/:id', auth , async (req, res) => {
    const { name, email, phone, type } = req.body;

    const contactFields = {};
    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;

    try{
        let contact = await Contact.findById(req.params.id);

        if(!contact) return res.status(404).json({ msg: 'Contact Not Found' });

        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'Not authorized' });
        }

        contact = await Contact.findByIdAndUpdate(req.params.id, 
            { $set: contactFields },
            { new: true });

        res.json(contact);
    }
    catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   Delete api/contacts/:id
// @desc    delete Contact
// @access  Private
router.delete('/:id', auth ,async (req, res) => {
    try{
        let contact = await Contact.findById(req.params.id);

        if(!contact) return res.status(404).json({ msg: 'Contact Not Found' });

        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Contact.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Contact Removed' });
    }
    catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;