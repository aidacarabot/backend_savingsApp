const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'SavingsAppFiles', //el nombre de la carpeta en cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'] //los archivos que permite subir
  },
});

const upload = multer({ storage }); //para guardar los archivos

module.exports = { upload }