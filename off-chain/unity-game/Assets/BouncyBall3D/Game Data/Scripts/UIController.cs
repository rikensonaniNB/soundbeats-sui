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
    private const bool FAKE_SIGNIN = true;

    private static string MessageToSign = "";

    //call to request the front end Javascript code to sign a message 
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void CallSuiSignMessage(string msg);

    //call to request the front end Javascript to detect presence of Martian wallet 
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void DetectMartianWallet(); 

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
    public GameObject ImportWalletScreen;
    public GameObject blockImage;
    public GameObject setup1Panel;
    public GameObject setup2Panel;

    #endregion

    private bool isOverlayOn = true;
    private string NFTLinkAdd;
    private string NFTLinkText;

    private struct NftUiElements
    {
        public TextMeshProUGUI MintNftScreenText; 
        public TextMeshProUGUI MintText;
        public Button MintButton;
        public Button MintNftScreenButton; 
        public Sprite CharacterSprite;
    }

    private NftUiElements NftUiElements_Anna; 
    private NftUiElements NftUiElements_Taral;
    private NftUiElements NftUiElements_Marshmallow;

    private void Start()
    {
        ActiveAddressText.text = SuiWallet.GetActiveAddress();
        PlayerData.NFTRecipient = SuiWallet.GetActiveAddress();
        NewWalletButton.gameObject.SetActive(false);

        NftUiElements_Anna.MintNftScreenText = MintNFTScreen_Text_Anna;
        NftUiElements_Anna.MintText = Mint_Text_Anna;
        NftUiElements_Anna.MintButton = Mint_Button_Anna;
        NftUiElements_Anna.MintNftScreenButton = MintNFTScreen_Button_Anna;
        NftUiElements_Anna.CharacterSprite = Character_Anna;

        NftUiElements_Taral.MintNftScreenText = MintNFTScreen_Text_Taral;
        NftUiElements_Taral.MintText = Mint_Text_Taral;
        NftUiElements_Taral.MintButton = Mint_Button_Taral;
        NftUiElements_Taral.MintNftScreenButton = MintNFTScreen_Button_Taral;
        NftUiElements_Taral.CharacterSprite = Character_Taral;
        
        NftUiElements_Marshmallow.MintNftScreenText = MintNFTScreen_Text_Mellow;
        NftUiElements_Marshmallow.MintText = Mint_Text_Mellow;
        NftUiElements_Marshmallow.MintButton = Mint_Button_Marshmallow;
        NftUiElements_Marshmallow.MintNftScreenButton = MintNFTScreen_Button_Marshmallow;
        NftUiElements_Marshmallow.CharacterSprite = Character_Melloow;

        ConnectWalletButton.onClick.AddListener(() => {
            try {
                MessageToSign = GenerateRandomMessage();

                //this is for development only
                if (FAKE_SIGNIN) 
                    SignMessageCallback("AODvvPzbHqQOKnZBqz0+Km66s9TQNNTWtEawg8vQk+tT3k80aP+4mh+taz/+YqYYefPfnlOxNujyetqSWiR9+gKpKGbzUWas+HHgcEN+/d8Etd2QAQrAMMlRsEvIFejUHw==:0x94e666c0de3a5e3e2e730d40030d9ae5c5843c468ee23e49f4717a5cb8e57bfb");
                else  
                    CallSuiSignMessage(MessageToSign); 
            }
            catch(Exception e) {
                SuiWallet.ErrorMessage = e.ToString();
            }
        }); 
       
        if (PlayerPrefs.HasKey(SuiWallet.WalletAddressKey))
        {
            ShowHomeScreen(); 
        }
        
        onLogOutButton.onClick.AddListener(() =>
        {
            WalletScreen.SetActive(false);
            HomeScreen.SetActive(false);
            SelectCharacterScreen.SetActive(false);
            PlaySongScreen.SetActive(false);
            PlayerPrefs.DeleteAll();
            PlayerData.SelectedNFTName = "";
            PlayerData.NFTRecipient = "";
            PlayerData.NFTAddress ="";
            PlayerData.SelectIndex = 0;
            PlayerData.totalBalance=0;
            setup2Panel.SetActive(false);
            setup1Panel.SetActive(true);
            SuiWalletScreen.SetActive(true);
        });
    
        ///Home Screen
        NFTButton.onClick.AddListener(() =>
        {
            Mint_NFTScreen.SetActive(true);
            if (PlayerData.SelectIndex==0 && PlayerPrefs.HasKey("selectedIndex"))
            {
                if(PlayerPrefs.GetInt("NFTOwned_count") > 1)
                {
                    MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                    MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().color = Color.black;

                    MintNFTScreen_Text_Anna.text = "NFT Owned";
                    MintNFTScreen_Text_Mellow.text = "NFT Owned";
                    MintNFTScreen_Text_Taral.text = "Locked";
                }
                else
                {
                    MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                    MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().color = Color.black;

                    MintNFTScreen_Text_Anna.text = "NFT Owned";
                    MintNFTScreen_Text_Mellow.text = "Mint NFT";
                    MintNFTScreen_Text_Taral.text = "Locked";
                }

            }
            else if (PlayerData.SelectIndex==1)
            {
                if (PlayerPrefs.GetInt("NFTOwned_count") > 1)
                {
                    MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().color = Color.black;

                    MintNFTScreen_Text_Anna.text = "NFT Owned";
                    MintNFTScreen_Text_Mellow.text = "NFT Owned";
                    MintNFTScreen_Text_Taral.text = "Locked";
                }
                else
                {
                    MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().color = Color.black;

                    MintNFTScreen_Text_Anna.text = "Mint NFT";
                    MintNFTScreen_Text_Mellow.text = "NFT Owned";
                    MintNFTScreen_Text_Taral.text = "Locked";
                }
            }
            else if (PlayerData.SelectIndex==2)
            {
                MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Green;

                MintNFTScreen_Text_Anna.text = "Mint NFT";
                MintNFTScreen_Text_Mellow.text = "Mint NFT";
                MintNFTScreen_Text_Taral.text = "NFT Owned";
            }
        });
 
        WalletButton_Home.onClick.AddListener(() =>
        {
            NetworkManager.Instance.GetTokenBalance(PlayerData.NFTRecipient, OnSuccessfulGetTokenBalance, OnErrorGetTokenBalance);
            LoadingScreen.SetActive(true);
        });

        NFTButton.onClick.AddListener(() =>
        {
            Mint_NFTScreen.SetActive(true);
        });

        //Select Character Screen
        Mint_Button_Anna.onClick.AddListener(() =>
        {
            if (isOverlayOn)
            {
                Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

                Mint_Text_Anna.text = "Selected";
                Mint_Text_Mellow.text = "Mint NFT";
                Mint_Text_Taral.text = "Locked";

                PlayerData.SelectedNFTName = "Anna";

                //TODO: similar code is repeated many times 
                PlayerData.SelectIndex = 0;
                PlayerPrefs.SetString("selectedIndex", "0");
                CreateNFTRequestDto createNFTRequest_anna = new CreateNFTRequestDto();
                createNFTRequest_anna.name = "Anna";
                createNFTRequest_anna.imageUrl = "char_15.png";
                createNFTRequest_anna.quantity = 1;
                createNFTRequest_anna.recipient = SuiWallet.GetActiveAddress();
                NetworkManager.Instance.CreateNFT(createNFTRequest_anna, OnSuccessfulCreateNFT, OnErrorCreateNFT);
                LoadingScreen.SetActive(true);
                blockImage.SetActive(false);

                //TODO: can be removed 
                /*
                NFTManager.instance.SendNFTOwned(
                    ServerConfig.LeaderboardNFT_API_URL_FORMAT + ServerConfig.API_POST_NFT_Create, 
                    "NFT_0", 
                    PlayerPrefs.GetString(SuiWallet.WalletAddressKey)
                );
                */

                //Total NFT owned by user and its index number
                if (!GameManager.Instance.NFTOwned.Contains(0))
                {
                    GameManager.Instance.NFTOwned.Add(0);
                    PlayerPrefs.SetInt("NFTOwned_count", GameManager.Instance.NFTOwned.Count);

                    for (int i = 0; i < GameManager.Instance.NFTOwned.Count; i++)
                        PlayerPrefs.SetInt("NFTOwned_" + i, GameManager.Instance.NFTOwned[i]);
                }


                /*  PlayerData.SelectIndex = 0;
                  Mint_SuccessfulScreen.SetActive(true);
                  Mint_SuccessfulScreen_Image.sprite = Character_Anna;*/
            }
            else
            {
                if (GameManager.Instance.NFTOwned.Contains(0))
                {
                    Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                    Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                    Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

                    if (GameManager.Instance.NFTOwned.Contains(1))
                    {
                        Mint_Text_Anna.text = "Selected";
                        Mint_Text_Mellow.text = "Select";
                        Mint_Text_Taral.text = "Locked";
                    }
                    else
                    {
                        Mint_Text_Anna.text = "Selected";
                        Mint_Text_Mellow.text = "Mint NFT";
                        Mint_Text_Taral.text = "Locked";
                    }


                    PlayerData.SelectedNFTName = "Anna";

                    PlayerData.SelectIndex = 0;
                    PlayerPrefs.SetString("selectedIndex", "0");
                }
                else
                {
                    ShowNftScreen();
                }
            }
        });

        Mint_Button_Marshmallow.onClick.AddListener(() =>
        {
            if (isOverlayOn)
            {
                Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

                Mint_Text_Anna.text = "Mint NFT";
                Mint_Text_Mellow.text = "Selected";
                Mint_Text_Taral.text = "Locked";

                PlayerData.SelectedNFTName = "Melloow";

                PlayerData.SelectIndex = 1;
                PlayerPrefs.SetString("selectedIndex", "1");
                CreateNFTRequestDto createNFTRequest_Melloow = new CreateNFTRequestDto();
                createNFTRequest_Melloow.name = "Melloow";
                createNFTRequest_Melloow.imageUrl = "char_19.png";
                createNFTRequest_Melloow.quantity = 1;
                createNFTRequest_Melloow.recipient = SuiWallet.GetActiveAddress();
                NetworkManager.Instance.CreateNFT(createNFTRequest_Melloow, OnSuccessfulCreateNFT, OnErrorCreateNFT);
                LoadingScreen.SetActive(true);
                blockImage.SetActive(false);

                
                //TODO: can be removed 
                /*
                NFTManager.instance.SendNFTOwned(
                    ServerConfig.LeaderboardNFT_API_URL_FORMAT + ServerConfig.API_POST_NFT_Create, 
                    "NFT_1", 
                    PlayerPrefs.GetString(SuiWallet.WalletAddressKey)
                );
                */

                //Total NFT owned by user and its index number
                if (!GameManager.Instance.NFTOwned.Contains(1))
                {
                    GameManager.Instance.NFTOwned.Add(1);
                    PlayerPrefs.SetInt("NFTOwned_count", GameManager.Instance.NFTOwned.Count);

                    for (int i = 0; i < GameManager.Instance.NFTOwned.Count; i++)
                        PlayerPrefs.SetInt("NFTOwned_" + i, GameManager.Instance.NFTOwned[i]);
                }

                /*PlayerData.SelectIndex = 1;
                Mint_SuccessfulScreen.SetActive(true);
                Mint_SuccessfulScreen_Image.sprite = Character_Melloow;*/
            }
            else
            {
                if (GameManager.Instance.NFTOwned.Contains(1))
                {
                    Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                    Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                    Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

                    if (GameManager.Instance.NFTOwned.Contains(0))
                    {
                        Mint_Text_Anna.text = "Select";
                        Mint_Text_Mellow.text = "Selected";
                        Mint_Text_Taral.text = "Locked";
                    }
                    else
                    {
                        Mint_Text_Anna.text = "Mint NFT";
                        Mint_Text_Mellow.text = "Selected";
                        Mint_Text_Taral.text = "Locked";
                    }

                    PlayerData.SelectedNFTName = "Melloow";

                    PlayerData.SelectIndex = 1;
                    PlayerPrefs.SetString("selectedIndex", "1");
                }
                else
                {
                    ShowNftScreen();
                }
            }
        });

        Mint_Button_Taral.onClick.AddListener(() =>
        {
            if (isOverlayOn)
            {
                /*Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Green;

                Mint_Text_Anna.text = "Mint NFT";
                Mint_Text_Mellow.text = "Mint NFT";
                Mint_Text_Taral.text = "NFT Owned";

                PlayerData.SelectedNFTName = "Taral";

                PlayerData.SelectIndex = 2;
                CreateNFTRequestDto createNFTRequest_Taral = new CreateNFTRequestDto();
                createNFTRequest_Taral.name = "Taral";
                createNFTRequest_Taral.imageUrl = "char_Taral.png";
                createNFTRequest_Taral.quantity = 1;
                createNFTRequest_Taral.recipient = SuiWallet.GetActiveAddress();
                NetworkManager.Instance.CreateNFT(createNFTRequest_Taral, OnSuccessfulCreateNFT, OnErrorCreateNFT);
                LoadingScreen.SetActive(true);

                PlayerData.SelectIndex = 3;
                Mint_SuccessfulScreen.SetActive(true);
                Mint_SuccessfulScreen_Image.sprite = Character_Taral;*/
            }
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
            if (PlayerData.SelectIndex != 0 || !PlayerPrefs.HasKey("NFTOwned_count"))
            {
                Debug.LogError("Index : " + PlayerData.SelectIndex + "Has Key : " + PlayerPrefs.HasKey("NFTOwned_count") + " count : " + PlayerPrefs.GetInt("NFTOwned_count"));
                
                if(PlayerPrefs.HasKey("NFTOwned_count") && PlayerPrefs.GetInt("NFTOwned_count") > 0)
                {
                    Debug.LogError("called");
                    MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                    MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

                    MintNFTScreen_Text_Anna.text = "NFT Owned";
                    MintNFTScreen_Text_Mellow.text = "NFT Owned";
                    MintNFTScreen_Text_Taral.text = "Locked";
                    PlayerData.SelectedNFTName = "Anna";

                    Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                    Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                    Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;


                    Mint_Text_Anna.text = "Selected";
                    Mint_Text_Mellow.text = "Select";
                    Mint_Text_Taral.text = "Locked";
                }
                else
                {
                    MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                    MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

                    MintNFTScreen_Text_Anna.text = "NFT Owned";
                    MintNFTScreen_Text_Mellow.text = "Mint NFT";
                    MintNFTScreen_Text_Taral.text = "Locked";
                    PlayerData.SelectedNFTName = "Anna";

                    Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                    Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                    Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;


                    Mint_Text_Anna.text = "Selected";
                    Mint_Text_Mellow.text = "Mint NFT";
                    Mint_Text_Taral.text = "Locked";
                }
                
                PlayerData.SelectIndex = 0;
                PlayerPrefs.SetString("selectedIndex", "0");

                if (!GameManager.Instance.NFTOwned.Contains(0))
                {
                    CreateNFTRequestDto createNFTRequest_anna = new CreateNFTRequestDto();
                    createNFTRequest_anna.name = "Anna";
                    createNFTRequest_anna.imageUrl = "char_15.png";
                    createNFTRequest_anna.quantity = 1;
                    createNFTRequest_anna.recipient = SuiWallet.GetActiveAddress();
                    NetworkManager.Instance.CreateNFT(createNFTRequest_anna, OnSuccessfulCreateNFT_Modify, OnErrorCreateNFT_Modify);
                    LoadingScreen.SetActive(true);
                        
                    //TODO: can be removed 
                    /*
                    NFTManager.instance.SendNFTOwned(
                        ServerConfig.LeaderboardNFT_API_URL_FORMAT + ServerConfig.API_POST_NFT_Create, 
                        "NFT_0", 
                        PlayerPrefs.GetString(SuiWallet.WalletAddressKey)
                    );
                    */
                }

                //Total NFT owned by user and its index number
                if(!GameManager.Instance.NFTOwned.Contains(0))
                {
                    GameManager.Instance.NFTOwned.Add(0);
                    PlayerPrefs.SetInt("NFTOwned_count", GameManager.Instance.NFTOwned.Count);

                    for (int i = 0; i < GameManager.Instance.NFTOwned.Count; i++)
                        PlayerPrefs.SetInt("NFTOwned_" + i, GameManager.Instance.NFTOwned[i]);
                }

                

                /*Mint_SuccessfulScreen.SetActive(true);
                Mint_SuccessfulScreen_Image.sprite = Character_Anna;

                Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;*/
            }
        });

        MintNFTScreen_Button_Marshmallow.onClick.AddListener(() =>
        {
            if (PlayerData.SelectIndex != 1)
            {
                Debug.LogError("Index : " + PlayerData.SelectIndex + "Has Key : " + PlayerPrefs.HasKey("NFTOwned_count") + " count : " + PlayerPrefs.GetInt("NFTOwned_count"));

                if (PlayerPrefs.HasKey("NFTOwned_count") && PlayerPrefs.GetInt("NFTOwned_count") > 0)
                {
                    Debug.LogError("called");
                    MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

                    MintNFTScreen_Text_Anna.text = "NFT Owned";
                    MintNFTScreen_Text_Mellow.text = "NFT Owned";
                    MintNFTScreen_Text_Taral.text = "Locked";
                    PlayerData.SelectedNFTName = "Melloow";

                    Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                    Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                    Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

                    Mint_Text_Anna.text = "Select";
                    Mint_Text_Mellow.text = "Selected";
                    Mint_Text_Taral.text = "Locked";
                }
                else
                {
                    MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                    MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;
                    MintNFTScreen_Text_Anna.text = "Mint NFT";
                    MintNFTScreen_Text_Mellow.text = "NFT Owned";
                    MintNFTScreen_Text_Taral.text = "Locked";
                    PlayerData.SelectedNFTName = "Melloow";

                    Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                    Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                    Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

                    Mint_Text_Anna.text = "Mint NFT";
                    Mint_Text_Mellow.text = "Selected";
                    Mint_Text_Taral.text = "Locked";
                }
                
                if(!GameManager.Instance.NFTOwned.Contains(1))
                {
                    /////////////////////////////

                    CreateNFTRequestDto createNFTRequest_Melloow = new CreateNFTRequestDto();
                    createNFTRequest_Melloow.name = "Melloow";
                    createNFTRequest_Melloow.imageUrl = "char_19.png";
                    createNFTRequest_Melloow.quantity = 1;
                    createNFTRequest_Melloow.recipient = SuiWallet.GetActiveAddress();
                    NetworkManager.Instance.CreateNFT(createNFTRequest_Melloow, OnSuccessfulCreateNFT_Modify, OnErrorCreateNFT_Modify);
                    LoadingScreen.SetActive(true);
                    
                    //TODO: can be removed 
                    /*
                    NFTManager.instance.SendNFTOwned(
                        ServerConfig.LeaderboardNFT_API_URL_FORMAT + ServerConfig.API_POST_NFT_Create, 
                        "NFT_1", 
                        PlayerPrefs.GetString(SuiWallet.WalletAddressKey)
                    );
                    */
                }

                PlayerData.SelectIndex = 1;
                PlayerPrefs.SetString("selectedIndex", "1");

                //Total NFT owned by user and its index number
                if (!GameManager.Instance.NFTOwned.Contains(1))
                {
                    GameManager.Instance.NFTOwned.Add(1);
                    PlayerPrefs.SetInt("NFTOwned_count", GameManager.Instance.NFTOwned.Count);

                    for (int i = 0; i < GameManager.Instance.NFTOwned.Count; i++)
                        PlayerPrefs.SetInt("NFTOwned_" + i, GameManager.Instance.NFTOwned[i]);
                }

                

                /*Mint_SuccessfulScreen.SetActive(true);
                Mint_SuccessfulScreen_Image.sprite = Character_Melloow;
                Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;*/
            }
        });

        MintNFTScreen_Button_Taral.onClick.AddListener(() =>
        {
            if (PlayerData.SelectIndex != 2)
            {
                /*MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Green;
                MintNFTScreen_Text_Anna.text = "Mint NFT";
                MintNFTScreen_Text_Mellow.text = "Mint NFT";
                MintNFTScreen_Text_Taral.text = "NFT Owned";
                PlayerData.SelectedNFTName = "Taral";

                Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Green;

                Mint_Text_Anna.text = "Mint NFT";
                Mint_Text_Mellow.text = "Mint NFT";
                Mint_Text_Taral.text = "NFT Owned";


                PlayerData.SelectIndex = 2;
                CreateNFTRequestDto createNFTRequest_Taral = new CreateNFTRequestDto();
                createNFTRequest_Taral.name = "Taral";
                createNFTRequest_Taral.imageUrl = "char_Taral.png";
                createNFTRequest_Taral.quantity = 1;
                createNFTRequest_Taral.recipient = SuiWallet.GetActiveAddress();
                NetworkManager.Instance.CreateNFT(createNFTRequest_Taral, OnSuccessfulCreateNFT, OnErrorCreateNFT);
                LoadingScreen.SetActive(true);*/

                /*
                Mint_SuccessfulScreen.SetActive(true);
                Mint_SuccessfulScreen_Image.sprite = Character_Taral;

                Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Green;*/
            }
        });

        MintNFTScreen_Button_Close.onClick.AddListener(() =>
        {
            Mint_NFTScreen.SetActive(false);
        });

        // Wallet Screen

        ClaimTokens_Button.onClick.AddListener(() =>
        {
            WalletScreen.SetActive(false);
          
            RequestTokenDto requestTokenDto = new RequestTokenDto();
            requestTokenDto.amount = 100;
            requestTokenDto.recipient = PlayerData.NFTRecipient;
            NetworkManager.Instance.RequestToken(requestTokenDto, OnSuccessfulRequestToken, OnErrorRequestToken);
            LoadingScreen.SetActive(true);
            //link_successful.text = PlayerData.NFTRecipient;
            //Debug.Log(PlayerData.NFTRecipient);
            //Debug.Log(PlayerData.NFTAddress);
            //ClaimTokensScreen.SetActive(true);
            //txtScore_ClaimScreen.text = "100";
           
        });

        Close_WalletScreen.onClick.AddListener(() =>
        {
            WalletScreen.SetActive(false);
        });
        ////////////////////////////////////

        // Close Leaderboard/////////////////////
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
            string nftSignature = PlayerPrefs.GetString("nftSignature");
            Application.OpenURL(nftSignature);
        });

        WalletScreen_NFTAdd_Button.onClick.AddListener(() =>
        {
            Application.OpenURL(NFTLinkAdd);
        });

        ClaimScreen_NFTAdd_Button.onClick.AddListener(() =>
        {
            string transactionSign = PlayerPrefs.GetString("nftSignature_claim");
            Debug.Log("link claim  " + transactionSign);
            Application.OpenURL(transactionSign);
        });
    }

    #region Login Methods 

    /// <summary>
    /// Generates a randomized string of numbers and letters, to be used as a message to sign in order to verify wallet ownership 
    /// (part of login process).
    /// </summary>
    /// <returns>Randomized alphanumeric string</returns>
    public string GenerateRandomMessage() 
    {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var stringChars = new char[SIGNING_MESSAGE_LENGTH];
        var random = new System.Random();

        for (int i = 0; i < stringChars.Length; i++)
            stringChars[i] = chars[random.Next(chars.Length)];

        //this is for development only
        if (FAKE_SIGNIN) 
            return "PpMoClvCn6IzrMewxpplO9skITR9vZoG";

        return new String(stringChars);
    }

    /// <summary>
    /// Called from the Javascript front end after signing a message; passes back the user address and signed message signature.
    /// </summary>
    /// <param name="response">A string of two elements delimited by ':'. First element is the signature, the second element is 
    /// the user's wallet address (which was used to sign the message).</param>
    public void SignMessageCallback(string response)
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
    public void DetectMartianWalletCallback(int detected)
    {
        if (detected > 0)
            Debug.Log("DetectMartianWalletCallback true");
        else
            Debug.Log("DetectMartianWalletCallback false");
    }

    #endregion

    #region UI Methods 

    /// <summary>
    /// Shows the home screen (after logging in).
    /// </summary>
    void ShowHomeScreen() 
    {
        HomeScreen.SetActive(true);
        PlaySongScreen.SetActive(true);
        NFTLinkAdd = SuiWallet.ErrorMessage.Length > 0 ? SuiWallet.ErrorMessage : SuiExplorer.FormatAddressUri(SuiWallet.GetActiveAddress());
        NFTLinkText = SuiWallet.GetActiveAddress();
        
        txtAddressNFT_WalletScreen.text = NFTLinkText;
        string nftSignature = PlayerPrefs.GetString("nftSignature");
        link_successful.text = nftSignature;

        SelectCharacterScreen.SetActive(true);
        SelectCharacter_Overlay.SetActive(false);
        txtMintCharacter.SetActive(false);
        
        if(PlayerPrefs.HasKey("selectedIndex"))
        {
            blockImage.SetActive(false);
            PlayerData.SelectIndex = int.Parse(PlayerPrefs.GetString("selectedIndex"));
            isOverlayOn = false;
        }
        else
        {
            blockImage.SetActive(true);
            SelectCharacter_Overlay.SetActive(true);
            isOverlayOn = true;
        }

        if (PlayerData.SelectIndex == 0 && PlayerPrefs.HasKey("selectedIndex"))
        {
            Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
            Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

            if(PlayerPrefs.GetInt("NFTOwned_count") == 2)
            {
                Mint_Text_Anna.text = "Selected";
                Mint_Text_Mellow.text = "Select";
                Mint_Text_Taral.text = "Locked";
            }
            else
            {
                Mint_Text_Anna.text = "Selected";
                Mint_Text_Mellow.text = "Mint NFT";
                Mint_Text_Taral.text = "Locked";
            }  

            PlayerData.SelectedNFTName = "Anna";
        }
        else if (PlayerData.SelectIndex == 1 && PlayerPrefs.HasKey("selectedIndex"))
        {
            Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
            Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

            if (PlayerPrefs.GetInt("NFTOwned_count") == 2)
            {
                Mint_Text_Anna.text = "Select";
                Mint_Text_Mellow.text = "Selected";
                Mint_Text_Taral.text = "Locked";
            }
            else
            {
                Mint_Text_Anna.text = "Mint NFT";
                Mint_Text_Mellow.text = "Selected";
                Mint_Text_Taral.text = "Locked";
            }

            PlayerData.SelectedNFTName = "Melloow";
        }
        else if (PlayerData.SelectIndex == 2)
        {
            Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Green;

            Mint_Text_Anna.text = "Mint NFT";
            Mint_Text_Mellow.text = "Mint NFT";
            Mint_Text_Taral.text = "NFT Owned";

            PlayerData.SelectedNFTName = "Taral";
        }
    }

    /// <summary>
    /// Opens the NFT 
    /// </summary>
    void ShowNftScreen()
    {
        Mint_NFTScreen.SetActive(true);
        if (PlayerData.SelectIndex == 0 && PlayerPrefs.HasKey("selectedIndex"))
        {
            if (PlayerPrefs.GetInt("NFTOwned_count") > 1)
            {
                MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Taral.GetComponent<Image>().color = Color.black;

                MintNFTScreen_Text_Anna.text = "NFT Owned";
                MintNFTScreen_Text_Mellow.text = "NFT Owned";
                MintNFTScreen_Text_Taral.text = "Locked";
            }
            else
            {
                MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Taral.GetComponent<Image>().color = Color.black;

                MintNFTScreen_Text_Anna.text = "NFT Owned";
                MintNFTScreen_Text_Mellow.text = "Mint NFT";
                MintNFTScreen_Text_Taral.text = "Locked";
            }

        }
        else if (PlayerData.SelectIndex == 1)
        {
            if (PlayerPrefs.GetInt("NFTOwned_count") > 1)
            {
                MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Taral.GetComponent<Image>().color = Color.black;

                MintNFTScreen_Text_Anna.text = "NFT Owned";
                MintNFTScreen_Text_Mellow.text = "NFT Owned";
                MintNFTScreen_Text_Taral.text = "Locked";

            }
            else
            {
                MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;
                MintNFTScreen_Button_Taral.GetComponent<Image>().color = Color.black;

                MintNFTScreen_Text_Anna.text = "Mint NFT";
                MintNFTScreen_Text_Mellow.text = "NFT Owned";
                MintNFTScreen_Text_Taral.text = "Locked";
            }
        }
        else if (PlayerData.SelectIndex == 2)
        {
            MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
            MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
            MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Green;

            MintNFTScreen_Text_Anna.text = "Mint NFT";
            MintNFTScreen_Text_Mellow.text = "Mint NFT";
            MintNFTScreen_Text_Taral.text = "NFT Owned";
        }
    }

    //Call on collect wallet buttons
    /// <summary>
    /// 
    /// </summary>
    public void SelectNfts()
    {
        if (PlayerPrefs.HasKey(SuiWallet.WalletAddressKey))
        {
            HomeScreen.SetActive(true);
            PlaySongScreen.SetActive(true);
            NFTLinkAdd = SuiWallet.ErrorMessage.Length > 0 ? SuiWallet.ErrorMessage : SuiExplorer.FormatAddressUri(SuiWallet.GetActiveAddress());
            NFTLinkText = SuiWallet.GetActiveAddress();

            txtAddressNFT_WalletScreen.text = NFTLinkText;
            string nftSignature = PlayerPrefs.GetString("nftSignature");
            link_successful.text = nftSignature;

            SelectCharacterScreen.SetActive(true);
            SelectCharacter_Overlay.SetActive(false);
            txtMintCharacter.SetActive(false);

            if (PlayerPrefs.HasKey("selectedIndex"))
            {
                blockImage.SetActive(false);
                PlayerData.SelectIndex = int.Parse(PlayerPrefs.GetString("selectedIndex"));
                isOverlayOn = false;
            }
            else
            {
                blockImage.SetActive(true);
                SelectCharacter_Overlay.SetActive(true);
                isOverlayOn = true;
            }

            if (PlayerData.SelectIndex == 0 && PlayerPrefs.HasKey("selectedIndex"))
            {
                Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
                Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

                if (PlayerPrefs.GetInt("NFTOwned_count") == 2)
                {
                    Mint_Text_Anna.text = "Selected";
                    Mint_Text_Mellow.text = "Select";
                    Mint_Text_Taral.text = "Locked";
                }
                else
                {
                    Mint_Text_Anna.text = "Selected";
                    Mint_Text_Mellow.text = "Mint NFT";
                    Mint_Text_Taral.text = "Locked";
                }

                PlayerData.SelectedNFTName = "Anna";
            }
            else if (PlayerData.SelectIndex == 1 && PlayerPrefs.HasKey("selectedIndex"))
            {
                Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
                Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

                if (PlayerPrefs.GetInt("NFTOwned_count") == 2)
                {
                    Mint_Text_Anna.text = "Select";
                    Mint_Text_Mellow.text = "Selected";
                    Mint_Text_Taral.text = "Locked";
                }
                else
                {
                    Mint_Text_Anna.text = "Mint NFT";
                    Mint_Text_Mellow.text = "Selected";
                    Mint_Text_Taral.text = "Locked";
                }

                PlayerData.SelectedNFTName = "Melloow";
            }
            else if (PlayerData.SelectIndex == 2)
            {
                /*Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
                Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Green;

                Mint_Text_Anna.text = "Mint NFT";
                Mint_Text_Mellow.text = "Mint NFT";
                Mint_Text_Taral.text = "NFT Owned";

                PlayerData.SelectedNFTName = "Taral";*/
            }
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
        NetworkManager.Instance.GetTokenBalance(PlayerData.NFTRecipient, OnSuccessfulGetTokenBalance, OnErrorGetTokenBalance);
        LoadingScreen.SetActive(true);
    }

    /// <summary>
    /// Shows the screen that allows users to choose an NFT image as their player avatar. 
    /// </summary>
    public void ShowPlayerSelectionScreen()
    {
        Debug.Log(PlayerData.SelectIndex);
        Mint_NFTScreen.SetActive(true);
        if (PlayerData.SelectIndex==0)
        {
            MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
            MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
            MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

            MintNFTScreen_Text_Anna.text = "NFT Owned";
            MintNFTScreen_Text_Mellow.text = "Mint NFT";
            MintNFTScreen_Text_Taral.text = "Mint NFT";

        }
        else if (PlayerData.SelectIndex==1)
        {
            MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
            MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
            MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

            MintNFTScreen_Text_Anna.text = "Mint NFT";
            MintNFTScreen_Text_Mellow.text = "NFT Owned";
            MintNFTScreen_Text_Taral.text = "Mint NFT";
        }
        else if (PlayerData.SelectIndex==2)
        {
            MintNFTScreen_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
            MintNFTScreen_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
            MintNFTScreen_Button_Taral.GetComponent<Image>().sprite = sprite_Green;

            MintNFTScreen_Text_Anna.text = "Mint NFT";
            MintNFTScreen_Text_Mellow.text = "Mint NFT";
            MintNFTScreen_Text_Taral.text = "NFT Owned";
        }
    }

    #endregion

    #region API Callbacks 

    private void OnSuccessfulCreateNFT(CreateNFTResponseDto createNFTResponseDto)
    {
        PlayerData.NFTAddress = createNFTResponseDto.addresses[0].ToString();
       
        string nftLink = SuiExplorer.FormatTransactionUri(createNFTResponseDto.signature);
        link_successful.text = nftLink;
        PlayerPrefs.SetString("nftSignature", nftLink);

        LoadingScreen.SetActive(false);
        if (PlayerData.SelectIndex==0)
        {
             Mint_SuccessfulScreen.SetActive(true);
             Mint_SuccessfulScreen_Image.sprite = Character_Anna;
             PlayerData.SelectIndex = 0;
             PlayerPrefs.SetString("selectedIndex", "0");
           
        }
        else if (PlayerData.SelectIndex==1)
        {
            Mint_SuccessfulScreen.SetActive(true);
            Mint_SuccessfulScreen_Image.sprite = Character_Melloow;
            PlayerData.SelectIndex = 1;
            PlayerPrefs.SetString("selectedIndex", "1");
        }
        else if (PlayerData.SelectIndex==2)
        {
            Mint_SuccessfulScreen.SetActive(true);
            Mint_SuccessfulScreen_Image.sprite = Character_Taral;
            PlayerData.SelectIndex = 2;
            PlayerPrefs.SetString("selectedIndex", "2");
        }
    }

    private void OnErrorCreateNFT(string error)
    {
        this.ShowError(error);
    }

    private void OnSuccessfulRequestToken(RequestTokenResponseDto requestTokenResponseDto)
    {
        string transactionLink = SuiExplorer.FormatTransactionUri(requestTokenResponseDto.signature);
        PlayerPrefs.SetString("nftSignature_claim", transactionLink);
       
        txtAddressNFT_ClaimScreen.text = transactionLink;
        LoadingScreen.SetActive(false);
        ClaimTokensScreen.SetActive(true);
       
        //TODO: this should be gotten from the response; should not be counted manually
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
        foreach(BeatsNftoDto nft in getNftsResponseDto.nfts) {
            if (nft.name == "Anna") {
                GameManager.Instance.NFTOwned.Add(0); 
                PlayerPrefs.SetString("selectedIndex", "0");
            }
            else if (nft.name == "Melloow") {
                GameManager.Instance.NFTOwned.Add(1); 
                PlayerPrefs.SetString("selectedIndex", "1");
            }
        }
        
        PlayerPrefs.SetString("NFTOwned_Count", getNftsResponseDto.nfts.Length.ToString());

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
            //TODO: use this, or suiaddress, or NFTRecipient? usage seems inconsistent
            SuiWallet.ActiveWalletAddress = verifySignatureResponseDto.address; 
            PlayerPrefs.SetString(SuiWallet.WalletAddressKey, verifySignatureResponseDto.address);
            PlayerData.NFTRecipient = verifySignatureResponseDto.address;

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
        PlayerData.NFTAddress = createNFTResponseDto.addresses[0];
        string NFTAdd = SuiExplorer.FormatTransactionUri(createNFTResponseDto.signature);
        link_successful.text = NFTAdd;
        PlayerPrefs.SetString("nftSignature", NFTAdd);

        LoadingScreen.SetActive(false);
        if (PlayerData.SelectIndex == 0)
        {
            Mint_SuccessfulScreen.SetActive(true);
            Mint_SuccessfulScreen_Image.sprite = Character_Anna;

            Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Green;
            Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

            if (GameManager.Instance.NFTOwned.Contains(1))
            {
                Mint_Text_Anna.text = "Selected";
                Mint_Text_Mellow.text = "Select";
                Mint_Text_Taral.text = "Locked";
            }
            else
            {
                Mint_Text_Anna.text = "Selected";
                Mint_Text_Mellow.text = "Mint NFT";
                Mint_Text_Taral.text = "Locked";
            }

            PlayerData.SelectIndex = 0;
            PlayerPrefs.SetString("selectedIndex", "0");
        }
        else if (PlayerData.SelectIndex == 1)
        {
            Mint_SuccessfulScreen.SetActive(true);
            Mint_SuccessfulScreen_Image.sprite = Character_Melloow;

            Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
            Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;

            if (GameManager.Instance.NFTOwned.Contains(0))
            {
                Mint_Text_Anna.text = "Select";
                Mint_Text_Mellow.text = "Selected";
                Mint_Text_Taral.text = "Locked";
            }
            else
            {
                Mint_Text_Anna.text = "Mint NFT";
                Mint_Text_Mellow.text = "Selected";
                Mint_Text_Taral.text = "Locked";
            }

            PlayerData.SelectIndex = 1;
            PlayerPrefs.SetString("selectedIndex", "1");
        }
        else if (PlayerData.SelectIndex == 2)
        {
            /*Mint_SuccessfulScreen.SetActive(true);
            Mint_SuccessfulScreen_Image.sprite = Character_Taral;

            Mint_Button_Anna.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Green;

            Mint_Text_Anna.text = "Mint NFT";
            Mint_Text_Mellow.text = "Mint NFT";
            Mint_Text_Taral.text = "NFT Owned";

            PlayerData.SelectIndex = 2;
            PlayerPrefs.SetString("selectedIndex", "2");*/
        }
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
