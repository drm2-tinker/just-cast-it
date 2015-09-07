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
        _p.initializeCastAPI = function ()
        {
            var launchMessageListener = function ()
            {
                _p.cast.message_bus.onMessage = function (messageEvent)
                {
                    var sender_id = messageEvent.senderId;
                    var message   = messageEvent.data;

                    document.getElementById('message-container').innerText = message;
                };
            };

            _p.cast.receiver_manager = cast.receiver.CastReceiverManager.getInstance();
            _p.cast.message_bus      = _p.cast.receiver_manager.getCastMessageBus('urn:x-cast:io.renobit.apps.just-cast-it');

            // initiate Cast application
            _p.cast.receiver_manager.start();

            // start listening for messages from senders
            launchMessageListener();
        };
    };

    Caster.prototype.Start = function ()
    {
        _p.initializeCastAPI();
    };
})(window, document);
