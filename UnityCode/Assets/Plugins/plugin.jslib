var plugin = {

    //calls the client-side script to sign message using Sui wallet
    CallSuiSignMessage: function(msg)
    {
        window.SuiSignMessage(UTF8ToString(msg));
    }, 

    //calls the client-side script to send Google Analytics tags
    CallSendGTag: function(category, action, label, value)
    {
        window.SendGTag(UTF8ToString(category), UTF8ToString(action), UTF8ToString(label), value);
    }
};

mergeInto(LibraryManager.library, plugin);