//#define FAKE_SIGNIN

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class UIController : MonoBehaviour
{ 
    private const int SIGNING_MESSAGE_LENGTH = 32;
    private static string MessageToSign = "";

    //call to request the front end Javascript code to sign a message 
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void CallSuiSignMessage(string msg);

    //call to request the front end Javascript to detect presence of Martian wallet 
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void DetectMartianWallet(); 

    private bool MartianWalletNotFound = false;

    #region UI Components 

    public Button NewWalletButton;
    public Button NFTButton;
    public Button WalletButton_Home;
    public Button Mint_Button_Anna;
    public Button Mint_Button_Marshmallow;
    public Button Mint_Button_Taral;
    public Button Mint_SuccessfulScreen_Close;
    public Button PlayButton;
    public Button MintNFTScreen_Button_Anna;
    public Button MintNFTScreen_Button_Marshmallow;
    public Button MintNFTScreen_Button_Taral;
    public Button MintNFTScreen_Button_Close;
    public Button ClaimTokens_Button;
    public Button Close_WalletScreen;
    public Button Close_LeaderboardScreen;
    public Button Close_ClaimTokens;
    public Button MintNFT_LinkButton;
    public Button WalletScreen_NFTAdd_Button;
    public Button ClaimScreen_NFTAdd_Button;
    public Button ConnectWalletButton;
    public Button onLogOutButton;
    public Button ImportWalletButton;


    public TMP_InputField NewWalletMnemonicsText;
    public TMP_InputField ActiveAddressText;
    public TextMeshProUGUI link_successful;
    public GameObject SuiWalletScreen;
    public GameObject HomeScreen;
    public GameObject PlaySongScreen;
    public GameObject WalletScreen;
    public GameObject LeaderboardScreen;
    public GameObject ClaimTokensScreen;
    public GameObject SelectCharacterScreen;
    public GameObject txtMintCharacter;
   
    public Sprite sprite_Pink;
    public Sprite sprite_Green;

    public GameObject Mint_SuccessfulScreen;
    public GameObject Mint_NFTScreen;

    public Image Mint_SuccessfulScreen_Image;
    public GameObject SelectCharacter_Overlay;

    public Sprite Character_Anna;
    public Sprite Character_Melloow;
    public Sprite Character_Taral;

    public TextMeshProUGUI txtAddressNFT_WalletScreen;
    public TextMeshProUGUI txtScore_WalletScreen;
    public TextMeshProUGUI txtScore_ClaimScreen;
    public TextMeshProUGUI txtAddressNFT_ClaimScreen;

    public GameObject LoadingScreen;
    public GameObject ErrorScreen;
    public TextMeshProUGUI txtError_ErrorScreen;

    public TextMeshProUGUI Mint_Text_Anna;
    public TextMeshProUGUI Mint_Text_Mellow;
    public TextMeshProUGUI Mint_Text_Taral;

    public TextMeshProUGUI MintNFTScreen_Text_Anna;
    public TextMeshProUGUI MintNFTScreen_Text_Mellow;
    public TextMeshProUGUI MintNFTScreen_Text_Taral;

    public TMP_InputField MnemonicsInputField;
    public GameObject ImportWalletScreen; //TODO: can remove, maybe
    public GameObject blockImage;
    public GameObject setup1Panel;
    public GameObject setup2Panel;

    #endregion

    private bool isOverlayOn = true;
    private string NFTLinkAdd;
    private string NFTLinkText;
    private int NftMintCandidateIndex = 0;

    private class NftUiElements
    {
        public TextMeshProUGUI MintNftScreenText; 
        public TextMeshProUGUI MintText;
        public Button MintButton;
        public Button MintNftScreenButton; 
        public Sprite CharacterSprite;
        public Sprite SelectedSprite;
        public Sprite UnselectedSprite;
        public string Name; 
        public string ImageUrl;
        public bool Locked; 
        
        public void SetSelected(bool selected)
        {
            bool owned = UserData.OwnsNft(this.Name);
            this.MintNftScreenButton.GetComponent<Image>().sprite = selected && owned ? this.SelectedSprite : this.UnselectedSprite;
            this.MintButton.GetComponent<Image>().sprite = selected && owned ? this.SelectedSprite : this.UnselectedSprite;

            if (selected && owned) {
                this.MintNftScreenText.text = "Selected";
                this.MintText.text = "Selected";
            } 
            else {
                if (this.Locked) {
                    if (owned) {
                        this.MintNftScreenText.text = "NFT Owned";
                        this.MintText.text = "Select";
                    }
                    else {
                        this.MintNftScreenText.text = "Locked";
                        this.MintText.text = "Locked";
                    }
                }
                else {
                    if (owned) {
                        this.MintNftScreenText.text = "NFT Owned";
                        this.MintText.text = "Select";
                    }
                    else {
                        this.MintNftScreenText.text = "Mint NFT";
                        this.MintText.text = "Mint NFT";
                    }
                }
            }
        }
    }

    private NftUiElements NftUiElements_Anna = new NftUiElements(); 
    private NftUiElements NftUiElements_Marshmallow = new NftUiElements();
    private NftUiElements NftUiElements_Taral = new NftUiElements();

    private List<NftUiElements> NftUiList = new List<NftUiElements>();

    private void Start()
    {
        this.NftUiList.Add(NftUiElements_Anna);
        this.NftUiList.Add(NftUiElements_Marshmallow);
        this.NftUiList.Add(NftUiElements_Taral);

        ActiveAddressText.text = SuiWallet.ActiveWalletAddress;
        NewWalletButton.gameObject.SetActive(false);

        //group Anna elements together
        NftUiElements_Anna.MintNftScreenText = MintNFTScreen_Text_Anna;
        NftUiElements_Anna.MintText = Mint_Text_Anna;
        NftUiElements_Anna.MintButton = Mint_Button_Anna;
        NftUiElements_Anna.MintNftScreenButton = MintNFTScreen_Button_Anna;
        NftUiElements_Anna.CharacterSprite = Character_Anna;
        NftUiElements_Anna.Name = "Anna";
        //TODO: (HIGH) hard-coded for now, but make it dynamic
        NftUiElements_Anna.ImageUrl = "http://game.soundbeats.io/nft-images/Anna.png";
        NftUiElements_Anna.SelectedSprite = sprite_Green;
        NftUiElements_Anna.UnselectedSprite = sprite_Pink;
        
        //group Marshmallow elements together
        NftUiElements_Marshmallow.MintNftScreenText = MintNFTScreen_Text_Mellow;
        NftUiElements_Marshmallow.MintText = Mint_Text_Mellow;
        NftUiElements_Marshmallow.MintButton = Mint_Button_Marshmallow;
        NftUiElements_Marshmallow.MintNftScreenButton = MintNFTScreen_Button_Marshmallow;
        NftUiElements_Marshmallow.CharacterSprite = Character_Melloow;
        NftUiElements_Marshmallow.Name = "Melloow";
        NftUiElements_Marshmallow.ImageUrl = "http://game.soundbeats.io/nft-images/Melloow.png";
        NftUiElements_Marshmallow.SelectedSprite = sprite_Green;
        NftUiElements_Marshmallow.UnselectedSprite = sprite_Pink;

        //group Taral elements together
        NftUiElements_Taral.MintNftScreenText = MintNFTScreen_Text_Taral;
        NftUiElements_Taral.MintText = Mint_Text_Taral;
        NftUiElements_Taral.MintButton = Mint_Button_Taral;
        NftUiElements_Taral.MintNftScreenButton = MintNFTScreen_Button_Taral;
        NftUiElements_Taral.CharacterSprite = Character_Taral;
        NftUiElements_Taral.Locked = true;
        NftUiElements_Taral.Name = "Taral";
        NftUiElements_Taral.ImageUrl = "http://game.soundbeats.io/nft-images/Taral.png";
        NftUiElements_Taral.SelectedSprite = sprite_Green;
        NftUiElements_Taral.UnselectedSprite = sprite_Pink;

        //Connect Wallet (click connect button)
        ConnectWalletButton.onClick.AddListener(() => {
            try {
                if (this.MartianWalletNotFound) {
                    Application.OpenURL("https://chrome.google.com/webstore/detail/martian-wallet-for-sui-ap/efbglgofoippbgcjepnhiblaibcnclgk");
                }
                else {
                    MessageToSign = GenerateRandomMessage();

                    //this is for development only
                    #if FAKE_SIGNIN
                        SignMessageCallback("AODvvPzbHqQOKnZBqz0+Km66s9TQNNTWtEawg8vQk+tT3k80aP+4mh+taz/+YqYYefPfnlOxNujyetqSWiR9+gKpKGbzUWas+HHgcEN+/d8Etd2QAQrAMMlRsEvIFejUHw==:0x94e666c0de3a5e3e2e730d40030d9ae5c5843c468ee23e49f4717a5cb8e57bfb");
                    #else  
                        CallSuiSignMessage(MessageToSign); 
                    #endif
                }
            }
            catch(Exception e) {
                SuiWallet.ErrorMessage = e.ToString();
            }
        }); 
        
        //Log Out (click logout button)
        onLogOutButton.onClick.AddListener(() =>
        {
            WalletScreen.SetActive(false);
            HomeScreen.SetActive(false);
            SelectCharacterScreen.SetActive(false);
            PlaySongScreen.SetActive(false);

            //retain selected index 
            int selectedIndex = -1; 
            
            string walletAddress = SuiWallet.ActiveWalletAddress;
            if (PlayerPrefsExtra.HasKey("selectedIndex")) 
                selectedIndex = PlayerPrefsExtra.GetInt("selectedIndex");
            
            PlayerPrefs.DeleteAll();

            SuiWallet.ActiveWalletAddress = walletAddress;
            if (selectedIndex >= 0)
                PlayerPrefsExtra.SetInt("selectedIndex", selectedIndex);

            //TODO: (HIGH) replace all PlayerData with UserData 
            PlayerData.NFTAddress ="";
            PlayerData.totalBalance = 0;

            setup2Panel.SetActive(false);
            setup1Panel.SetActive(true);
            SuiWalletScreen.SetActive(true);
        });
    
        ///Home Screen
        NFTButton.onClick.AddListener(() =>
        {
            Mint_NFTScreen.SetActive(true);
        });
 
        //Wallet 
        WalletButton_Home.onClick.AddListener(() =>
        {
            if (SuiWallet.HasActiveAddress()) 
            {
                NetworkManager.Instance.GetTokenBalance(SuiWallet.ActiveWalletAddress, OnSuccessfulGetTokenBalance, OnErrorGetTokenBalance);
                LoadingScreen.SetActive(true);
            }
        });

        //Select Character Screen

        //Mint Anna 
        Mint_Button_Anna.onClick.AddListener(() =>
        {
            MintButtonClick(0); 
        });

        //Mint Marshmallow 
        Mint_Button_Marshmallow.onClick.AddListener(() =>
        {
            MintButtonClick(1); 
        });

        //Mint Taral 
        Mint_Button_Taral.onClick.AddListener(() =>
        {
            MintButtonClick(2);
        });

        // Mint successful screen
        Mint_SuccessfulScreen_Close.onClick.AddListener(() =>
        {
            Mint_SuccessfulScreen.SetActive(false);
            Mint_NFTScreen.SetActive(false);
            SelectCharacter_Overlay.SetActive(false);
            txtMintCharacter.SetActive(false);
            isOverlayOn = false;
        });
      
        // Mint NFT Screen
        MintNFTScreen_Button_Anna.onClick.AddListener(() =>
        {
            MintNftScreenButtonClick(0); 
        });

        MintNFTScreen_Button_Marshmallow.onClick.AddListener(() =>
        {
            MintNftScreenButtonClick(1); 
        });

        MintNFTScreen_Button_Taral.onClick.AddListener(() =>
        {
            //MintNftScreenButtonClick(2);
        });

        MintNFTScreen_Button_Close.onClick.AddListener(() =>
        {
            Mint_NFTScreen.SetActive(false);
        });

        // Wallet Screen

        ClaimTokens_Button.onClick.AddListener(() =>
        {
            if (SuiWallet.HasActiveAddress()) 
            {
                WalletScreen.SetActive(false);
            
                RequestTokenDto requestTokenDto = new RequestTokenDto();
                requestTokenDto.amount = 100;
                requestTokenDto.recipient = SuiWallet.ActiveWalletAddress;
                NetworkManager.Instance.RequestToken(requestTokenDto, OnSuccessfulRequestToken, OnErrorRequestToken);
                LoadingScreen.SetActive(true);
            }
        });

        Close_WalletScreen.onClick.AddListener(() =>
        {
            WalletScreen.SetActive(false);
        });

        Close_LeaderboardScreen.onClick.AddListener(() =>
        {
            LeaderboardScreen.SetActive(false);
        });
        
        // ClaimTokens
        Close_ClaimTokens.onClick.AddListener(() =>
        {
            ClaimTokensScreen.SetActive(false);
            WalletScreen.SetActive(true);
            txtScore_WalletScreen.text = PlayerData.totalBalance.ToString();
        });

        MintNFT_LinkButton.onClick.AddListener(() =>
        {
            string nftSignature = PlayerPrefsExtra.GetString("nftSignature");
            Application.OpenURL(nftSignature);
        });

        WalletScreen_NFTAdd_Button.onClick.AddListener(() =>
        {
            Application.OpenURL(NFTLinkAdd);
        });

        ClaimScreen_NFTAdd_Button.onClick.AddListener(() =>
        {
            string transactionSign = PlayerPrefsExtra.GetString("nftSignature_claim");
            Debug.Log("link claim  " + transactionSign);
            Application.OpenURL(transactionSign);
        });
    }

    private void CreateNFT(string name, string imageUrl) 
    {
        CreateNFTRequestDto createNFTRequest = new CreateNFTRequestDto();
        createNFTRequest.name = name;
        createNFTRequest.imageUrl = imageUrl;
        createNFTRequest.quantity = 1;
        createNFTRequest.recipient = SuiWallet.ActiveWalletAddress;

        NetworkManager.Instance.CreateNFT(createNFTRequest, OnSuccessfulCreateNFT_Modify, OnErrorCreateNFT_Modify);
    }

    #region Login Methods 

    /// <summary>
    /// Generates a randomized string of numbers and letters, to be used as a message to sign in order to verify wallet ownership 
    /// (part of login process).
    /// </summary>
    /// <returns>Randomized alphanumeric string</returns>
    private string GenerateRandomMessage() 
    {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var stringChars = new char[SIGNING_MESSAGE_LENGTH];
        var random = new System.Random();

        for (int i = 0; i < stringChars.Length; i++)
            stringChars[i] = chars[random.Next(chars.Length)];

        //this is for development only
        #if FAKE_SIGNIN
            return "PpMoClvCn6IzrMewxpplO9skITR9vZoG";
        #else
            return new String(stringChars);
        #endif
    }

    /// <summary>
    /// Called from the Javascript front end after signing a message; passes back the user address and signed message signature.
    /// </summary>
    /// <param name="response">A string of two elements delimited by ':'. First element is the signature, the second element is 
    /// the user's wallet address (which was used to sign the message).</param>
    private void SignMessageCallback(string response)
    {
        Debug.Log("SignMessageCallback");
        string[] args = response.Split(':'); 

        if (args.Length > 0) 
        {
            //retrieve the wallet address and signature 
            string signature = args[0];
            string address = args[1];

            Debug.Log("signed message:" + signature);
            Debug.Log("wallet address:" + address);

            //prepare a request to verify the signature
            VerifySignatureDto request = new VerifySignatureDto();
            request.address = address;
            request.signature = System.Web.HttpUtility.UrlEncode(signature);
            request.message = MessageToSign;
        
            //call to verify signature
            NetworkManager.Instance.VerifySignature(request, OnSuccessfulVerifySignature, OnErrorVerifySignature);
            //this.VerifySignature(request, OnSuccessfulVerifySignature, OnErrorVerifySignature);
        }
    }

    /// <summary>
    /// After detecting the presence or non-presence of martian wallet, the front-end will call this callback. 
    /// </summary>
    /// <param name="detected"></param>
    private void DetectMartianWalletCallback(int detected)
    {
        if (detected == 0)
        {
            Debug.Log("DetectMartianWalletCallback false");
            //ShowError("You need to download that martian wallet sir");
            this.MartianWalletNotFound = true;
            var tmpText = ConnectWalletButton.GetComponentInChildren<TextMeshProUGUI>();
            tmpText.text = "Get Martian Wallet";
        }
        else 
        {
            this.MartianWalletNotFound = false;
            var tmpText = ConnectWalletButton.GetComponentInChildren<TextMeshProUGUI>();
            tmpText.text = "Connect Wallet";
        }
    }

    #endregion

    #region UI Methods 

    /// <summary>
    /// Shows the home screen (after logging in).
    /// </summary>
    private void ShowHomeScreen() 
    {
        HomeScreen.SetActive(true);
        PlaySongScreen.SetActive(true);
        NFTLinkAdd = SuiWallet.ErrorMessage.Length > 0 ? SuiWallet.ErrorMessage : SuiExplorer.FormatAddressUri(SuiWallet.ActiveWalletAddress);
        NFTLinkText = SuiWallet.ActiveWalletAddress;
        
        txtAddressNFT_WalletScreen.text = NFTLinkText;
        string nftSignature = PlayerPrefsExtra.GetString("nftSignature");
        link_successful.text = nftSignature;

        SelectCharacterScreen.SetActive(true);
        SelectCharacter_Overlay.SetActive(false);
        txtMintCharacter.SetActive(false);
        
        if(UserData.HasSelectedNft && UserData.OwnedNftCount > 0)
        {
            //this is hiding the NFT minting overlay 
            blockImage.SetActive(false);
            isOverlayOn = false;
        }
        else
        {
            //this is showing the NFT minting overlay 
            blockImage.SetActive(true);
            SelectCharacter_Overlay.SetActive(true);
            isOverlayOn = true;
        }

        this.SetSelectedNfts();
    }

    /// <summary>
    /// Opens the NFT 
    /// </summary>
    private void ShowNftScreen()
    {
        Mint_NFTScreen.SetActive(true);
    }

    //TODO: (LOW) I don't think this method is ever called 
    public void SelectNfts()
    { 
        if (PlayerPrefsExtra.HasKey(SuiWallet.WalletAddressKey))
        {
            HomeScreen.SetActive(true);
            PlaySongScreen.SetActive(true);
            NFTLinkAdd = SuiWallet.ErrorMessage.Length > 0 ? SuiWallet.ErrorMessage : SuiExplorer.FormatAddressUri(SuiWallet.ActiveWalletAddress);
            NFTLinkText = SuiWallet.ActiveWalletAddress;

            txtAddressNFT_WalletScreen.text = NFTLinkText;
            string nftSignature = PlayerPrefsExtra.GetString("nftSignature");
            link_successful.text = nftSignature;

            SelectCharacterScreen.SetActive(true);
            SelectCharacter_Overlay.SetActive(false);
            txtMintCharacter.SetActive(false);

            if (PlayerPrefsExtra.HasKey("selectedIndex"))
            {
                blockImage.SetActive(false);
                isOverlayOn = false;
            }
            else
            {
                blockImage.SetActive(true);
                SelectCharacter_Overlay.SetActive(true);
                isOverlayOn = true;
            }

            this.SetSelectedNfts();
        }
        else
        {
            blockImage.SetActive(true);
        }
    }

    /// <summary>
    /// Shows the user's wallet and token balance
    /// </summary>
    public void ShowNFTWallet()
    {
        if (SuiWallet.HasActiveAddress()) 
        {
            NetworkManager.Instance.GetTokenBalance(SuiWallet.ActiveWalletAddress, OnSuccessfulGetTokenBalance, OnErrorGetTokenBalance);
            LoadingScreen.SetActive(true);
        }
    }

    /// <summary>
    /// Shows the screen that allows users to choose an NFT image as their player avatar. 
    /// </summary>
    //TODO: (LOW) not sure when this is ever called
    public void ShowPlayerSelectionScreen()
    {
        this.SetSelectedNfts();
        Mint_NFTScreen.SetActive(true);
    }

    /// <summary>
    /// This handles the Mint NFT or Select button click on the home screen. 
    /// </summary>
    /// <param name="index"></param>
    private void MintButtonClick(int index) {
        var selectedNft = this.NftUiList[index];

        //ignore the locked 
        if (selectedNft.Locked)
            return; 

        if (!UserData.OwnsNft(selectedNft.Name) && SuiWallet.HasActiveAddress())
        {
            this.NftMintCandidateIndex = index;
            this.CreateNFT(selectedNft.Name, selectedNft.ImageUrl);
            LoadingScreen.SetActive(true);
            blockImage.SetActive(false);

            //Total NFT owned by user and its index number
            //TODO: (MED) what is this doing? 
            if (!GameManager.Instance.NFTOwned.Contains(index))
            {
                GameManager.Instance.NFTOwned.Add(index);

                PlayerPrefsExtra.SetInt("NFTOwned_count", GameManager.Instance.NFTOwned.Count);

                for (int i = 0; i < GameManager.Instance.NFTOwned.Count; i++)
                    PlayerPrefsExtra.SetInt("NFTOwned_" + i, GameManager.Instance.NFTOwned[i]);
            }
        }
        else
        {
            if (UserData.OwnsNft(selectedNft.Name))
            {
                this.SetSelectedNft(index);
            }
            else
            {
                ShowNftScreen();
            }
        }
    }

    /// <summary>
    /// This handles Mint NFT or Select button click on the NFT pop-up screen that comes up when you click "NFT" in 
    /// the top right corner. 
    /// </summary>
    /// <param name="index">The index of the clicked item.</param>
    private void MintNftScreenButtonClick(int index) 
    {
        var selectedItem = this.NftUiList[index]; 

        if (!UserData.OwnsNft(selectedItem.Name) && SuiWallet.HasActiveAddress())
        {
            this.NftMintCandidateIndex = index;
            this.CreateNFT(selectedItem.Name, selectedItem.ImageUrl);
            LoadingScreen.SetActive(true);
        }
        else {
            this.SetSelectedNft(index);
        }

        //Total NFT owned by user and its index number
        //TODO: (MED) not sure why this is needed 
        if(!GameManager.Instance.NFTOwned.Contains(index))
        {
            GameManager.Instance.NFTOwned.Add(index);
            PlayerPrefsExtra.SetInt("NFTOwned_count", GameManager.Instance.NFTOwned.Count);

            for (int i = 0; i < GameManager.Instance.NFTOwned.Count; i++)
                PlayerPrefsExtra.SetInt("NFTOwned_" + i, GameManager.Instance.NFTOwned[i]);
        }
    }

    /// <summary>
    /// Sets the NFT that's currently selected, and updates the UI accordingly. 
    /// </summary>
    /// <param name="index">The index of the selected NFT.</param>
    private void SetSelectedNft(int index)
    {
        if (UserData.OwnsNft(index))
            UserData.SelectedNftIndex = index;
        this.SetSelectedNfts();
    }

    /// <summary>
    /// This goes through the list of NFT UI elements, and sets the correct colors, text, etc. for each one based on 
    /// whether or not the NFT is owned, selected, or locked.
    /// </summary>
    private void SetSelectedNfts() 
    {
        for (int n=0; n<this.NftUiList.Count; n++) 
        {
            var item = this.NftUiList[n];
            if (UserData.SelectedNftIndex == n) {
                item.SetSelected(true); 
            }
            else {
                item.SetSelected(false); 
            }
        }
    }

    #endregion

    #region API Callbacks 

    private void OnErrorCreateNFT(string error)
    {
        this.ShowError(error);
    }

    private void OnSuccessfulRequestToken(RequestTokenResponseDto requestTokenResponseDto)
    {
        string transactionLink = SuiExplorer.FormatTransactionUri(requestTokenResponseDto.signature);
        PlayerPrefsExtra.SetString("nftSignature_claim", transactionLink);
       
        txtAddressNFT_ClaimScreen.text = transactionLink;
        LoadingScreen.SetActive(false);
        ClaimTokensScreen.SetActive(true);
       
        //TODO: (LOW) this should be gotten from the response; should not be counted manually
        PlayerData.totalBalance += 100;
        txtScore_ClaimScreen.text = "100";
        Debug.Log("signature...>" + requestTokenResponseDto.signature + PlayerData.totalBalance);
    }

    private void OnErrorRequestToken(string error)
    {
        this.ShowError(error);
    }

    private void OnSuccessfulGetTokenBalance(GetTokenBalanceResponseDto getTokenBalanceResponseDto)
    {
        LoadingScreen.SetActive(false);
        WalletScreen.SetActive(true);
        Debug.Log(getTokenBalanceResponseDto.balance);
        PlayerData.totalBalance = getTokenBalanceResponseDto.balance;
        txtScore_WalletScreen.text = getTokenBalanceResponseDto.balance.ToString();
        Debug.Log(txtScore_WalletScreen.text);
    }

    private void OnErrorGetTokenBalance(string error)
    {
        this.ShowError(error);
    }

    private void OnSuccessfulGetBeatsNfts(GetBeatsNftsResponseDto getNftsResponseDto)
    {
        GameManager.Instance.NFTOwned.Clear();

        //figure out which nfts they own 
        foreach(BeatsNftDto nft in getNftsResponseDto.nfts) {
            if (nft.name == "Anna") {
                GameManager.Instance.NFTOwned.Add(0); 
            }
            else if (nft.name == "Melloow") {
                GameManager.Instance.NFTOwned.Add(1); 
            }
        }
        
        UserData.SetOwnedNfts(getNftsResponseDto); 

        //allow entry into game
        ShowHomeScreen();
    }

    private void OnErrorGetBeatsNfts(string error)
    {
        ShowHomeScreen();
        this.ShowError(error);
    }

    private void OnSuccessfulVerifySignature(VerifySignatureResponseDto verifySignatureResponseDto)
    {
        //set active wallet address 
        if (verifySignatureResponseDto.verified) 
        {
            #if FAKE_SIGNIN
                verifySignatureResponseDto.address = "0xb1e46b730d2be47e337ac1275fca9a56fa27b6b244b154f8a6f6899de69c1cf0"; 
            #endif 

            SuiWallet.ActiveWalletAddress = verifySignatureResponseDto.address; 

            //get user owned NFTs
            NetworkManager.Instance.GetUserOwnedBeatsNfts(verifySignatureResponseDto.address, OnSuccessfulGetBeatsNfts, OnErrorGetBeatsNfts); 
        }
        else 
        {
            ErrorScreen.SetActive(true);
            txtError_ErrorScreen.text = verifySignatureResponseDto.address + ", " + verifySignatureResponseDto.failureReason;
        }
    }

    private void OnErrorVerifySignature(string error)
    {
        this.ShowError(error);
    }

    private void OnSuccessfulCreateNFT_Modify(CreateNFTResponseDto createNFTResponseDto)
    {
        //add the new NFT to user data 
        var newNft = this.NftUiList[this.NftMintCandidateIndex]; 
        UserData.AddNft(newNft.Name);

        //this is probably not necessary 
        PlayerData.NFTAddress = createNFTResponseDto.addresses[0];

        //display the transaction link 
        string NFTAdd = SuiExplorer.FormatTransactionUri(createNFTResponseDto.signature);
        link_successful.text = NFTAdd;
        PlayerPrefsExtra.SetString("nftSignature", NFTAdd);

        //UI changes 
        this.SetSelectedNft(this.NftMintCandidateIndex);
        LoadingScreen.SetActive(false);
        Mint_SuccessfulScreen_Image.sprite = this.NftUiList[this.NftMintCandidateIndex].CharacterSprite;
        Mint_SuccessfulScreen.SetActive(true);
    }

    private void OnErrorCreateNFT_Modify(string error)
    {
        this.ShowError(error);
    }

    private void ShowError(string error) 
    {
        LoadingScreen.SetActive(false);
        ErrorScreen.SetActive(true);
        txtError_ErrorScreen.text = error;
    }

    #endregion 
}
