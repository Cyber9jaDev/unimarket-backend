import multer from 'multer';


const uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000}
});

export default uploader;