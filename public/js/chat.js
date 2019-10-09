let socket = io();


//TAMPLATES
const $ownMessageTemplates   = document.querySelector('#own-message-templates').innerHTML
const $otherMessageTemplates = document.querySelector('#other-message-templates').innerHTML
const $userListTemplates     = document.querySelector('#user-list-templates').innerHTML


//ELEMENTS
const $header                = document.querySelector('header')
const $input                 = document.querySelector('.writting-section__input')
const $messageSection        = document.querySelector('.display')
let $userlist                = document.querySelector('.user-list')
const $form                  = document.querySelector('.writting-section__form')


const queryObject    = Qs.parse(window.location.search,{ignoreQueryPrefix: true})


$form.addEventListener('submit',(e)=>{
    e.preventDefault()

    let message = e.target.elements[0].value                                // checking and clearing message 
    if(!message) return;
    e.target.elements[0].value = "";
 
    time = moment(new Date().getTime()).format('h:mm a');

    socket.emit('send',{message,time,...queryObject},()=>{  
        const html = Mustache.render($ownMessageTemplates,{message,time})
        $messageSection.insertAdjacentHTML('afterbegin',html)
    })
})


//SOCKET FUNCTIONS
const receive =  (message)=>{
    const html = Mustache.render($otherMessageTemplates,message )
    $messageSection.insertAdjacentHTML('afterbegin',html)
}

const listUpdate = (userlist)=>{
    userlist = userlist.filter(user=>user.username !== queryObject.username.trim().toLowerCase())
    $userlist = document.querySelector('.user-list');
    $userlist.remove()
    const html = Mustache.render($userListTemplates,{userlist});
    $header.insertAdjacentHTML('afterbegin',html)
}


//SOCKET LISTNERS
socket.emit('join',queryObject,(error)=>{ if(error){alert(error); location.href='/'}})
socket.on('receive',receive)
socket.on('listUpdate',listUpdate)

