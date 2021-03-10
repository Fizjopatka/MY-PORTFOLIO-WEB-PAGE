//VARIABLES
const lightsMap = document.getElementById('lights');
const lightsMap2 = document.getElementById('lights-2');
const keyboardMap = document.getElementById('keyboard');
const plant = document.getElementById('plant');
const lofi = document.getElementById('lofi');
const click = document.getElementById('click');
const lightsSound = new Audio('sounds/lights.mp3');
const keyboardSound = new Audio('sounds/keyboard.mp3');
const lofiSound = new Audio('sounds/lofi-music.mp3');
const sendMessage = document.getElementById('send-message');
const assistantMessage = document.getElementById('assistant-message');
const xInterface = document.getElementById("x-interface");
let canIclick = true;
let firstLofi = true;
let lofiPlay = true;
let assistantStarted = false;
let lights 
let write 

//LISTENERS
[lightsMap, lightsMap2].forEach(button => button.addEventListener('click', ()=> {
    lightsSound.play();
    lightTurning()
}));
keyboardMap.addEventListener('click', ()=> {
    assistantStarted ? isStarted() : isNotStarted();
    function isStarted() {
        $('.chat-window').css('opacity', '1');
        $('.chat-window').css('visibility', 'visible');
    };
    function isNotStarted() {
        keyboardSound.play();
        window.setTimeout(()=>{ alert("hello world")}, 1900);
    };
});
xInterface.addEventListener('click', ()=> {
    $('.chat-window').css('opacity', '0');
    window.setTimeout(()=>{$('.chat-window').css('visibility', 'hidden');}, 500);
})
lofi.addEventListener('click', ()=> {
    firstLofi ? firstStart() : checkPlay();
    function firstStart() {
        $('#lofi-red').css('opacity', '0');
        lofiSound.play();
    };
    function checkPlay() {
        lofiPlay ? pauseIt() : playIt();
        function pauseIt(){
            $('#lofi-pause').css('opacity', '100');
            window.setTimeout(()=>{$('#lofi-play').css('opacity', '100');}, 300);
            lofiSound.pause();
            lofiPlay = false;
        };
        function playIt() {
            $('#lofi-pause').css('opacity', '0');
            window.setTimeout(()=>{$('#lofi-play').css('opacity', '0');}, 300);
            lofiSound.play();
            lofiPlay = true;
        };
    }
    firstLofi = false;
});
click.addEventListener('mouseover', ()=> {
    $('#click-to-start-hover').css('opacity', '1');
});
click.addEventListener('mouseout', ()=> {
    $('#click-to-start-hover').css('opacity', '0');
});
click.addEventListener('click', ()=> {
    assistantStarted ? null : startAssistantAnimation();
});
plant.addEventListener('click', ()=>{window.setTimeout(()=>{window.open('https://pl.wikipedia.org/wiki/Maranta', '_blank')}, 500)});
sendMessage.addEventListener('click', ()=> {canIclick ? sendInput() : null});
window.addEventListener('keydown', (event) => { 
    if (event.keyCode === 13){
        canIclick ? sendInput() : null;
    }; 
});

//FUNCTIONS
function lightTurning(){
    lights ? off() : on();
    //FUNCTIONS
    function off() {
        $('#background-2').css('opacity', '1');
        lights = false;
    };
    function on() {
        $('#background-2').css('opacity', '0');
        lights = true;
    };
};
function canITurnLights(){
    const date = new Date();
    const hour = date.getHours();

    if(hour > 17 ||(hour > 0 && hour < 8)) {
        lights = true;
    } else {
        lights = false;
    };
};
//CHAT FUNCTION 
window.addEventListener('load', ()=> {
    fetch("json/chat.json")
        .then(response => response.json())
        .then(data => {
            chatData = data.chat;
        });
    }
);
function answeringChat(input){
    const FIRST_MESSAGE = "Uruchamianie zakończone sukcesem. <br> Jestem asystentką Patrycji i z przyjemnością odpowiem w jej imieniu na Twoje pytania. <br> Aby otworzyć okno czatu kliknij na klawiaturę."
    const WRONG_QUESTION = 'Chyba nie zrozumiałam...';
    const EMPTY_MESSAGE = "Co tak milczysz? No weź, zapytaj mnie o coś.";
    const actionFunctions = new Array(noaction, noaction, action2, action3, noaction, noaction);
    let chatDataAnswer = "";
    let x = 0;
    let i = 0;
    input = input.toLowerCase();
    assistantMessage.innerHTML = "";

    checkingData();
    function checkingData (){
        if (input) {
            chatDataAnswer = WRONG_QUESTION;
        } else {
            assistantStarted ?  chatDataAnswer = EMPTY_MESSAGE : chatDataAnswer = FIRST_MESSAGE;
            assistantStarted = true;
        }
        chatData.forEach(()=> {
            chatData[x].tags.forEach((item)=> {
                if (input.includes(item)) {
                    actionFunctions[x]();
                    return chatDataAnswer = chatData[x].answer;
                };
            });
            x++
        });
    };
    //ACTION FUNCTIONS
    function noaction(){
        null;
    };
    function action2() {
        lights = true;
        lightTurning();
    };
    function action3() {
        lights = false;
        lightTurning();
    };
    //WRITING FUNCTION
    write = setInterval(()=>{
        const inscription = chatDataAnswer;
        const messageContainer = document.getElementById("assistant-message");

        canIclick = false;
        html="<";
        if (i<inscription.length) {
            if (inscription.substr(i, 1)==" ") {
            messageContainer.innerHTML+=inscription.substr(i, 1);
            i++;
        };
        if (inscription.substr(i, 1)=="<") {
            i++;
            while(inscription.substr(i, 1)!=">") {
            html+=inscription.substr(i, 1);
            i++;
            };
            html+=">"
            messageContainer.innerHTML+=html;
            i++;
        };
        messageContainer.innerHTML+=inscription.substr(i, 1);
        } else {
        clearInterval(write);
        canIclick = true;
        };
        ++i;
    }, 70);
};
function sendInput(){
    const inputMessage = document.getElementById('input-message');

    document.getElementById('printed-message').innerHTML = `<b>Ty</b>: ${inputMessage.value}`;
    answeringChat(inputMessage.value);
    inputMessage.value = '';
};
//GSAP ANIMATIONS 
function startAnimation() {
    const tl = gsap.timeline({defaults: {ease: 'power3.out'}});
    const INIT1 = 'init1';

    tl.to($('#start-animation') , 1, {delay: 1, ease: 'slow(0.7, 0.7, false)', autoAlpha: 0, display:'none'});
    tl.to('#lofi', {duration: 1, opacity:0}, INIT1);
    tl.to('#click', {duration: 1, opacity:0}, INIT1);
};
function assistantRingAnimation() {
    const tl = gsap.timeline({defaults: {ease: 'power1.out'}});

    $('#assistant-ring').css('visibility', 'visible');
    tl.to('#assistant-ring', {duration: 3, repeat: -1, scale: 0.4})

};
function startAssistantAnimation() {
    const tl = gsap.timeline({defaults: {ease: 'power1.out'}});
    const CIRCLE = 'circle';
    const INIT = 'init';
    const INIT2 = 'init2';
    const INIT3 = 'init3';
    const INIT4 = 'init4';

    window.setTimeout(()=> {
        $('#asyst-wake').css('display', 'inline-block');
        $('.output-container').css('visibility', 'visible');
        $('.click').removeClass('map-button-hover');
    }, 2000);
    tl.to($('#white-start') , 1.5, {ease: 'slow(0.7, 0.7, false)', autoAlpha: 1, display:'flex'});
    tl.to('#circle', {duration: 0.5, opacity:1}, CIRCLE);
    tl.to('#circle', {duration: 1, scale: 90}, CIRCLE);
    tl.to('#circle', {duration: 4}, INIT);
    tl.to('#initializing', {delay: -0.8, duration: 0.5, opacity: 1}, INIT);
    tl.to('#progress-bar-1', {delay: -0.8, duration: 0.2, width: '98%'}, INIT);
    tl.to('#initializing', {duration: 0.2, opacity: 0}, INIT);
    tl.to('#copying', {delay: -3.5, duration: 0.5, opacity: 1}, INIT2);
    tl.to('#progress-bar-2', {delay: -3.5, duration: 0.2, width: '98%'}, INIT2);
    tl.to('#copying', {delay: -2.7, duration: 0.2, opacity: 0}, INIT2);
    tl.to('#uploading', {delay: -2.5, duration: 0.5, opacity: 1}, INIT3);
    tl.to('#progress-bar-3', {delay: -2.5, duration: 0.5, width: '99%'}, INIT3);
    tl.to('#uploading', {delay: -1.5, duration: 0.2, opacity: 0}, INIT3);
    tl.to('#starting', {delay: -1.2, duration: 0.6, opacity: 1}, INIT4);
    tl.to('.dots', {delay: -1, duration: 1, fontSize:'4rem'}, INIT4);
    tl.to('#starting', {delay: -0.3, duration: 0.2, opacity: 0}, INIT4);
    tl.to('#circle', {duration: 0.5, scale: 0});
    tl.to($('#white-start') , 1, {ease: 'slow(0.7, 0.7, false)', autoAlpha: 0, display:'none'});
    window.setTimeout(()=>{
        answeringChat("");
        assistantRingAnimation();
        assistantStarted = true;
    }, 7000);

};

//APP
startAnimation();
canITurnLights();
lightTurning();


