import axios from 'axios';
import config from './config'

export abstract class postRequest{
    static RESPONSE_KEYS:string[] = [];

    constructor(){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + config.AUTH_TOKEN;
    }

    startPost(queryContent:string,callback:any){
        axios.post(config.URL_PATH, {
            query: queryContent
          })
          .then(function (response) {
            callback(response.data.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    processResponse(response:any){
        postRequest.RESPONSE_KEYS.every(function(keys) {
            response = response[keys];
            return !isArray(response);
        });

        if(isArray(response)){
        response.forEach(element => {
            console.log(element[postRequest.RESPONSE_KEYS[postRequest.RESPONSE_KEYS.length-1]])
        })
        } else console.log(response);
    }

    addResponseKey(keyArray:string[]){
        postRequest.RESPONSE_KEYS = postRequest.RESPONSE_KEYS.concat(keyArray);
    }
}

function isArray(jsonData:JSON) {
    return Object.prototype.toString.call(jsonData) === '[object Array]';
}
