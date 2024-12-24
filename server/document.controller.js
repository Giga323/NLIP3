const sentenceExtraction = require('./sentenceExtraction')
const keywordsExtraction = require('./keywordsExtraction')

class DocumentController {

    async post(req, res) {
        const files = req.files

        const filesContent = Array.from(files).map(file => {
            return file.buffer.toString('utf-8')
        })

        const abstract = {
            sentenceExtraction: sentenceExtraction.sentenceExtraction(filesContent),
            keywordsExtraction: keywordsExtraction.keywordsExtraction(filesContent)
        }

        res.send(JSON.stringify(abstract))
    }
}

module.exports.DocumentController = new DocumentController()