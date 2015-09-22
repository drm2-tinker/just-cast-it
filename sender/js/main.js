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
            api:             null,
            app_id:          '08DCB031',
            receiver_list:   null,
            session:         null,
            session_request: null
        };
        _p.peerjs = {
            api_key:         'w19j6rp47wx9a4i',
            connection:      null,
            id:              null,
            peer:            null,
            receiver_id:     null
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
            _p.peerjs.peer.on('connection', function (conn)
            {
                conn.on('data', function (data)
                {
                    var message = JSON.parse(data);

                    if (message.type === 'peerjs-id')
                    {
                        _p.peerjs.receiver_id = message.payload;
                        console.log('received peerjs id from receiver...');

                        _p.peerjs.connection = _p.peerjs.peer.connect(_p.peerjs.receiver_id);

                        _p.peerjs.connection.on('open', function ()
                        {
                            console.log('connected to receiver...');

                            var fileInput = document.getElementById('file-input');

                            fileInput.addEventListener('change', function (e)
                            {
                                var file = fileInput.files[0];
                                var chunkSize = 1024 * 1024; // 64 KB
                                var fileSize = file.size;
                                var startByte = 0;

                                while (startByte <= chunkSize * 5)
                                // while (startByte < chunkSize)
                                {
                                    var reader = new FileReader();

                                    reader.onload = function (e)
                                    {
                                        var chunk = e.target.result;

                                        var data = {
                                            payload: chunk
                                            // payload: 'test'
                                        };

                                        console.log('sending data!');
                                        _p.peerjs.connection.send(data);
                                    };

                                    var chunk = file.slice(startByte, startByte + chunkSize);

                                    reader.readAsArrayBuffer(chunk);

                                    startByte += chunkSize;
                                }
                            });
                        });
                    }
                });
            });
        };

        _p.initializeCastAPI = function ()
        {
            // private local properties
            var THAT = this;

            // private local methods
            var onRequestSessionSuccess = function (session)
            {
                _p.cast.session = session;

                var onSuccess = function ()
                {
                    console.log('Message sent successfully!');
                };

                var onError = function (error)
                {
                    console.log(error);
                };

                setTimeout(function ()
                {
                    document.getElementById('message-submit').addEventListener('click', function ()
                    {
                        var message = {
                            type:    'message',
                            payload: document.getElementById('message').value
                        };

                        _p.cast.session.sendMessage('urn:x-cast:io.renobit.apps.just-cast-it', JSON.stringify(message), onSuccess, onError);
                    }, false);

                    var message = {
                        type:    'peerjs-id',
                        payload: _p.peerjs.id
                    };

                    _p.cast.session.sendMessage('urn:x-cast:io.renobit.apps.just-cast-it', JSON.stringify(message), onSuccess, onError);
                }, 5000);
            };

            var onLaunchError = function (error)
            {
                console.log('request session error');
                console.log(error);
            };

            var onInitError = function (error)
            {
                console.log(error);
            };

            var receiverListener = function (availability)
            {
                console.log('receiver listener callback');
                if (availability === chrome.cast.ReceiverAvailability.AVAILABLE)
                {
                    console.log('- receiver available');
                    chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError, _p.cast.session_request);
                }
            };

            var sessionListener = function (session)
            {
                console.log('session listener callback');
                _p.cast.session = session;

                if (_p.cast.session.media.length != 0)
                {
                    console.log('- media discovered');
                    onMediaDiscovered(onRequestSessionSuccess, _p.cast.session.media[0]);
                }
            };

            var onInitSuccess = function ()
            {
                console.log('Cast API Successfully Initiated');
            };

            // event listener for cast api availability
            window.__onGCastApiAvailable = function(isAvailable, errorInfo)
            {
                if (isAvailable)
                {
                    if (_p.cast.api === null)
                    {
                        _p.cast.session_request = new chrome.cast.SessionRequest(_p.cast.app_id);
                        var cast_api_config     = new chrome.cast.ApiConfig(_p.cast.session_request, sessionListener, receiverListener);

                        chrome.cast.initialize(cast_api_config, onInitSuccess, onInitError);
                    }
                }
                else
                {
                    console.log(errorInfo);
                }
            };
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
