export const handleError = (throwError: any, responseData: any) => {
    if(throwError){
        if(responseData.message){   
            throwError(new Error(responseData.message));    
        }
        if(responseData.error){
            throwError(new Error(responseData.error));
        } else{
            throwError(new Error("An unknown error occurred"));
        }
    }
}
