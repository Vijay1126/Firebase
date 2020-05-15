const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const registerForm = document.querySelector('.register');
const loginForm = document.querySelector('.login');
const signOut = document.querySelector('.sign-out');

authSwitchLinks.forEach(link => {
    link.addEventListener('click',() => {
        authModals.forEach(modal => modal.classList.toggle('active'));
    });
});


registerForm.addEventListener('submit',(e) => {
    e.preventDefault();
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    console.log(email,password);

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
                console.log('Registered',user);
                registerForm.reset()
        })
        .catch((error) => {
            registerForm.querySelector('.error').textContent = error.message;
        })
})

loginForm.addEventListener('submit',(e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    console.log(email,password);

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
                console.log('Logged In',user);
                loginForm.reset()
        })
        .catch((error) => {
            loginForm.querySelector('.error').textContent = error.message;
        })
})


firebase.auth().onAuthStateChanged((user)=>{
    if (user){
        authWrapper.classList.remove('open');
        authModals.forEach(modal => modal.classList.remove('active'));
    }else {
        authWrapper.classList.add('open')
        authModals[0].classList.add('active')
    }
})

signOut.addEventListener('click',()=>{

        firebase.auth().signOut()
            .then(()=> console.log('signed out'))
})