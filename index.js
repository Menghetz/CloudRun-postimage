// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file.
//https://medium.com/@olamilekan001/image-upload-with-google-cloud-storage-and-node-js-a1cf9baa1876
// [START cloudrun_imageproc_controller]
// [START run_imageproc_controller]

const express = require('express');
const bodyParser = require('body-parser')
const multer = require('multer')
const { spawn } = require('child_process');
const {Storage} = require('@google-cloud/storage');

const upload = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, './input')
  },
  filename : function(req,file,cb){
    console.log(file);
    const fileExt = file.originalname.split('.').pop();
    cb(null,'hello'+Date.now()+'.' + fileExt);
  } 
})

const upload1 = multer({ storage: upload })
const app = express();

// const MIME_TYPES = {
//   "image/jpeg" : "jpg",
//   "image/png" : "png"
// }

// This middleware is available in Express v4.16.0 onwards
app.disable('x-powered-by')
//app.use(multerMid.single('file'))
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('app now listening for requests!!!')
})


/// CREATE CLOUD STORAGR CLIENT
// Creates a GCP Storage client
const storage = new Storage();

// Declare the bucket you wanna upload the files
const bucketName = "amazon-tracker-264915-upload";
/////


app.post('/uploads', upload1.single('avatar'), (req, res) => {
  console.log(req);
  if (!req.file) {
    console.log("No file received");
    return res.status(400).send({
      msg : 'No file received',
      success: false
    });

  } else {
    console.log('file received');
    console.log('Executing generate.py');
    const python = spawn('python', ['-u','/app/generate.py'],  {stdio: ['pipe', 'pipe', 'inherit']});
    // collect data from script
    // python.stdout.on('data', async function (data) {
    //   console.log('Pipe data from python script ...');
    //   dataToSend = data.toString();
    //   console.log("python script output",dataToSend);
    //   const arrayList = dataToSend.split(",");
    //   for (var i = 0; i < arrayList.length; i++) { 
    //     await storage.bucket(bucketName).upload("./output/" + arrayList[i]);   
    //   }
    // });
    python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      });
    return res.send({
      success: true
    })
  }
});



// app.post('/', async (req, res) => {
//   if (!req.body) {
//     const msg = 'no image received';
//     console.error(`error: ${msg}`);
//     res.status(400).send(`Bad Request: ${msg}`);
//     return;
//   }
//   if (!req.body.message || !req.body.message.data) {
//     const msg = 'invalid message format';
//     console.error(`error: ${msg}`);
//     res.status(400).send(`Bad Request: ${msg}`);
//     return;
//   }

//   // Decode the Pub/Sub message.
//   const pubSubMessage = req.body.message;
//   let data;
//   try {
//     data = Buffer.from(pubSubMessage.data, 'base64').toString().trim();
//     data = JSON.parse(data);
//   } catch (err) {
//     const msg =
//       'Invalid Pub/Sub message: data property is not valid base64 encoded JSON';
//     console.error(`error: ${msg}: ${err}`);
//     res.status(400).send(`Bad Request: ${msg}`);
//     return;
//   }

//   // Validate the message is a Cloud Storage event.
//   if (!data.name || !data.bucket) {
//     const msg =
//       'invalid Cloud Storage notification: expected name and bucket properties';
//     console.error(`error: ${msg}`);
//     res.status(400).send(`Bad Request: ${msg}`);
//     return;
//   }

//   try {
//     await image.blurOffensiveImages(data);
//     res.status(204).send();
//   } catch (err) {
//     console.error(`error: Blurring image: ${err}`);
//     res.status(500).send();
//   }
// });
// // [END run_imageproc_controller]
// // [END cloudrun_imageproc_controller]

//module.exports = app;