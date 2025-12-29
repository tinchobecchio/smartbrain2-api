const returnClarifaiReqOpt = (imageURL) => {
  
  const PAT = process.env.API_CLARIFAI;
  const USER_ID = 'clarifai';
  const APP_ID = 'main';
  const IMAGE_URL = imageURL;
  
  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };
  
  return requestOptions
}
const CLARIFAI_URL = `https://api.clarifai.com/v2/models/face-detection/outputs`


const handleAPICall = (req,res) => {
    const {url} = req.body
    fetch(CLARIFAI_URL, returnClarifaiReqOpt(url))
        .then(resp => resp.json())
        .then(data => {
            return res.json(data)
        })
        .catch(err => res.status(400).json('unable to work with API'))
}


const handleImagePut = (req,res,db) => {
    const { id } = req.body
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('Unable to get entries'))  
}

module.exports = {
    handleAPICall,
    handleImagePut
}