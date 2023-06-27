var plugin = {

    //calls the client-side script to sign message using Sui wallet
    CallSuiSignMessage: function(msg)
    {
        window.SuiSignMessage(UTF8ToString(msg));
    }, 

    //calls the client side script to try to detect presence of martian wallet
    DetectMartianWallet: function() {
        window.DetectMartianWallet();
    }
};

mergeInto(LibraryManager.library, plugin);