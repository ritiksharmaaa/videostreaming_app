export {asyncHandler}


//  we have to standarize api response as well as there error 

const asyncHandler = (fn)=> async (req , res , next)=>{
    try {
        await fn( req , res , next)
        
    } catch (error) {
        res.status(error.code || 500).json({
            success : false ,
            message : error.message
        })
    }


}
