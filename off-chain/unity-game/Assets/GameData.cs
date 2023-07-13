using System; 

//TODO: (HIGH) these should pull data from a config file or database on server 
public class GameData 
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
            return "https://game.soundbeats.io/nft-images/"; 
        }
    }
}