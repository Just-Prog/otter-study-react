import {fileExt2Icons} from "@/components/common/otter_common_define.js";
import {CloudDownloadOutlined} from "@ant-design/icons";
import api from "@/api/api.jsx";

function FileItem({imgh=20, filename = "default.bin", ext = "bin", url = ""}){
    return <>
        <div style={{display: "flex", flexDirection: "row", height: imgh + 5, alignItems: "center", width:"100%",}}>
            <img height={imgh} src={fileExt2Icons(ext)} />
            <div style={{flex:1, paddingLeft: "5px", paddingRight: "5px", overflowX:"hidden",textOverflow:"ellipsis", whiteSpace:"nowrap",fontSize:imgh-7}}>
                {filename}
            </div>
            <div>
                <CloudDownloadOutlined onClick={async()=>{
                    if(url.includes("obs.goktech.cn") && import.meta.env.DEV){
                        url = `/obs/${url.split("https://obs.goktech.cn/")[1]}`;
                    }
                    let resp = await api.get(url,{
                        baseURL: null,
                        responseType: 'blob'
                    });
                    const href = URL.createObjectURL(resp.data, { type: resp.headers['content-type'] });
                    let link = document.createElement('a');
                    link.download = filename;
                    link.href = href;
                    link.click();
                    URL.revokeObjectURL(href);
                }}/>
            </div>
        </div>
    </>
}

export default FileItem;