const express = require('express')
const compression = require('compression')
const app = express()
const dotenv = require('dotenv').config()
const path = require('path')
const tf = require('@tensorflow/tfjs-node');
const toxicity = require('@tensorflow-models/toxicity');
const translatte = require('translatte');
const { cp } = require('fs/promises');

const threshold = 0.6

// let predictionFinal;

async function classify(text){
    console.log("[SAFEBEAR AI] : CLASSIFICATION DU MESSAGE : " + text)
    const model = await toxicity.load(threshold)
    console.log("[SAFEBEAR AI] : Modèle chargé")
    return await model.classify(text)
}

async function translation(text){
  return await translatte(text, {from:'fr', to:'en'})
}

app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', './templates')


// loadModel().then(model => {console.log("model chargé")})


app.get('/', (req, res) => {
    res.render('index')

})
app.get('/test', (req, res) => {
    classify('coucou').then(text => {console.log(text)})

})

app.post('/data', (req, res) => {
    console.log(req.body)
    translation(req.body.textInput)
    .then(translatedText => {
        console.log(translatedText.text)
        classify(translatedText.text).then((predictions) => {
            console.log("Predictions obtenues")
            console.log(predictions)
            res.json(predictions)
        })
    })
   
    
})


app.listen(process.env.PORT, ()=>{
    console.log('APP RUNNING ! Listening on port', process.env.PORT)
})
