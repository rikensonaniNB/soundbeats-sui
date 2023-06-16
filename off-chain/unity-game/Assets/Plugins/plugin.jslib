var plugin = {

    //calls the client-side script to sign message using Sui wallet
    CallSuiSignMessage: function(msg)
    {
        window.SuiSignMessage(UTF8ToString(msg));
    }, 
    
    //alerts a message on the client side 
    DisplayJsMessage: function(msg)
    {
        window.alert("From Unity: " + UTF8ToString(msg));
    }
};

mergeInto(LibraryManager.library, plugin);