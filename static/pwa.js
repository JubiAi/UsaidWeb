
    if("serviceWorker" in navigator){
        try{
            send();

        }
        catch(e){
            console.log(e);
        }
    }


    

    async function send() {
        const register = await navigator.serviceWorker.register("sw.js", {
            scope: "/"
        });

    }



  // Initialize Firebase
      const config = {
        apiKey: "AIzaSyAAqVdFN_8wbXK4W_YLZj2q6rF-ZrO9xKQ",
        authDomain: "push-notification-f31b9.firebaseapp.com",
        databaseURL: "https://push-notification-f31b9.firebaseio.com",
        projectId: "push-notification-f31b9",
        storageBucket: "",
        messagingSenderId: "417522185572"
      };

        runFirebase()
        .then(runSubscription)
        .catch(err => console.error(err));

      function runFirebase(){
        return new Promise(async (resolve,reject)=>{
            try{
                firebase.initializeApp(config);
                const messaging = firebase.messaging();
                await messaging.requestPermission()
                messaging.onMessage(function(payload){
                    console.log("onMessage: ",payload)
                });
                let token = await messaging.getToken()
                // console.log(token)
                return resolve(token)
            }
            catch(e){
                console.log(e)
                return reject(e)
            }
        })
          
    }

    function runSubscription(firebaseToken){
        if(window.subscriptionForWebId.getWebId()){
            console.log("Subscribed")
            subscribeForPushNotification(window.subscriptionForWebId.getWebId(),firebaseToken);
        }
        else{
            setTimeout(()=>{
                    runSubscription(window.subscriptionForWebId.getWebId(),firebaseToken)
            },2000);
        }
    }

    

    async function subscribeForPushNotification(webId,firebaseToken){

        let data={
            id:webId,
            socketId:window.socketId,
            firebaseToken:firebaseToken
        }
        await fetch('https://development.jubi.ai/usaid/subscribeForPush', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'

            },
            mode:"no-cors",
            credentials: 'omit'  
        });
    }


    


    