const cloudinary = require('cloudinary').v2;

const deleteImgCloudinary = (imgUrl) => {
    const imgSplited = imgUrl.split('/');
    const nameSplited = imgSplited.at(-1).split('.')[0]; // Sin la extensión
    const folderSplited = imgSplited.at(-2);
    const public_id = `${folderSplited}/${nameSplited}`;

    console.log('Eliminando imagen con public_id:', public_id); // Verificar si el public_id es correcto

    cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) {
            console.error('Error deleting image from Cloudinary:', error)
            return;
        }
        console.log('Image deleted successfully from Cloudinary:', result)
    });
};

module.exports = { deleteImgCloudinary };