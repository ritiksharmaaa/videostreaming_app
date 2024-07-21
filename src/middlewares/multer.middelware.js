//  this is a a utilty based middleware which save file in our destination and provide file url it help to just easily use in our url function 

import multer  from "multer";
import path from "path"; 



const storage = multer.diskStorage({
    destination : function (req , file , cb){
        cb(null  , 'public/uploads')
    },
    filename : function(req , file , cb){
        // in fil eobject you get so many thing you just check it .
        // const uniqueSuffix = new DATE.now() + '-' + Math.round(Math.random() * 1E9 )
        // cb(null , file.fieldname + '-' + uniqueSuffix)
        cb(null , file.originalname)
    }
})

const upload = multer({ storage : storage })

export {
    upload 
};