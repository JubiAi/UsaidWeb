
        importScripts("https://www.gstatic.com/firebasejs/5.7.2/firebase-app.js")
        importScripts("https://www.gstatic.com/firebasejs/5.7.2/firebase-messaging.js")

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
            .catch(err => console.error(err));

          function runFirebase(){
            return new Promise(async (resolve,reject)=>{
                try{
                    firebase.initializeApp(config);
                    const messaging = firebase.messaging();
                    messaging.setBackgroundMessageHandler(function(payload) {
                      var notificationTitle = 'Got a new Message';
                      var notificationOptions = {
                        body: 'Click to open',
                        icon: 'https://parramato.com/auth-view/assets/images/parrot_loader.gif'
                      };

                      return self.registration.showNotification(notificationTitle,
                        notificationOptions);
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

    
    