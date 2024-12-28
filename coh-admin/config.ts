
const isDevelopment = true;
let BACKEND_URL = "https://api-v4j57qn4oq-uc.a.run.app";
if(isDevelopment){
    BACKEND_URL = "http://localhost:3000";
    // BACKEND_URL = "http://127.0.0.1:5001/fl24-community-of-hope/us-central1/api";
}
export {BACKEND_URL};
// export const BACKEND_URL  ="http://127.0.0.1:5001/fl24-community-of-hope/us-central1/api";
// export const BACKEND_URL = "http://localhost:3000";
// export const BACKEND_URL="https://us-central1-fl24-community-of-hope.cloudfunctions.net/api";  