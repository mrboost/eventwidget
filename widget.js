let globalCooldown = 10; //seconds
let userConfig = [
    {
        emote: "!{{eventtrigger1}}", 
        amount: 1,
        videoFile: "{{eventvideo1}}",
        soundFile: "",
        imageFile: "",
        volume: 50,
        timeout: 10, //seconds for triggering combo (amount occurrences within timeout seconds)
        cooldown: 1, //seconds
        caseSensitive: false,
    },
  	{
        emote: "!{{eventtrigger2}}", 
        amount: 1,
        videoFile: "{{eventvideo2}}",
        soundFile: "",
        imageFile: "",
        volume: 50,
        timeout: 10, //seconds for triggering combo (amount occurrences within timeout seconds)
        cooldown: 1, //seconds
        caseSensitive: false,
    },
  	{
        emote: "!{{eventtrigger3}}", 
        amount: 1,
        imageFile: "{{eventimage3}}",
        soundFile: "{{eventsound3}}",
        videoFile: "",
        volume: 50,
        timeout: 10, //seconds for triggering combo (amount occurrences within timeout seconds)
        cooldown: 1, //seconds
        caseSensitive: false,
    },
    {
        emote: "!{{eventtrigger4}}",
        amount: 1,
        soundFile: "{{eventsound4}}",
        imageFile: "{{eventimage4}}",
        videoFile: "",
        volume: 50,
        timeout: 10, //seconds for triggering combo (amount occurrences within timeout seconds)
        cooldown: 1, //seconds
        caseSensitive: false,
    }
];


let queue = $("#placeholder");
let emoticons = [];
window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    let message = data["text"];
    let words = message.split(" ");
    let results = words.filter(value => -1 !== emoticons.indexOf(value.toLowerCase()));
    console.log(results);
    results = Array.from(new Set(results)); //getting unique words
    for (let i in results) {
        index = userConfig.findIndex(x => x.emote.toLowerCase() === results[i].toLowerCase());
        if (index !== -1) {
            if (!userConfig[index]['caseSensitive'] || userConfig[index]['emote'] === results[i])
                checkPlay(index);
        }
    }

});
let cooldown = 0;


function checkPlay(index) {
  let sound = userConfig[index];
  let video = userConfig[index];
  
    if (sound.cooldownEnd < Date.now() / 1000) {
    if (video.cooldownEnd < Date.now() / 1000) {
        userConfig[index]['counter']++;
        if (userConfig[index]['timer'] === 0) {
            userConfig[index]['timer'] = userConfig[index]['timeout'];
        }
        if (cooldown>0) return;
        if (userConfig[index]['counter'] >= userConfig[index]['amount']) {
            userConfig[index]['cooldownEnd'] = (Date.now() / 1000) + sound.cooldown;
            userConfig[index]['cooldownEnd'] = (Date.now() / 1000) + video.cooldown;
            let tmpaudio = new Audio(sound.soundFile + video.videoFile);
            
            tmpaudio.onloadeddata = function () {
                console.log(`adding ${index} to queue after ${tmpaudio.duration}`);

                queue
                    .queue(function () {
                        let audio = new Audio(sound.soundFile);
                  		
                        audio.volume = sound.volume * .01;
                        audio.play();
                  		var vid = document.getElementById("vid");
                        if (video.videoFile.length > 10) {
                            $("#vid").attr('src',  video.videoFile);
                          playVid();
                            setTimeout(function () {
                                $("#vid").attr('src', '');
                              console.log();
                            }, tmpaudio.duration * 2000);
                          
                        }
                        if (sound.imageFile.length > 10) {
                            $("#image").css('background-image', 'url(' + sound.imageFile + ')');
                            setTimeout(function () {
                                $("#image").css('background-image', '');
                            }, tmpaudio.duration * 1000);
                        }
                        $(this).delay(tmpaudio.duration * 1000);
                        $(this).dequeue();
                    });
            };
            cooldown = globalCooldown;
        }
    }
}
}
function playVid() {
  var vid = document.getElementById("vid");
  var goalAudio = document.getElementById("goalAudio");
  var soundVolume = 10;
  vid.volume = soundVolume * .01;
  vid.play();
  $("#vid").fadeIn("slow");

    $('#vid').on('ended',function(){
    $("#vid").fadeOut("slow");
    $("#vid")[0].pause();
  });
}
for (let key in userConfig) {
    emoticons.push(userConfig[key]["emote"].toLowerCase());
    userConfig[key]['counter'] = 0;
    userConfig[key]['cooldownEnd'] = 0;
    userConfig[key]['timer'] = 0;
}

let t = setInterval(function () {
    cooldown--;
    for (let key in userConfig) {
        userConfig[key]['timer'] = Math.max((userConfig[key]['timer'] - 1), 0);
        if (userConfig[key]['timer'] === 0) {
            userConfig[key]['counter'] = 0;
        }
    }
}, 1000);
