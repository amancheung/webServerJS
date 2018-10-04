// webby.js

const webFrameWork = {

  //Object that maps status code to response
  HTTP_STATUS_CODES: {
    200: "OK",
    404: "Not Found",
    500: "Internal Server Error"
  },

  //Object that maps file extension to file type
  MIME_TYPES: {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "html": "text/html",
    "css": "text/css",
    "txt": "text/plain"
  },

  //Function that retrieve file extension from file name
  getExtension: function(fileName){
    fileExtension = fileName.split(".");
    if (fileExtension.length>1){
      return fileExtension[fileExtension.length-1];
    } else {
      return '';
    }
  },

  //Function that returns file type of file extension (if extension if valid)
  getMIMEType: function(fileName){
    fileExtension = getExtension(fileName);
    if (fileExtension!=''){
      return MIME_TYPES[getExtension(fileName)];
    } else {
      return fileExtension;
    }
  },

  

};

module.exports = webFrameWork;
