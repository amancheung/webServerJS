// webby.js
const net = require('net');
const path = require('path');
const fs = require('fs');


//Object that maps status code to response
HTTP_STATUS_CODES= {
  200: "OK",
  404: "Not Found",
  500: "Internal Server Error"
},

//Object that maps file extension to file type
MIME_TYPES= {
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "png": "image/png",
  "html": "text/html",
  "css": "text/css",
  "txt": "text/plain"
},

//Function that retrieve file extension from file name
getExtension= function(fileName){
  fileExtension = fileName.split(".");
  if (fileExtension.length>1){
    return fileExtension[fileExtension.length-1];
  } else {
    return '';
  }
},

//Function that returns file type of file extension (if extension if valid)
getMIMEType= function(fileName){
  fileExtension = getExtension(fileName);
  if (fileExtension!=''){
    return MIME_TYPES[getExtension(fileName)];
  } else {
    return fileExtension;
  }
},

//Class that parses out method and path from http request
Request= class{
  constructor(httpRequest){
    const [method, path, ...elseInfo] = httpRequest.split(" ");
    this.method = method;
    this.path = path;
  }
},

/*Class that represents the web application
  1. Accepts and parse http request
  2. Hold http method and path combos
  3. Optionally call middleware if it exists
  4. Or determine what to do with incoming request path
  5. Send back valid http response
*/
App= class{
  //Creates and initializes application
  constructor (){
    this.server = net.createServer(sock => this.handleConnection(sock));
    this.routes = {};
    this.middleware = null;
  };

  //Function takes path and normalizes casing and trailing slash
  //Also removes query string if present
  normalizePath(inPath){
    inPath = inPath.toLowerCase();
    inPath = inPath.split("?")[0].split("#")[0].split("/");
    return "/"+inPath[1];
  };

  //Function that takes http method and path
  //Return string rep. of the parameters for ROUTES property
  createRouteKey(method, path){
    return `${method.toUpperCase()} ${this.normalizePath(path)}`;
  };

  //Function that puts callback function of key (from path)
  //into routes property
  get (path, cb){
    const key = this.createRouteKey("get", path);
    this.routes[key] = cb;
  };

  //Function that sets middleware to app
  use (cb) {
    this.middleware = cb;
  };

  //Function that calls listen function from server with set parameters
  listen (port, host) {
    this.server.listen(port, host);
  };

  //Function that handles connection
  handleConnection(sock) {
    sock.on("data", (binaryData) => {this.handleRequest(sock, binaryData)});
  };

  //Function that handles request
  handleRequest(sock, binaryData){
    const s = binaryData.toString();
    const req = new Request(s);
    const res = new Response(sock);
    if (this.middleware!==null){
      this.middleware(req, res, this.processRoutes(req,res));
    } else {
      this.processRoutes(req, res);
    }
  };

  //Function that processes routes
  processRoutes(req, res){
    const key = this.createRouteKey(req.method, req.path);
    if (this.routes[key]!==undefined){
      this.routes[key](req, res);
    } else {
      res.status(404);
      res.send("Page not found\n");
    }
  };

},

//Response class
Response = class {
  constructor(socket, statusCode, version) {
    this.sock = socket;
    this.headers = {};
    this.body = "";
    this.version = "HTTP/1.1";
    this.statusCode = 200;
    if (version!==undefined)
      this.version = version;
    if (statusCode!==undefined)
      this.statusCode = statusCode;
  };

  //Function that sets headers objects
  set(name, value) {
    this.headers[name] = value;
  };

  //Function that ends connection with Server
  end() {
    this.sock.end("Connection has ended!");
  };

  //Function that outputs status
  statusLineToString() {
    return `${this.version} ${this.statusCode} ${HTTP_STATUS_CODES[this.statusCode]}`+"\r\n";
  };

  //Function that outputs headers
  headersToString() {
    let headers = "";
    for (let h in this.headers) {
      if (this.headers.hasOwnProperty(h)) {
        headers+= h+": "+this.headers[h]+"\r\n";
      }
    }
    return headers;
  };

  //Function that sets body of response obj
  send(body) {
    this.response = body;
    this.sock.write(this.statusLineToString());
    this.sock.write(this.headersToString());
    this.sock.write("\r\n");
    this.sock.write(body);
    this.end();
  };

  //Functio that sets status code and return new response obj
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  };

},

//A middleware function that serves the file if it exists
serveStatic= function(basePath){
   const f = function(req, res, next) {
                  const fn = path.join(basePath, req.path);
                  const contentType = this.getMIMEType(req.path);
                  res.set('Content-Type', contentType);
                  fs.readFile(fn, (err, data) => {
                    if (err) {
                      next.bind(req, res);
                    } else {
                      res.send(data);
                    }
                  });
  };
  return f;
},

//};

//module.exports = webFrameWork;

module.exports = {
  HTTP_STATUS_CODES: HTTP_STATUS_CODES,
  MIME_TYPES: MIME_TYPES,
  getFileExtension: getExtension,
  getMIMEType: getMIMEType,
  Request: Request,
  App: App,
  Response: Response,
  static: serveStatic,
}
//module.exports webFrameWork.serveStatic as static;
