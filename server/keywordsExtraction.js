const QUANTITY_OF_RETURNED_WORDS = 10

const ANAPHORIC_PRONOUNS = [ 
    "я", "ты", "он", "она", "оно", "мы", "вы", "они", "мой", "твой", "его", 
    "её", "наш", "ваш", "их", "кто", "что", "который", "такой", "некоторый", 
    "любой", "всё", "в",
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

function prepareSentences(sentences) {
    let preparedSentences = checkIntroductoryConstructions(sentences)
    preparedSentences = checkAnamorphicPronouns(preparedSentences)

    return preparedSentences
}

function getWords(sentence) {
    return sentence
    .map(word => word.replace(/[\n\t\r,\.;:)(]/g, '').toLowerCase())
    .filter(word => /[a-zа-я]+/g.test(word))
    .filter(word => word.length > 3)
}

function prepareContent(documentsContent) {
    const sentences = documentsContent.split(/(?<=[.!?])\s+/)
    
    const preparedSentences = prepareSentences(sentences)

    let words = []

    preparedSentences.forEach(sentence => {
        words.push(...getWords(sentence))
    })

    words = new Set(words)

    return Array.from(words)
}

function calculateFrequenceInversion(word, documents) {
    return Math.log(
        documents.length / documents.reduce(
            (accumulator, document) => {
                let count = document.split(' ').includes(word) ? 1 : 0
                return accumulator +  count
            }, 0)
    )
}

function calculateFrequence(word, words) {
    return words.filter(tempWord => tempWord === word).length / words.length
}

function calculateScore(word, words, filesContent) {
    return calculateFrequence(word, words) * calculateFrequenceInversion(word, filesContent)
}

function keywordsExtraction(filesContent) {
    const documentsContent = filesContent.join(' ')

    const words = prepareContent(documentsContent)

    const wordsScores = words.map(word => {
        return {
            value: word,
            score: calculateScore(word, words, filesContent)
        }
    })

    return wordsScores.sort((a, b) => b.score - a.score).slice(0, QUANTITY_OF_RETURNED_WORDS)
}

module.exports.keywordsExtraction = keywordsExtraction