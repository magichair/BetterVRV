let options = DEFAULT_OPTIONS;
let statusIcons = {};
let reverseKeyMap = getReverseKeyMap(options);
let episodeId = document.referrer.split("/")[4];

let playerDefaults = {
    playbackRate: options.defaultSpeed,
    volume: parseFloat(options.defaultVolume / 100),
    muted: options.muteByDefault,
}

window.addEventListener(
    'message',
    (event) => {
        if (event.data.sender && event.data.sender === "bvrv") {
            if (event.data.content === "chromeOptions") {
                options = event.data.options;
                statusIcons = event.data.statusIcons;
                reverseKeyMap = getReverseKeyMap(options);
                playerDefaults = {
                    playbackRate: options.defaultSpeed,
                    volume: parseFloat(options.defaultVolume / 100),
                    muted: options.muteByDefault,
                }
            } else if (event.data.content === "episodeId") {
                episodeId = event.data.episodeId;
            }
        }
    },
    false
);



function cleanUpPreviousUI() {
    let skipIntroButton = document.getElementById("bvrv-skip-intro-button");
    if (skipIntroButton) {
        skipIntroButton.classList.add("bvrv-display-none");
    }

    let skipOutroButton = document.getElementById("bvrv-skip-outro-button");
    if (skipOutroButton) {
        skipOutroButton.classList.add("bvrv-display-none");
    }

    let nextEpisodeButton = document.getElementById("bvrv-next-episode-button");
    if (nextEpisodeButton) {
        nextEpisodeButton.classList.add("bvrv-display-none");
    }
}

function setUp() {
    window.postMessage(
        {
            sender: "bvrv",
            content: "requestEpisodeId"
        },
        "*"
    );

    cleanUpPreviousUI();

    // Usage:  ensure element is visible
    poll(function() {
        let player = videojs("player_html5_api", {"poster": ""});
        return player.src() !== "";
    }, 30000, 500).then(function() {
        // Polling done, now do something else!
        let player = videojs("player_html5_api", {"poster": ""});
        player.poster("");
        player.ready(() => {
            initBVRV(player);
        });
    }).catch(function(e) {
        // Polling timed out, handle the error!
        console.error("no source", e);
    });
}

// The polling function
function poll(fn, timeout, interval) {
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    var checkCondition = function(resolve, reject) {
        // If the condition is met, we're done! 
        var result = fn();
        if(result) {
            resolve(result);
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject);
        }
        // Didn't match and too much time, reject!
        else {
            reject(new Error('timed out for ' + fn + ': ' + arguments));
        }
    };

    return new Promise(checkCondition);
}

setUp();