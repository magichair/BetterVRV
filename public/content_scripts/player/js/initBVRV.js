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
    const ably = new Ably.Realtime('QHt4Mw.J7CueQ:siqXoN1qkuKzgFel');
    const channel = ably.channels.get(document.referrer.split("/")[4]);
    player.on(
        "timeupdate",
        (e) => {
            let currentTime = player.currentTime();
            channel.publish('currentTime', currentTime.toString());
        }
    );
    channel.subscribe('seek', (message) => {
        player.currentTime(parseFloat(message.data));
    })
}
