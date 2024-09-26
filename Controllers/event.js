const Event = require("../Model/event");
const { getStorage, deleteObject, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const{ initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../Util/firebase_config");
const index = require("../index");



initializeApp(firebaseConfig);
const storage = getStorage();
 const createEvent = async (req, res) => {
    try{
      
        const body = req.body;
        const imageName = req.file.filename;
        const dateTime = Date.now().toLocaleString();

        const storageRef = ref(storage, `Images/${req.file.filename + "       " + dateTime}`);
        console.log(storageRef, typeof(storageRef));
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);
        const event = new Event({...body, image: downloadURL, time: {start_time: body.start_time, end_time: body.end_time}, location: {isOnline: body.isOnline, event_location: body.event_location, url: body.url}, price: {ticket_price: body.ticket_price}, contact: {twitter: body.twitter, whatsapp: body.whatsapp, instagram: body.instagram}});
        await event.save(); 
        const events = await Event.find();
      return  res.status(200).json({status: "SUCCESS",
            data: events
        });
    }catch (err){
        console.log(err.message);
      return   res.json({
            status: "FAILED",
            data: err.message
         })
         
    }
 }

//GET EVENTS
const getEvents = async (req, res) => {
    try{
        const events = await Event.find();
        res.status(200).json({
            status: "SUCCESS",
            data: events
        });
    }catch(err){
        res.status({
            status: "FAILED",
            data: err.message
        });
    }
}


const deleteEvent = async (req, res) => {
    try{
        const {_id, userId} = req.params;
        const eventValid = await Event.find({_id});
        if(eventValid.length === 0){
            return res.json({
                status: "FAILED",
                data: "Event doesn't exist"
            })
        }
        if(userId !== eventValid[0].creatorId){
            return res.json({
                status: "FAILED",
                 data: "You are not authorized to delete this event."
            })
        }
        const fileRef = ref(storage, eventValid[0].image)
        await deleteObject(fileRef);
      await Event.findByIdAndDelete(_id);`````````````````````` 
         const events = await Event.find();
         res.json({status: "SUCCESS", data: events});
    }catch (err){
        return res.status(400).json({
            status: "FAILED",
            data: err.message
        })
    }
  
}
module.exports = {createEvent, getEvents, deleteEvent};