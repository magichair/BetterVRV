function initBVRV(player) {
    setDefaults(player);
    insertUI(player);
    getParseTimestamp(player);
    document.onkeydown = (e) => handleKeycuts(player, e);
    initAblyListener(player);
}

function setDefaults(player) {
    player.playbackRate(playerDefaults.playbackRate);
    player.volume(playerDefaults.volume);
    player.muted(playerDefaults.muted);
}

function getParseTimestamp(player) {
    Parse.serverURL = 'https://parseapi.back4app.com'; // server
    Parse.initialize(
      'CfnxYFbrcy0Eh517CcjOAlrAOH9hfe7dpOqfMcJj', // app id
      'Ke0lTaWiPPvLmpDOLLrukkbdAq34GTxVIEh4wcAU' // js key
    );

    const Timestamps = Parse.Object.extend('Timestamps');
    const query = new Parse.Query(Timestamps);
    query.equalTo("episodeId", document.referrer.split("/")[4]);
    query.first().then(
        (result) => {
            if (result) {
                handleTiming(player, result);
            }
        },
        (error) => {
            console.error(error);
        }
    );
}

function initAblyListener(player) {
    const myClientId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const ably = new Ably.Realtime({key: 'QHt4Mw.Q1PDmA:9DLgRr2SuvM701g2', clientId: myClientId, echoMessages: false});
    const channel = ably.channels.get(document.referrer.split("/")[4]);
    const bufferTimeSecs = 3.0;
    const sampleRate = 10; // Only post every 10x time updates
    let currentCount = sampleRate;
    let currentMembers = {};
    player.on(
        "timeupdate",
        (e) => {
            if (currentMembers > 1) {
                if (currentCount++ % sampleRate == 0) {
                    let currentTime = player.currentTime();
                    channel.publish('currentTime', currentTime.toString());
                    currentCount = 1;
                }
            }
        }
    );
    channel.presence.subscribe('enter', (member) => {
        console.log(`New Member ${member.clientId}`);
        currentMembers[member.clientId] = 0.0;
    });
    channel.presence.subscribe('present', (member) => {
        console.log(`Member already present ${member.clientId}`);
        currentMembers[member.clientId] = 0.0;
    });
    channel.presence.subscribe('leave', (member) => {
        console.log(`Member left ${member.clientId}`);
        delete currentMembers[member.clientId];
    });
    channel.presence.enter();
    channel.subscribe('currentTime', (message) => {
        clientId = message.clientId;
        currentMembers[clientId] = parseFloat(message.data);
        currentTime = player.currentTime();
        minTime = 99999;
        for (var member in currentMembers) {
            if (member != myClientId && currentMembers[member] < minTime) {
                minTime = currentMembers[member];
            }
        }
        if (currentTime - minTime > bufferTimeSecs) {
            console.log(`Pausing to catch up from currentTime: ${currentTime.toString()} to minTime: ${minTime.toString()}`)
            currentCount = sampleRate;
            player.pause();
        } else {
            console.log('Caught up! Un-pausing!')
            if (player.paused()) {
                currentCount = sampleRate;
                player.play();
            }
        }
    });
}