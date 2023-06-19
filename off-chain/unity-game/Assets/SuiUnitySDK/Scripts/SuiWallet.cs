using Suinet.Wallet;
using UnityEngine;

public class SuiExplorer 
{
    public const string ExplorerUri = "https://suiexplorer.com/"; 
    public const string Network = "devnet";

    public static string FormatAddressUri(string address)
    {
        return System.String.Format("{0}address/{1}?network={2}", SuiExplorer.ExplorerUri, address, SuiExplorer.Network);
    }

    public static string FormatTransactionUri(string txid)
    {
        return System.String.Format("{0}txblock/{1}?network={2}", SuiExplorer.ExplorerUri, txid, SuiExplorer.Network);
    }
}

/// <summary>
/// Simple wallet implementation. Uses PlayerPrefs as store.
/// </summary>
public class SuiWallet
{
    public static string ActiveWalletAddress = "0x94e666c0de3a5e3e2e730d40030d9ae5c5843c468ee23e49f4717a5cb8e57bfb";
    public static string ErrorMessage = "";

    public static string GetActiveAddress()
    {
        return SuiWallet.ActiveWalletAddress; 
        /*
        var keypair = GetActiveKeyPair();
        if (keypair != null)
        {
            return keypair.PublicKeySuiAddress;
        }

        return "0x";
        */
    }

    //TODO: can be removed, most likely
    /*
    public static string CreateNewWallet()
    {
        var mnemo = Mnemonics.GenerateMnemonic();
        RestoreWalletFromMnemonics(mnemo);
        return mnemo;
    }

    public static bool RestoreWalletFromMnemonics(string mnemo)
    {
        if (!Mnemonics.ValidateMnemonic(mnemo)) return false;

        PlayerPrefs.SetString(MnemonicsKey, mnemo);
        PlayerPrefs.Save();
        return true;
    }

    public static Ed25519KeyPair GetActiveKeyPair()
    {
        if (PlayerPrefs.HasKey(MnemonicsKey))
        {
            var mnemo = PlayerPrefs.GetString(MnemonicsKey);
            return Mnemonics.GetKeypairFromMnemonic(mnemo);
        }

        return null;
    }
    */

    //TODO: need better way to log out ?
    public static void Logout()
    {
        //TODO: this key should be a constant
        PlayerPrefs.DeleteKey("suiaddress"); 
        PlayerPrefs.Save();
    }
}
