 require("parramato").Server({
     root: "https://development.jubi.ai/usaidWeb/",
     socketDomain: 'wss://development.jubi.ai',
     socketLocalPath: '/socket',
     socketPath: '/usaidWeb/socket',
     httpPort: 8192,
     cluster: false,
     // dbUri: 'mongodb://jubi:jubi@uatmongo.parramato.com:27017/rel',
     dbUri: "127.0.0.1: 27017",
     staticDirectory: __dirname + "/static",
     adapterPath: "/adapter",
     adapterDirectory: __dirname + "/adapter",
     projectId: "Alpha Version_586886576888",
     dashbotKey: "",
     directMultiplier: 1,
     fallbackMultiplier: 0.8,
     passphraseMiddleware: "YGUYGgyjgblgUGIYGIGkwhbiuashbo98u9283hr9h24rqIYGI932kbidbiadsYE",
     timeoutSeconds: 60,
     fcmServerKey: "AAAAYTZC9WQ:APA91bFRmKa",
     firebaseWebConfig: {
         apiKey: "sd-ZrO9xKQ",
         authDomain: "on-f31.firebaseapp.com",
         databaseURL: "https://on-f31.firebaseio.com",
         projectId: "on-f31",
         storageBucket: "",
         messagingSenderId: "4175221234234"
     }
 }, () => {
     //TO DO AFTER INITIALIZATION
 })

 // require("parramato").Server({
 //     root:"https://development.jubi.ai/usaid",
 //     socketLocalPath: '/socket',
 //     httpPort: process.argv[2],
 //     cluster:true,
 //     redis:{
 //         host : '127.0.0.1',
 //         port : 6379
 //     },
 //     dbUri:'mongodb+srv://usaid:bTN2uss5bXXfNUQk@proddb-sy1qy.mongodb.net/usaid?retryWrites=true&w=majority',
 //     staticDirectory:__dirname+"/static",
 //     adapterPath:"/adapter",
 //     adapterDirectory:__dirname+"/adapter",
 //     projectId:"Alpha Version_586886576888",
 //     dashbotKey:"ZZNOBoHEsUlaNuSBupOZhAeWKWKvqAWZvQcVocVZ",
 //     directMultiplier:1,
 //     fallbackMultiplier:0.8,
 //     passphraseMiddleware:"YGUYGgyjgblgUGIYGIGkwhbiuashbo98u9283hr9h24rqIYGI932kbidbiadsYE",
 //     timeoutSeconds:60,
 //     fcmServerKey:"AAAAYTZC9WQ:APA91bFRmKa",
 //     firebaseWebConfig:{
 //         apiKey: "sd-ZrO9xKQ",
 //         authDomain: "on-f31.firebaseapp.com",
 //         databaseURL: "https://on-f31.firebaseio.com",
 //         projectId: "on-f31",
 //         storageBucket: "",
 //         messagingSenderId: "4175221234234"
 //     }
 // },()=>{
 //     //TO DO AFTER INITIALIZATION
 // })