const friends = new Map();
const joinId = prompt("Enter the host ID to join a party. Otherwise keep this field blank.");
var id = '';

function initBVRV(player) {
    setDefaults(player);
    insertUI(player);
    getParseTimestamp(player);
    document.onkeydown = (e) => handleKeycuts(player, e);
    initPeer(player);
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
    query.equalTo("episodeId", episodeId);
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

function onConnect(conn, incoming) {
    console.log(`new ${incoming ? 'incoming' : 'outbound'} connection from: ${conn.peer}`);

    if (incoming) {
        friends.set(conn.peer, conn);
    }

    conn.on('data', (data) => {
        console.log(`received data from ${conn.peer}: ${JSON.stringify(data)}`)
    });

    conn.on('close', () => {
        console.log(`connection closed with ${conn.peer}`);
        friends.delete(conn.peer);
    });
}

function initPeer(player) {
    const peer = new Peer();

    player.on(
        "timeupdate",
        (e) => {
            if (friends.size > 0) {
                let currentTime = player.currentTime();
                console.log(`Updating current time: ${currentTime}`);
                friends.forEach(friend => friend.send({'currentTime': currentTime}));
            }
        }
    );

    peer.on('open', (newId) => {
        console.log(`open: ${newId}`);
        id = newId;
    });

    peer.on('connection', (conn) => {
        onConnect(conn, true)
    });

    if (joinId) {
        setTimeout(() => {
            const conn = peer.connect(joinId);
            conn.on('open', () => onConnect(conn, false));
        }, 1000);
    }
}
