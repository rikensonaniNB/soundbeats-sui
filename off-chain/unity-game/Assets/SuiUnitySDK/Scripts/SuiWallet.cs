using Suinet.Wallet;
using UnityEngine;

public class SuiExplorer 
{
    public static string FormatAddressUri(string address)
    {
        return System.String.Format("{0}address/{1}?network={2}", ServerData.SuiExplorerUrl, address, ServerData.SuiNetworkEnvironment);
    }

    public static string FormatTransactionUri(string txid)
    {
        return System.String.Format("{0}txblock/{1}?network={2}", ServerData.SuiExplorerUrl, txid, ServerData.SuiNetworkEnvironment);
    }
}

/// <summary>
/// Simple wallet implementation. Uses PlayerPrefs as store.
/// </summary>
public class SuiWallet
{
    public const string WalletAddressKey = "suiaddress"; 
    public static string ErrorMessage = "";

    public static string ActiveWalletAddress {
        get { return PlayerPrefs.GetString(WalletAddressKey); }
        set {
            PlayerPrefs.SetString(WalletAddressKey, value);
        }
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
