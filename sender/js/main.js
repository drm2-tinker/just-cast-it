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
            api:           null,
            app_id:        '08DCB031',
            receiver_list: null
        };
        _p.peerjs = {
            api_key:       'w19j6rp47wx9a4i',
            connection:    null,
            id:            null,
            peer:          null
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
        // private local properties
        var THAT = this;

        // private methods
        // var onLaunch = function (activity)
        // {
        //     if (activity.status === 'running')
        //     {
        //         _p.cast.api.sendMessage(activity.activityId, 'io.renobit.caster', { type: 'testing' });
        //     }
        // };
        //
        // var doLaunch = function (receiver)
        // {
        //     var request = new cast.LaunchRequest(_p.cast.app_id, receiver);
        //
        //     _p.cast.api.launch(request, onLaunch);
        // };
        //
        // var onReceiverList = function (list)
        // {
        //     var receiver_list_element = document.getElementById('receiver-list');
        //     if (list.length > 0)
        //     {
        //         _p.cast.receiver_list = list;
        //         receiver_list_element.innerHTML = '';
        //
        //         for (var i = 0, l = list.length; i < l; ++i)
        //         {
        //             var list_item_element = document.createElement('li');
        //             var receiver = list[i];
        //
        //             list_item_element.setAttribute('id', receiver.id);
        //             list_item_element.setAttribute('href', '#');
        //             list_item_element.innerHTML = receiver.name;
        //
        //             list_item_element.addEventListener('click', function (e)
        //             {
        //                 e.preventDefault();
        //
        //                 doLaunch(receiver);
        //             }, false);
        //
        //             receiver_list_element.appendChild(list_item_element);
        //         }
        //     }
        //     else
        //     {
        //
        //     }
        // };

        var receiverListener = function (e)
        {
            if (e === chrome.cast.ReceiverAvailability.AVAILABLE)
            {
                
            }
        };

        var sessionListener = function (e)
        {
            _p.cast.session = e;

            if (_p.cast.session.media.length != 0)
            {

            }
        };

        window.__onGCastApiAvailable = function(isAvailable, errorInfo)
        {
            if (isAvailable)
            {
                if (_p.cast.api === null)
                {
                    var cast_session_request = new chrome.cast.SessionRequest(_p.cast.app_id);
                    var cast_api_config      = new chrome.cast.ApiConfig(cast_session_request, sessionListener, receiverListener);

                    chrome.cast.initialize(cast_api_config, onInitSuccess, onError);

                    // _p.cast.api = new cast.Api();
                    // _p.cast.api.addReceiverListener(_p.cast.app_id, onReceiverList);
                }
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

    Caster.prototype.GetPrivate = function ()
    {
        return _p;
    }

    return new Caster();

})(window, document);

window.Caster.Start();
