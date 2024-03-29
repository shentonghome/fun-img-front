import React, {useState} from 'react'
import {ImageUploader, Space, Toast, Dialog, Button, Image as ImageAntd} from 'antd-mobile'
import {Divider} from 'antd-mobile'
import {baseUrl} from "./Base";
import {get} from "./utils/request";
import imgzip from "imgzip";

function App() {

  const [fileList, setFileList] = useState([]);

  const [resultImg, setResultImg] = useState(undefined);

  const UPLOAD_API = baseUrl + "/fun-img/upload";

  async function requestFile(file) {

    const imgInfo = await getImgInfo(file);
    let width;
    let height;
    const maxWidth = 640;
    if (imgInfo.width > maxWidth) {
      width = maxWidth;
      height = (maxWidth * imgInfo.height) / imgInfo.width;
    }

    return new Promise((resolve, reject) => {
      let compress = new imgzip({quality: 0.5, width: width, height: height});
      compress.photoCompress(file, (base64) => {
        let blob = imgzip.convertBase64UrlToBlob(base64);
        const formData = new FormData();
        formData.append('file', blob);
        fetch(UPLOAD_API, {
          method: 'post',
          body: formData,
        }).then(response => response.json())
          .then((data) => {
            resolve(data);
          }).catch(e => {
          reject(e);
        });
      })
    });
  }

  const getImgInfo = async (file) => {
    return new Promise((resolve, reject) => {

      let filereader = new FileReader();
      filereader.onload = e => {
        let src = e.target.result;
        const image = new Image();
        image.onload = function () {
          resolve({width: this.width, height: this.height});
        };
        image.onerror = reject;
        image.src = src;
      };
      filereader.readAsDataURL(file);
    })

  };

  const unloadImg = async (file) => {
    const resp = await requestFile(file);
    return {url: resp.data};
  }

  const changeType = async (type) => {

    if (fileList.length < 1) {
      return;
    }
    const url = `${baseUrl}/fun-img/trans?url=${encodeURIComponent(
      fileList[0].url)}&type=${type}`
    const resp = await get(url);
    setResultImg(resp && resp.data ? resp.data : undefined);
  }

  return (
    <div className="App">
      <Space justify='center' block>
        <h1>人像转动漫</h1>
      </Space>
      <Divider/>
      <Space justify='center' block>
        <h5>请上传图片</h5>
      </Space>
      <Space justify='center' block>
        <ImageUploader
          maxCount={1}
          value={fileList}
          onChange={setFileList}
          upload={unloadImg}
        >
        </ImageUploader>
      </Space>
      <br/>
      <div>
        <Space justify='center' block>
          <Button color='primary'
                  onClick={(e) => changeType("anime")}>动漫风</Button>
          <Button color='primary'
                  onClick={(e) => changeType("3d")}>迪士尼风</Button>
          <Button color='primary'
                  onClick={(e) => changeType("handdrawn")}>手绘风</Button>
        </Space>
        <br/>
        <Space justify='center' block>
          <Button color='primary'
                  onClick={(e) => changeType("sketch")}>素描风</Button>
          <Button color='primary'
                  onClick={(e) => changeType("artstyle")}>艺术风</Button>
        </Space>
      </div>
      <br/>
      <div>
        <Space justify='center' block>
          {

            resultImg && <ImageAntd src={resultImg}/>
          }
        </Space>
      </div>
    </div>
  );
}

export default App;
