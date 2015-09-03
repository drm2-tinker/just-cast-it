;(function (window, document, undefined)
{ 'use strict';

    var SHARE_URL_ID = 'share-url';
    var PEERJS_API_KEY = 'w19j6rp47wx9a4i';

    var peer = new Peer({ key: PEERJS_API_KEY });

    peer.on('open', function (id)
    {
        document.getElementById(SHARE_URL_ID).value = window.location.href + '#id=' + id;
    });

    var ORIGIN_ID = window.location.hash.split('=')[1] || '';

    if (ORIGIN_ID !== '')
    {
        var conn = peer.connect(ORIGIN_ID);

        conn.on('open', function ()
        {
            conn.send('testing!');
        });
    }

    peer.on('connection', function (conn)
    {
        conn.on('data', function (data)
        {
            console.log(data);
        });
    });
})(window, document);
