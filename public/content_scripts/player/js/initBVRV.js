function initBVRV(player) {
    setDefaults(player);
    insertUI(player);
    // handleTiming(player);

    document.onkeydown = (e) => handleKeycuts(player, e);
}

function setDefaults(player) {
    player.playbackRate(options.defaultSpeed);
    player.volume(parseFloat(options.defaultVolume / 100));
    player.muted(options.muteByDefault);
}
