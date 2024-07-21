export {ApiResponse };

class ApiResponse{
    constructor( data , message , statusCode ){
        this.message = message 
        this.statusCode = statusCode 
        this.data = data 
        
    }
}