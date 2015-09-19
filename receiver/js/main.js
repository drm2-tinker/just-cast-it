;window.Caster = (function (window, document, undefined)
{ 'use strict';

    // the private property/method store
    var _p = {};

    // the main application constructor
    var Caster = function ()
    {
        // private local properties (constructor access only)
        var THAT = this;

        // private properties
        _p.cast   = {
            message_bus:      null,
            receiver_manager: null,
            sender_list:      null,
            session:          null
        };
        _p.peerjs = {
            api_key:          'w19j6rp47wx9a4i',
            connection:       null,
            id:               null,
            peer:             null,
            sender_id:        null
        };

        // private methods
        _p.initializePeerJS = function ()
        {
            _p.peerjs.peer = new Peer({ key: _p.peerjs.api_key });

            _p.peerjs.peer.on('open', function (id)
            {
                _p.peerjs.id = id;

                _p.readyConnection();
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

        _p.initializeCastAPI = function ()
        {
            var launchMessageListener = function ()
            {
                document.getElementById('message-container').innerHTML = 'Now Listening for Messages...';

                _p.cast.message_bus.onMessage = function (messageEvent)
                {
                    var sender_id = messageEvent.senderId;
                    var message   = JSON.parse(messageEvent.data);

                    switch (message.type)
                    {
                        case 'message':
                            document.getElementById('message-container').innerHTML = message.payload;

                            break;
                        case 'peerjs-id':
                            _p.peerjs.sender_id = message.payload;
                            _p.peerjs.connection = _p.peerjs.peer.connect(_p.peerjs.sender_id);

                            _p.peerjs.connection.on('open', function ()
                            {
                                _p.peerjs.connection.send('testing!');
                            });

                            break;
                        default:

                            break;
                    }
                };
            };

            _p.cast.receiver_manager = cast.receiver.CastReceiverManager.getInstance();
            _p.cast.message_bus      = _p.cast.receiver_manager.getCastMessageBus('urn:x-cast:io.renobit.apps.just-cast-it');

            // start listening for messages from senders
            launchMessageListener();

            // initiate Cast application
            _p.cast.receiver_manager.start();
        };
    };

    Caster.prototype.Start = function ()
    {
        _p.initializePeerJS();
        _p.initializeCastAPI();
    };

    return new Caster();

})(window, document);

window.Caster.Start();
