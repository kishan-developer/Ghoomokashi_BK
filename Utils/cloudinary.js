const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'ddrss0nel',
    api_key: '173343668229365',
    api_secret: 'gHWnzlUomEZgVj3G9jpkXlrBCx8'
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'travel-services',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

module.exports = { cloudinary, storage };
