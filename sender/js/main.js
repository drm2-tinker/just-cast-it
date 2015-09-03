;window.Caster = (function (window, document, undefined)
{ 'use strict';

    // the private property/method store
    var _p = {};

    // the main application constructor
    var Caster = function ()
    {
        // private properties (constants)
        _p.THAT = this;

        // private properties
        _p.cast   = {
            app_id:     '08DCB031'
        };
        _p.peerjs = {
            api_key:    'w19j6rp47wx9a4i',
            connection: null,
            id:         null,
            peer:       null
        };

        // private methods
        _p.initializePeerJS = function ()
        {
            _p.peerjs.peer = new Peer({ key: _p.peerjs.api_key });

            _p.peerjs.peer.on('open', function (id)
            {
                _p.peerjs.id = id;
            });
        };

        _p.readyConnection = function ()
        {
            var origin_id = window.location.hash.split('=')[1] || '';

            if (origin_id !== '')
            {
                _p.peerjs.connection = _p.peerjs.peer.connect(origin_id);

                _p.peerjs.connection.on('open', function ()
                {
                    _p.peerjs.connection.send('testing!');
                });
            }

            _p.peerjs.peer.on('connection', function (conn)
            {
                conn.on('data', function (data)
                {
                    console.log(data);
                });
            });
        };
    };

    Caster.prototype.InitializeCastAPI = function ()
    {
        window.__onGCastApiAvailable = function(isAvailable, errorInfo)
        {
            if (isAvailable)
            {
                console.log('Cast API is Available!');
            }
            else
            {
                console.log(errorInfo);
            }
        };
    };

    Caster.prototype.Start = function ()
    {
        _p.initializePeerJS();
        _p.readyConnection();

        this.InitializeCastAPI();
    };

    return new Caster();

})(window, document);

window.Caster.Start();
