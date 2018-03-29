import axios from 'axios';
import config from './config'
import { previousRequestData } from './interfaceRequestData';

export abstract class postRequest{

    constructor(){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + config.AUTH_TOKEN;
    }

    async startPost(queryContent:string,responseKeys:string[],callback:any):Promise<string[]>{
        return axios.post(config.URL_PATH, {
            query: queryContent,
          })
          .then(async function (response) {
             return await callback(response.data.data,responseKeys);
            
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    async processResponse(response:any,responseKeys:string[]):Promise<string[]>{
        responseKeys.every(function(keys) {
            response = response[keys];
            return !isArray(response);
        });

        let responseData:string[] = [];
        if(isArray(response)){
            response.forEach(element => {
                responseData = responseData.concat(element[responseKeys[responseKeys.length-1]]);
            })
        } else responseData.push(response);

        return responseData;
    }

    generateRequestDataObject(baseQuery: string,baseResponseKey: string[]): previousRequestData {
        let previousRequest: previousRequestData = {
            baseQuery: baseQuery,
            responseKeys: baseResponseKey,
        }

        return previousRequest;
    }

    generateBaseResponseKeys(previousBaseResponseKey: string[], baseResponseKey: string[]): string[] {
        return previousBaseResponseKey.concat(baseResponseKey);
    }

    generateBaseQuery(previousBaseQuery: string, baseQuery: string): string {
        return previousBaseQuery.replace("insertHere", baseQuery);
    }
}

function isArray(jsonData:JSON):boolean {
    return Object.prototype.toString.call(jsonData) === '[object Array]';
}
