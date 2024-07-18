export {ApiResponse };

class ApiResponse{
    constructor(this , data , message , statusCode ){
        this.message = message 
        this.statusCode = statusCode 
        this.data = data 
        
    }
}