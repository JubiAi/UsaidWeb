 require("parramato").Server({
    root:"https://development.jubi.ai",
    socketLocalPath: '/usaidWeb/socket',
    httpPort: 8192,
    cluster:false,
    dbUri:'mongodb://jubi:jubi@uatmongo.parramato.com:27017/rel',
    staticDirectory:__dirname+"/static",
    adapterPath:"/adapter",
    adapterDirectory:__dirname+"/adapter",
    projectId:"usaidWeb_353553876735",
    // dashbotKey:"VxtYPVW6168LIiXwqpIku9wE",
    directMultiplier:1,
    fallbackMultiplier:0.8,
    passphraseMiddleware:"YGUYGgyjgblgUGIYGIGkwhbiuashbo98u9283hr9h24rqIYGI932kbidbiadsYE",
    timeoutSeconds:60,
    fcmServerKey:"AAAAYTZC9WQ:APA91bFRmKa",
    firebaseWebConfig:{
        apiKey: "sd-ZrO9xKQ",
        authDomain: "on-f31.firebaseapp.com",
        databaseURL: "https://on-f31.firebaseio.com",
        projectId: "on-f31",
        storageBucket: "",
        messagingSenderId: "4175221234234"
    }
},()=>{
    //TO DO AFTER INITIALIZATION
})