/**
 * Seed script to populate the cms database from lesson11Files.
 * Run with: node scripts/seed-database.js
 *
 * Before running: Update the YOUR_NAME, YOUR_EMAIL, YOUR_PHONE, YOUR_IMAGE_URL
 * placeholders below with your actual information for the contact (id: 101).
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Document = require('../server/models/document');
const Message = require('../server/models/message');
const Contact = require('../server/models/contact');
const Sequence = require('../server/models/sequence');

// ========== UPDATE THESE WITH YOUR INFO (for contact id 101) ==========
const YOUR_NAME = 'Your Name';
const YOUR_EMAIL = 'yourEmail@example.com';
const YOUR_PHONE = 'yourPhone';
const YOUR_IMAGE_URL = 'assets/images/yourimage.jpg';
const YOUR_MESSAGE_SUBJECT = 'Your Subject';
const YOUR_MESSAGE_TEXT = 'Your message text here.';
// ======================================================================

function parseMongoJson(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');
  // Convert MongoDB shell ObjectId("hex") to JSON-compatible format
  text = text.replace(/ObjectId\s*\(\s*["']([a-f0-9]{24})["']\s*\)/g, '"$1"');
  return JSON.parse(text);
}

async function seed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/cms');
    console.log('Connected to database');

    const basePath = path.join(__dirname, '../lesson11Files');

    // Clear existing collections
    await Document.deleteMany({});
    await Message.deleteMany({});
    await Contact.deleteMany({});
    await Sequence.deleteMany({});
    console.log('Cleared existing collections');

    // Insert documents (strip _id - MongoDB will generate)
    const documentsData = parseMongoJson(path.join(basePath, 'documents.json'));
    const documentsToInsert = documentsData.map((doc) => {
      const { _id, ...rest } = doc;
      return rest;
    });
    await Document.insertMany(documentsToInsert);
    console.log(`Inserted ${documentsToInsert.length} documents`);

    // Insert contacts - individuals first, then groups
    const contactsData = parseMongoJson(path.join(basePath, 'contacts.json'));
    const individuals = contactsData.filter((c) => !c.group || c.group.length === 0);
    const groups = contactsData.filter((c) => c.group && c.group.length > 0);

    // Map: contact id -> old ObjectId (for group resolution)
    const idToOldObjectId = {};
    individuals.forEach((c) => {
      if (c._id) idToOldObjectId[c.id] = c._id;
    });

    // Insert individuals (without _id and group)
    // Fix imageUrl path: ../assets -> assets for Angular app
    const fixImageUrl = (url) => (url ? url.replace(/^\.\.\/assets\//, 'assets/') : url);
    const individualsToInsert = individuals.map(({ _id, __v, group, ...rest }) => ({
      ...rest,
      imageUrl: fixImageUrl(rest.imageUrl)
    }));
    const insertedIndividuals = await Contact.insertMany(individualsToInsert);
    const idToNewObjectId = {};
    insertedIndividuals.forEach((c) => {
      idToNewObjectId[c.id] = c._id;
    });

    // Map old ObjectId -> new ObjectId for groups
    const oldToNewObjectId = {};
    for (const [contactId, oldId] of Object.entries(idToOldObjectId)) {
      if (idToNewObjectId[contactId]) {
        oldToNewObjectId[oldId] = idToNewObjectId[contactId];
      }
    }

    // Insert groups with resolved ObjectIds
    const groupsToInsert = groups.map(({ _id, __v, group, ...rest }) => {
      const newGroup = (group || [])
        .map((oldId) => oldToNewObjectId[oldId])
        .filter(Boolean);
      return { ...rest, group: newGroup };
    });
    await Contact.insertMany(groupsToInsert);
    console.log(`Inserted ${individuals.length} individual contacts and ${groups.length} group contacts`);

    // Insert sequences
    const sequencesData = parseMongoJson(path.join(basePath, 'sequences.json'));
    await Sequence.create(sequencesData);
    console.log('Inserted sequences');

    // Insert messages (resolve sender: contact id -> ObjectId)
    const messagesData = parseMongoJson(path.join(basePath, 'messages.json'));
    const messagesToInsert = messagesData.map((msg) => {
      const senderId = msg.sender ? String(msg.sender) : null;
      const senderObjectId = senderId ? idToNewObjectId[senderId] : null;
      return { ...msg, sender: senderObjectId };
    });
    await Message.insertMany(messagesToInsert);
    console.log(`Inserted ${messagesToInsert.length} messages`);

    // Add user contact (id: 101) per assignment
    const userContact = await Contact.create({
      id: '101',
      name: 'Tyler Burdett',
      email: 'bur23034@byui.edu',
      phone: '8017259183',
      imageUrl: 'assets/images/tylerburdett.jpg',
      group: null
    });
    console.log('Inserted your contact (id: 101)');

    // Update sequences maxContactId to 101
    await Sequence.updateOne({}, { $set: { maxContactId: 101 } });
    console.log('Updated maxContactId to 101');

    // Add user message (id: 101) with sender: null initially
    await Message.create({
      id: '101',
      subject: 'testing',
      msgText: 'I sure hope this works',
      sender: null
    });
    console.log('Inserted your message (id: 101)');

    await Sequence.updateOne({}, { $set: { maxMessageId: 101 } });
    console.log('Updated maxMessageId to 101');

    // Update the message's sender to reference the user contact
    await Message.updateOne({ id: '101' }, { $set: { sender: userContact._id } });
    console.log('Linked your message to your contact');

    console.log('\nSeed completed successfully!');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
