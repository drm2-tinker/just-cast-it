;window.Caster = (function (window, document, undefined)
{ 'use strict';

    // the private property/method store
    var _p = {};

    // the main application constructor
    var Caster = function ()
    {
        // private properties (constants)
        _p.PEERJS_API_KEY   = 'w19j6rp47wx9a4i';
        _p.SHARE_URL_ID     = 'share-url';
        _p.THAT             = this;

        // private properties
        _p._id              = null;
        _p._peer            = null;
        _p._peer_connection = null;

        // private methods
        _p.initializePeerJS = function ()
        {
            _p._peer = new Peer({ key: _p.PEERJS_API_KEY });

            _p._peer.on('open', function (id)
            {
                _p._id = id;
                document.getElementById(_p.SHARE_URL_ID).value = window.location.href + '#id=' + id;
            });
        };

        _p.readyConnection = function ()
        {
            var origin_id = window.location.hash.split('=')[1] || '';

            if (origin_id !== '')
            {
                _p._peer_connection = _p._peer.connect(origin_id);

                _p._peer_connection.on('open', function ()
                {
                    _p._peer_connection.send('testing!');
                });
            }

            _p._peer.on('connection', function (conn)
            {
                conn.on('data', function (data)
                {
                    console.log(data);
                });
            });
        };
    };

    Caster.prototype.Start = function ()
    {
        _p.initializePeerJS();
        _p.readyConnection();
    };

    return new Caster();

})(window, document);

window.Caster.Start();
