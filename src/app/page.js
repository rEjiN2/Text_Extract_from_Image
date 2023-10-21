"use client"
import React, {
  useEffect,
  useState
} from 'react';
import Dropzone from 'react-dropzone-uploader';
const { createWorker } = require('tesseract.js');

export default function Home() {


  const [text, setText] = useState(null);
  const [document , setDocument] = useState("")
  const [id , setId] = useState("")
  const [name , setName] = useState("")
  const [imageUrl] = useState(null);


  useEffect(() => {
      if (imageUrl != null) {
          ExtractTextFromImage();
      }
  });

  const worker = createWorker({
      logger: (m) => console.log(m),
  });

  const ExtractTextFromImage = async (imageUrl) => {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
          data: {
              text
          },

      } = await worker.recognize(imageUrl);
      setText(text);
      await worker.terminate();
      const lines = text.split('\n');
    if (lines.length >= 3) {
      setDocument(lines[0]);
      setId(lines[1]);
      setName(lines[2]);
    }
  };


  const getUploadParams = () => {
      return {
          url: 'https://httpbin.org/post'
      }
  }

  const handleChangeStatus = ({
      meta
  }, status) => {
      if (status === 'headers_received') {
          alert("Uploaded");
          setText("Reconizing...");
          ExtractTextFromImage(meta.previewUrl);
      } else if (status === 'aborted') {
          alert("Something went wrong")
      }
  }


  return (
   <div>
    
        <nav className = "navbar navbar-light bg-light justify-content-center mt-3" >
        <a className = "navbar-brand" href = "/" > React OCR </a><br/ >
        <p> Optical Character Recognition with React and Tesseract.js </p>  
        </nav >


        <Dropzone getUploadParams = {
            getUploadParams
        }
        onChangeStatus = {
            handleChangeStatus
        }
        maxFiles = {
            1
        }
        multiple = {
            false
        }
        canCancel = {
            false
        }
        accept = "image/jpeg, image/png, image/jpg"
        inputContent = {
            (files,extra) => (extra.reject ? 'Only PNG and JPG Image files are allowed' : 'Drop  image here')
        }
        styles = {
            {
                dropzoneActive: {
                    borderColor: 'green'
                },
                dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
                    inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
            }
        }
        /> 
         {/* <div className = "container text-center pt-5" > {
            text
        } </div>  */}
        <div className="container">
        <div><strong>Document:</strong> {document}</div>
        <div><strong>ID:</strong> {id}</div>
        <div><strong>Name:</strong> {name}</div>
      </div>
   </div>
  )
}
