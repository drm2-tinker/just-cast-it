;(function (window, document, undefined)
{ 'use strict';

    var SHARE_URL_ID = 'share-url';
    var PEERJS_API_KEY = 'w19j6rp47wx9a4i';

    var peer = new Peer({ key: PEERJS_API_KEY });

    peer.on('open', function (id)
    {
        document.getElementById(SHARE_URL_ID).value = window.location.href;
    });
})(window, document);
