export {ApiResponse };

class ApiResponse{
    constructor(this , message , statusCode , data ){
        this.message = message 
        this.statusCode = statusCode 
        this.data = data 
        
    }
}