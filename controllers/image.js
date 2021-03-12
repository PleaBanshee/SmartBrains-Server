const Clarifai = require('clarifai');

// store API keys on server, more secure this way. API keys won't display in the network tab in Devtools
const app = new Clarifai.App({
    apiKey: '207fdd68775946a1b22ed5c6221c1bcd'
});

const handleApiCall = (req,res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Failed to upload image'));
}

const handleImages = (db) => (req,res) => {
    const {id} = req.body;
    db('users').where('id','=',id).increment('entries',1) // increment knex function 
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Failed to update entry count'))
}

module.exports = {
    handleImages: handleImages,
    handleApiCall: handleApiCall
}