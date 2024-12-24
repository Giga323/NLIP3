const QUANTITY_OF_RETURNED_SENTENCES = 10

const ANAPHORIC_PRONOUNS = [ 
    "я", "ты", "он", "она", "оно", "мы", "вы", "они", "мой", "твой", "его", 
    "её", "наш", "ваш", "их", "кто", "что", "который", "такой", "некоторый", 
    "любой", "всё",
    "I", "you", "he", "she", "it", "we", "you", "they", "my", "your", "his", 
    "her", "our", "your", "their", "who", "what", "which", "such", "some", 
    "any", "everything"
];

const INTRODUCTORY_CONSTRUCTIONS = [
    "на первый взгляд", "с одной стороны", "как бы", "в некотором роде",
    "по сути", "в чем-то", "в некотором смысле", "в определенном смысле",
    "в целом", "можно сказать", "в каком-то смысле", "по большому счету",
    "в известной степени", "по сути дела", "в общем-то",
    "at first glance", "on one hand", "as if", "in a way",
    "essentially", "in some sense", "in a certain sense", "in general",
    "one might say", "to a large extent", "to some extent", "generally speaking"
];

function getSentences(text) {
    return text.split(/(?<=[.!?])\s+/)
}

function checkIntroductoryConstructions(sentences) {
    return sentences.map(sentence => {
        const regExp = new RegExp(INTRODUCTORY_CONSTRUCTIONS.join('|'), 'gi')
        return sentence.replace(regExp, '').trim()
    })
}

function checkAnamorphicPronouns(sentences) {
    return sentences.map(sentence => {
        return sentence.split(' ').filter(word => {
            return !ANAPHORIC_PRONOUNS.includes(word)
        })
    })
}

function prepareSentences(text) {
    const sentences = getSentences(text)
    let checkedSentences = checkIntroductoryConstructions(sentences)
    checkedSentences = checkAnamorphicPronouns(checkedSentences)

    return checkedSentences
}

function getWords(sentence) {
    return sentence
    .split(' ')
    .map(word => word.replace(/[\n\t\r,\.;:)(]/g, '').toLowerCase())
    .filter(word => /[a-zа-я]+/g.test(word))
}

function calculateTF(word, sentence) {
    const words = getWords(sentence.join(' '))
    return words.filter(sentenceWord => sentenceWord === word).length / words.length 
}

/* Частота термина t в документе D*/
function calculateTD(word, document) {
    const wordsOfDocument = document.map(sentence => {
        return sentence.join(' ')
    }).join(' ').split(' ')
    return wordsOfDocument.filter(sentenceWord => sentenceWord === word).length / wordsOfDocument.length
}

function calculateMaxTD(word, filesContent) {
    let maxFrequencyOfT = []

    filesContent.forEach(fileContent => {
        const td = calculateTD(word, prepareSentences(fileContent))
        maxFrequencyOfT.push(td)
    })

    return maxFrequencyOfT.sort((a, b) => b - a)[0]
}

function calculateDF(word, filesContent) {
    let df = 1

    filesContent.forEach(fileContent => {
        const words = getWords(fileContent)
        if (words.includes(word)) {
            df++
        }
    })

    return df
}

function calculateIDF(word, document, filesContent) {
    return 0.5 * 
    (1 + calculateTD(word, document) / calculateMaxTD(word, filesContent))
    * Math.log(filesContent.length / calculateDF(word, filesContent))
}

function calculateScore(sentence, checkedSentences, filesContent) {
    return sentence.reduce(
        (accumulator, currentWord) => {
            return accumulator + calculateTF(currentWord, sentence) * calculateIDF(currentWord, checkedSentences, filesContent)
        }, 0
    )
}

function calculatePOSD(sentence, checkedSentences) {
    const index = checkedSentences.indexOf(sentence)
    const D = checkedSentences.join(' ').length
    const BD = checkedSentences.slice(0, index).join(' ').length

    return 1 - BD / D;
}

function transformToParagraphArray(sentences) {
    return sentences.split('\n')
}

function calculateParagraphIndex(sentence, paragraphs) { 
    for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].includes(sentence)) {
            return i
        }
    }

    return 0
}

function calculatePOSP(sentence, sentences) {
    const paragraphs = transformToParagraphArray(sentences.join(' '))
    const indexOfParagraph = calculateParagraphIndex(sentence, paragraphs)
    const P = paragraphs[indexOfParagraph].length
    const index = paragraphs[indexOfParagraph].indexOf(sentence)
    const BP = paragraphs[indexOfParagraph].slice(0, index).length

    return 1 - BP / P
}

function calculateSentenceWeight(sentence, checkedSentences, filesContent) {
    const posd = calculatePOSD(sentence, checkedSentences)
    const posp = calculatePOSP(sentence, checkedSentences)
    const score = calculateScore(sentence, checkedSentences, filesContent)

    return posd * posp * score
}

function getSentencesWeights(checkedSentences, filesContent) {
    return checkedSentences.map(
        sentence => {
            return {
                value: sentence.join(' '),
                score: calculateSentenceWeight(sentence, checkedSentences, filesContent)
            }
        }
    )
}

function sentenceExtraction(filesContent) {
    const documents = filesContent.map(fileContent => {
        
        const checkedSentences = prepareSentences(fileContent)

        const sentencesWeights = getSentencesWeights(checkedSentences, filesContent)

        const sortedSentencesWeights = sentencesWeights.sort((a, b) => b.score - a.score)

        return sortedSentencesWeights
    })

    let resultDocuments = []

    documents.forEach(document => {
        resultDocuments.push(...document)
    })

    return resultDocuments.sort((a, b) => b.score - a.score).slice(0, QUANTITY_OF_RETURNED_SENTENCES)
}

module.exports.sentenceExtraction = sentenceExtraction