export  { ApiError };

class ApiError extends Error {
    constructor(
        statusCode ,
        message = "Something went wrong",
        errors  = [],
        stack = " " // mean a bunch of erron in stack / queue 

    ){
        super(message)
        this.statusCode = statusCode 
        this.errors = errors  
        // this.stack = stack 
        this.data = null ; 
        this.message = message 
        this.success = false ;
        if (stack){
            this.stack = stack 
        }
        else{
            Error.captureStackTrace(this , this.constructor )
        }
    }



        
}

