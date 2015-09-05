// window.mediaElement = document.getElementById('media');
// window.mediaManager = new cast.receiver.MediaManager(window.mediaElement);
window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
window.castMessageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:io.renobit.apps.just-cast-it');
window.castReceiverManager.start();
