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
    public const string WalletAddressKey = "suiaddress"; 

    public static string ActiveWalletAddress = "";
    public static string ErrorMessage = "";

    //TODO: (MED) this should use playerPrefs only
    public static string GetActiveAddress()
    {
        return SuiWallet.ActiveWalletAddress; 
    }

    public static bool HasActiveAddress()
    {
        return ActiveWalletAddress != null && ActiveWalletAddress.Length > 0;
    }

    public static void Logout()
    {
        PlayerPrefs.DeleteKey(WalletAddressKey); 
        PlayerPrefs.Save();
    }
}
