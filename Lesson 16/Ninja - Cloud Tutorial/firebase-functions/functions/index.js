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


exports.upvote = functions.https.onCall((data,context)=>{

    //check if logged in
    if (!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated', 
            'whoopsie, only authenticated users can upvote '
        );
    }

    //references to both the users votes and the list items

    const user = admin.firestore().collection('users').doc(context.auth.uid);
    const request = admin.firestore().collection('requests').doc(data.id);

    return user.get().then(doc =>{

        if(doc.data().upVotedOn.includes(data.id)){
            throw new functions.https.HttpsError(
                'failed-precondition',
                'Calm down, you already voted'
            );
        }

    return user.update({
        upVotedOn: [...doc.data().upVotedOn, data.id]
    })
    .then(()=>{
        //update votes on the request 
        return request.update({
            upvotes: admin.firestore.FieldValue.increment(1)
        });
    });

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