const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


// Auth Trigger - New User Sign Up

exports.newUserSignUp = functions.auth.user().onCreate((user) => {
    admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        upVotedOn: []
    });
});

exports.userDeleted = functions.auth.user().onDelete((user)=>{  
    const doc = admin.firestore().collection('users').doc(user.uid);
    return doc.delete();
});


exports.addRequest = functions.https.onCall((data, context) => {

     if (!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated', 
            'whoopsie, only authenticated users can add requests'
        );
     }

     if (data.text.length>30){
        throw new functions.https.HttpsError(
            'invalid-argument', 
            'clam down, keep it shorter than 30 yo'
        );
     }
     
    return admin.firestore().collection('requests').add({
        text: data.text,
        upvotes: 0,
     })
     .then(()=>{
        return 'new request added';
     })
     .catch(()=>{
         throw new functions.https.HttpsError(
             'internal',
             'request not added'
         );
     });
});

















//http request
// exports.randomNumber = functions.https.onRequest((request, response) =>{
    
//     const number = Math.round(Math.random() * 100)
//     response.send(number.toString());

// });

// exports.toYouTube = functions.https.onRequest((request, response) =>{
    
//     response.redirect('https://www.youtube.com');

// });

// //http callable function

// exports.sayHello  = functions.https.onCall((data, context) =>{
//     const name = data.name
//     return `Hello, ${name}`;
// });