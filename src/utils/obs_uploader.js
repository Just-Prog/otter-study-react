import userStore from "@/stores/user.jsx";

import ObsClient from 'esdk-obs-browserjs';
import {YYYYMMDDHHMMSS} from "@/utils/date_format.js";

class OBSUploader{
    constructor() {
        this.oss = userStore.getState().user.oss.hwyunStorageConfigRes;
        this.hwcObsClient;
        this.initHWCObsClient();
    }
    initHWCObsClient() {
        this.hwcObsClient = new ObsClient({
            access_key_id: this.oss.accessKeyId,
            secret_access_key: this.oss.accessKeySecret,
            server: import.meta.env.DEV ? "http://localhost:5174/" : this.oss.endpoint,     // 本地起了一个express服务器转发
            is_cname: 0,
            bucketName: this.oss.bucketName
        });
    }
    upload(file, onProgress = (a,t)=>{}, onSuccess = ()=>{}, onError = ()=>{}) {
        let now = new Date();
        let key = YYYYMMDDHHMMSS(now) + "." + file.name.split('.').slice(-1)[0];
        this.hwcObsClient.uploadFile({
            Bucket: this.oss.bucketName,
            Key: key,
            SourceFile: file,
            ProgressCallback: onProgress,
        }, function(err, result){
            if(err){
                console.error("Error-->" + err);
            }else {
                 console.log('Status-->' + result.CommonMsg.Status);
                 if (result.CommonMsg.Status < 300 && result.InterfaceResult) {
                        console.log('RequestId-->' + result.InterfaceResult.RequestId);
                 }
            }
        });
    }
}

export default OBSUploader;