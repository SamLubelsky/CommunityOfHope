export const handleError = (throwError: any, responseData: any) => {
    if(throwError){
        console.log("Handling erorr")
        if(responseData.message){   
            console.log("error: ", responseData.message);
            throwError(new Error(responseData.message));    
        }
        if(responseData.error){
            console.log("error: ", responseData.error);
            throwError(new Error(responseData.error));
        } else{
            throwError(new Error("An unknown error occurred"));
        }
    }
}
