using System; 

//TODO: (HIGH) these should pull data from a config file or database on server 
public class ServerData 
{
    public static string SuiNetworkEnvironment 
    {
        get {
            return "testnet"; 
        }
    }

    public static string SuiExplorerUrl
    {
        get {
            return "https://suiexplorer.com/"; 
        }
    }

    public static string NftImageUrlBase 
    {
        get {
            return "http://game.soundbeats.io/nft-images/"; 
        }
    }
}