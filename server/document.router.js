const express = require('express')
const multer = require('multer');
const upload = multer()
const documentController = require('./document.controller')
const documentRouter = express.Router()

documentRouter.post('/document/post', upload.array('files'), documentController.DocumentController.post)

module.exports.documentRouter = documentRouter