import axios from 'axios';

export abstract class postRequest{
    readonly URL:string = "https://api.github.com/graphql";
    readonly AUTH_TOKEN:string = "f89557ab7f9177fd278451e1e4b2a52b445eb8f0";
    static RESPONSE_KEYS:string[] = [];

    constructor(){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.AUTH_TOKEN;
    }

    startPost(queryContent:string,callback:any){
        axios.post(this.URL, {
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

    addResponseKey(key:string){
        postRequest.RESPONSE_KEYS.push(key);
    }
}

function isArray(jsonData:JSON) {
    return Object.prototype.toString.call(jsonData) === '[object Array]';
}
