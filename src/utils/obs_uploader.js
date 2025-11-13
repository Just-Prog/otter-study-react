import ObsClient from "esdk-obs-browserjs";
import api from "@/api/api.jsx";
import userStore from "@/stores/user.jsx";
import { YYYYMMDD } from "@/utils/date_format.js";

class OBSUploader {
  constructor() {
    this.oss = userStore.getState().user.oss.hwyunStorageConfigRes;
    this.hwcObsClient;
    this.initHWCObsClient();
  }
  initHWCObsClient() {
    this.hwcObsClient = new ObsClient({
      access_key_id: this.oss.accessKeyId,
      secret_access_key: this.oss.accessKeySecret,
      server: import.meta.env.DEV
        ? "http://localhost:5174/"
        : this.oss.endpoint, // 本地起了一个express服务器转发
      is_cname: 0,
      bucketName: this.oss.bucketName,
    });
  }
  endpointCustom() {
    return this.oss.endpointCustom;
  }
  upload({
    file,
    onProgress = () => {},
    onSuccess = () => {},
    onError = () => {},
  }) {
    const now = new Date();
    const key =
      YYYYMMDD(now) +
      now.getTime() +
      "-goktech." +
      file.name.split(".").slice(-1)[0];
    this.hwcObsClient.uploadFile(
      {
        Bucket: this.oss.bucketName,
        Key: key,
        SourceFile: file,
        ProgressCallback: onProgress,
      },
      (err, result) => {
        if (err) {
          console.error("Error-->" + err);
          onError(err);
        } else {
          console.log("Status-->" + JSON.stringify(result));
          onSuccess(result);
        }
      }
    );
  }
}

const saveDoc = async ({ docName, pathKey, size }) => {
  const resp = await api.post("/tc/doc/saveDoc", {
    pathKey,
    docName,
    size,
  });
  return resp;
};
export default OBSUploader;

export { saveDoc };
