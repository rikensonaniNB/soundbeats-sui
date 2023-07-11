using System; 

public class UserData 
{
    private static string[] _nftNames = { "Anna", "Melloow", "Taral" };
    private static System.Collections.Generic.Dictionary<string, bool> _nfts = new System.Collections.Generic.Dictionary<string, bool>() {
        { "Anna", false}, 
        { "Melloow", false }, 
        { "Taral", false }
    };

    public static string WalletAddress 
    {
        get { return SuiWallet.ActiveWalletAddress; }
    }

    public static int TokenBalance
    {
        get {
            return PlayerPrefsExtra.GetInt("tokenBalance", 0);
        }
        set {
            PlayerPrefsExtra.SetInt("tokenBalance", value);
        }
    }

    public static int BestScore
    {
        get {
            return PlayerPrefsExtra.GetInt("bestScore", 0);
        }
        set {
            PlayerPrefsExtra.SetInt("bestScore", value);
        }
    }

    public static int OwnedNftCount 
    {
        get { 
            int count = 0;
            foreach (string key in _nftNames) {
                if (_nfts[key])
                    count++;
            }
            return count;
        }
    }

    public static int SelectedNftIndex 
    {
        get { 
            return PlayerPrefsExtra.GetInt("selectedIndex"); 
        }
        set {
            if (value < 0) 
                PlayerPrefsExtra.DeleteKey("selectedIndex"); 
            else {
                if (OwnsNft(value)) {
                    PlayerPrefsExtra.SetInt("selectedIndex", value); 
                }
                else {
                    if (OwnedNftCount > 0) {
                        for(int n=_nftNames.Length-1; n>0; n--) {
                            if (_nfts[_nftNames[n]]) {
                                PlayerPrefsExtra.SetInt("selectedIndex", n); 
                            }
                        }
                    }
                }
            }
        }
    }

    public static bool HasSelectedNft 
    {
        get { 
            if (OwnedNftCount == 0) 
                return false;
            return PlayerPrefsExtra.HasKey("selectedIndex"); 
        }
    }

    public static void AddNft(string name) 
    {
        if (_nfts.ContainsKey(name)) {
            _nfts[name] = true;
        }
    }

    public static bool OwnsNft(string name) 
    {
        return _nfts[name]; 
    }

    public static bool OwnsNft(int index) 
    {
        if (index < 0 || index >= _nftNames.Length) 
            return false;
        return OwnsNft(_nftNames[index]); 
    }

    public static void ClearNfts() 
    {
        foreach (string key in _nftNames) {
            _nfts[key] = false;
        }
    }

    public static void SetOwnedNfts(GetBeatsNftsResponseDto getNftsResponseDto) 
    {
        ClearNfts(); 
        foreach (BeatsNftDto dto in getNftsResponseDto.nfts) {
            AddNft(dto.name);
        }

        //handle selected index 
        if (!PlayerPrefsExtra.HasKey("selectedIndex") && OwnedNftCount > 0) {
            SelectedNftIndex = 0;
        }

        //remove the selected index if no owned nfts
        if (OwnedNftCount == 0)
            SelectedNftIndex = -1;
    }
}