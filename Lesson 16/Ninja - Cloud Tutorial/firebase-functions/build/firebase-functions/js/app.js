
const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');
const newRequestForm = document.querySelector('.new-request form')

// open request modal
requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
});

// close request modal yoooo
requestModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.remove('open');
  }
});


// add a new request
newRequestForm.addEventListener('submit',(e)=> {
  e.preventDefault();
  const addRequest = firebase.functions().httpsCallable('addRequest');
  addRequest({
    text : newRequestForm.request.value,
  })
  .then(() =>{
    newRequestForm.reset();
    requestModal.classList.remove('open');
    newRequestForm.querySelector('.error').textContent = "";
  })
  .catch((error)=>{
    newRequestForm.querySelector('.error').textContent = error.message;
  });
});


//notification


const notification = document.querySelector('.notification');

const showNotification = (message) =>{
  notification.textContent = message
  notification.classList.add('active');
  setTimeout(()=>{
    notification.classList.remove('active');
    notification.textContent ='';
  },4000);
}
