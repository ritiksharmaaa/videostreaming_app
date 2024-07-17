//  this is a a utilty based middleware which save file in our destination and provide file url it help to just easily use in our url function 

import multer  from "multer";
const diskStorage = multer.diskStorage({
    destination : function (req , file , cb){
        cb(null  , "./public/temp")
    },
    filename : function(req , file , cb){
        // in fil eobject you get so many thing you just check it .
        const uniqueSuffix = DATE.now() + '-' + Math.round(Math.random() * 1E9 )
        cb(null , file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({diskStorage : diskStorage })

export {
    upload 
};