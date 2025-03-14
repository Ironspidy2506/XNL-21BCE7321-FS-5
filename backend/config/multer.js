import multer from "multer";

// Configure multer to store file in memory as Buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

export default upload;
