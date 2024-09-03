const express = require("express");
const { getEvents, createEvent } = require("../Controllers/event");
const eventRoute = express.Router();
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const multer = require("multer");

//Initialize firebase storage
const storage = getStorage();
// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

/*
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../../REACT/ekodiary/src/Images");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage })
*/
eventRoute.get("/", getEvents);
eventRoute.post("/create", upload.single("Image") , createEvent);

module.exports = eventRoute;