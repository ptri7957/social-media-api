const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(!fs.existsSync(path.resolve(req.app.get("currentdir"), "uploads"))){
            fs.mkdirSync(path.resolve(req.app.get("currentdir"), "uploads"));
        }
        cb(null, path.resolve(req.app.get("currentdir"), "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const uploads = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = uploads;