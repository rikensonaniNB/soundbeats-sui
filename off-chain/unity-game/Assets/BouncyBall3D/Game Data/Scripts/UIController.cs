using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class UIController : MonoBehaviour
{
    public Button NewWalletButton;
    public TMP_InputField NewWalletMnemonicsText;
    public Button PlayButton;
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
    public Button NFTButton;
   
    public Button WalletButton_Home;

    public Button Mint_Button_Anna;
    public Button Mint_Button_Marshmallow;
    public Button Mint_Button_Taral;

    public Sprite sprite_Pink;
    public Sprite sprite_Green;

    public GameObject Mint_SuccessfulScreen;
    public GameObject Mint_NFTScreen;

    public Image Mint_SuccessfulScreen_Image;
    public Button Mint_SuccessfulScreen_Close;
    public GameObject SelectCharacter_Overlay;

    public Sprite Character_Anna;
    public Sprite Character_Melloow;
    public Sprite Character_Taral;

    public Button MintNFTScreen_Button_Anna;
    public Button MintNFTScreen_Button_Marshmallow;
    public Button MintNFTScreen_Button_Taral;
    public Button MintNFTScreen_Button_Close;

    public Button ClaimTokens_Button;
    public Button Close_WalletScreen;
    public Button Close_LeaderboardScreen;

    public TextMeshProUGUI txtAddressNFT_WalletScreen;
    public TextMeshProUGUI txtScore_WalletScreen;
    public TextMeshProUGUI txtScore_ClaimScreen;
    public TextMeshProUGUI txtAddressNFT_ClaimScreen;

    public Button Close_ClaimTokens;
    public GameObject LoadingScreen;
    public GameObject ErrorScreen;
    public TextMeshProUGUI txtError_ErrorScreen;

    public Button MintNFT_LinkButton;
    public Button WalletScreen_NFTAdd_Button;
    public Button ClaimScreen_NFTAdd_Button;

    public TextMeshProUGUI Mint_Text_Anna;
    public TextMeshProUGUI Mint_Text_Mellow;
    public TextMeshProUGUI Mint_Text_Taral;

    public TextMeshProUGUI MintNFTScreen_Text_Anna;
    public TextMeshProUGUI MintNFTScreen_Text_Mellow;
    public TextMeshProUGUI MintNFTScreen_Text_Taral;

    public TMP_InputField MnemonicsInputField;
    public Button ImportWalletButton;
    public GameObject ImportWalletScreen;
    public Button ConnectWalletButton;

    public Button onLogOutButton;

    public GameObject blockImage;

    public GameObject setup1Panel;
    public GameObject setup2Panel;

    private bool isOverlayOn = true;
    private string NFTLinkAdd;
    private void Start()
    {
        ActiveAddressText.text = SuiWallet.GetActiveAddress();
        PlayerData.NFTRecipent = SuiWallet.GetActiveAddress();
      
        if (!PlayerPrefs.HasKey("suiaddress"))
        {
            NewWalletButton.onClick.AddListener(() =>
            {
                var walletmnemo = SuiWallet.CreateNewWallet();
                NewWalletMnemonicsText.gameObject.SetActive(true);
                NewWalletMnemonicsText.text = walletmnemo;
                NFTLinkAdd = "https://explorer.devnet.sui.io/addresses/" + SuiWallet.GetActiveAddress();

                ActiveAddressText.text = SuiWallet.GetActiveAddress();
                txtAddressNFT_WalletScreen.text = NFTLinkAdd;
                PlayerData.NFTRecipent = SuiWallet.GetActiveAddress();

                PlayerPrefs.SetString("suiaddress", SuiWallet.GetActiveAddress());
            });
            PlayButton.onClick.AddListener(() =>
            {
                SuiWalletScreen.SetActive(false);
                HomeScreen.SetActive(true);
                PlaySongScreen.SetActive(true);
                SelectCharacterScreen.SetActive(true);
                if (!PlayerPrefs.HasKey("selectedIndex"))
                {
                    blockImage.SetActive(true);
                }
            });
            
        }
        else
        {
            HomeScreen.SetActive(true);
            PlaySongScreen.SetActive(true);
            NFTLinkAdd = "https://explorer.devnet.sui.io/addresses/" + SuiWallet.GetActiveAddress();
          
            txtAddressNFT_WalletScreen.text = NFTLinkAdd;
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

        onLogOutButton.onClick.AddListener(() =>
        {
            WalletScreen.SetActive(false);
            HomeScreen.SetActive(false);
            SelectCharacterScreen.SetActive(false);
            PlaySongScreen.SetActive(false);
            PlayerPrefs.DeleteAll();
            PlayerData.SelectedNFTName = "";
            PlayerData.NFTRecipent = "";
            PlayerData.NFTAddress ="";
            PlayerData.SelectIndex = 0;
            PlayerData.totalBalance=0;
            setup2Panel.SetActive(false);
            setup1Panel.SetActive(true);
            SuiWalletScreen.SetActive(true);
        });

        ImportWalletButton.onClick.AddListener(() =>
        {
            ImportWalletScreen.SetActive(false);
            HomeScreen.SetActive(true);
            PlaySongScreen.SetActive(true);
            SelectCharacterScreen.SetActive(true);
            NewWalletMnemonicsText.gameObject.SetActive(false);
            SuiWallet.RestoreWalletFromMnemonics(MnemonicsInputField.text);
            ActiveAddressText.text = SuiWallet.GetActiveAddress();
            Debug.Log(ActiveAddressText.text);
            PlayerPrefs.SetString("suiaddress", SuiWallet.GetActiveAddress());
            PlayerData.NFTRecipent = SuiWallet.GetActiveAddress();
            NFTLinkAdd = "https://explorer.devnet.sui.io/addresses/" + SuiWallet.GetActiveAddress();

            ActiveAddressText.text = SuiWallet.GetActiveAddress();
            txtAddressNFT_WalletScreen.text = NFTLinkAdd;
            NFTManager.instance.GetNFTSCORE(SuiWallet.GetActiveAddress());
        });

    
        ///Home Screen////////////
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
            NetworkManager.Instance.GetPrivateTokenBalance(PlayerData.NFTRecipent, OnSuccessfulGetTokenBalance, OnErrorGetTokenBalance);
            LoadingScreen.SetActive(true);
            //txtAddressNFT_WalletScreen.text = PlayerData.NFTRecipent;
            //Debug.Log(PlayerData.NFTRecipent);
            //Debug.Log(ServerConfig.API_GET_PRIVATE_TOKEN_BALANCE+PlayerData.NFTRecipent);
            //WalletScreen.SetActive(true);
            //txtScore_WalletScreen.text = "500";
        });

        NFTButton.onClick.AddListener(() =>
        {
            Mint_NFTScreen.SetActive(true);
        });

        ////////////////////////////////////////

        //Select Character Screen//////
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

                PlayerData.SelectIndex = 0;
                PlayerPrefs.SetString("selectedIndex", "0");
                CreateNFTRequest createNFTRequest_anna = new CreateNFTRequest();
                createNFTRequest_anna.name = "Anna";
                createNFTRequest_anna.imageUrl = "char_15.png";
                createNFTRequest_anna.quantity = 1;
                NetworkManager.Instance.CreateNFT(createNFTRequest_anna, OnSuccessfulCreateNFT, OnErrorCreateNFT);
                LoadingScreen.SetActive(true);
                blockImage.SetActive(false);

                NFTManager.instance.SendNFTOwned(ServerConfig.LeaderboardNFT_API_URL_FORMAT + ServerConfig.API_POST_NFT_Create, "NFT_0", PlayerPrefs.GetString("suiaddress"));

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
                    NFTSCREENOPEN();
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
                CreateNFTRequest createNFTRequest_Melloow = new CreateNFTRequest();
                createNFTRequest_Melloow.name = "Melloow";
                createNFTRequest_Melloow.imageUrl = "char_19.png";
                createNFTRequest_Melloow.quantity = 1;
                NetworkManager.Instance.CreateNFT(createNFTRequest_Melloow, OnSuccessfulCreateNFT, OnErrorCreateNFT);
                LoadingScreen.SetActive(true);
                blockImage.SetActive(false);

                NFTManager.instance.SendNFTOwned(ServerConfig.LeaderboardNFT_API_URL_FORMAT + ServerConfig.API_POST_NFT_Create, "NFT_1", PlayerPrefs.GetString("suiaddress"));

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
                    NFTSCREENOPEN();
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
                CreateNFTRequest createNFTRequest_Taral = new CreateNFTRequest();
                createNFTRequest_Taral.name = "Taral";
                createNFTRequest_Taral.imageUrl = "char_Taral.png";
                createNFTRequest_Taral.quantity = 1;
                NetworkManager.Instance.CreateNFT(createNFTRequest_Taral, OnSuccessfulCreateNFT, OnErrorCreateNFT);
                LoadingScreen.SetActive(true);

                PlayerData.SelectIndex = 3;
                Mint_SuccessfulScreen.SetActive(true);
                Mint_SuccessfulScreen_Image.sprite = Character_Taral;*/
            }
        });
        ////////////////////////////
        // Mint successful screen///////////////
        Mint_SuccessfulScreen_Close.onClick.AddListener(() =>
        {
            Mint_SuccessfulScreen.SetActive(false);
            Mint_NFTScreen.SetActive(false);
            SelectCharacter_Overlay.SetActive(false);
            txtMintCharacter.SetActive(false);
            isOverlayOn = false;
        });
       
        ///////////////////////////////////////////////
      
        //// Mint NFT Screen////////////////////////////
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
                    /////////////////////////////

                    CreateNFTRequest createNFTRequest_anna = new CreateNFTRequest();
                    createNFTRequest_anna.name = "Anna";
                    createNFTRequest_anna.imageUrl = "char_15.png";
                    createNFTRequest_anna.quantity = 1;
                    NetworkManager.Instance.CreateNFT(createNFTRequest_anna, OnSuccessfulCreateNFT_Modify, OnErrorCreateNFT_Modify);
                    LoadingScreen.SetActive(true);
                    NFTManager.instance.SendNFTOwned(ServerConfig.LeaderboardNFT_API_URL_FORMAT + ServerConfig.API_POST_NFT_Create, "NFT_0", PlayerPrefs.GetString("suiaddress"));
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

                    CreateNFTRequest createNFTRequest_Melloow = new CreateNFTRequest();
                    createNFTRequest_Melloow.name = "Melloow";
                    createNFTRequest_Melloow.imageUrl = "char_19.png";
                    createNFTRequest_Melloow.quantity = 1;
                    NetworkManager.Instance.CreateNFT(createNFTRequest_Melloow, OnSuccessfulCreateNFT_Modify, OnErrorCreateNFT_Modify);
                    LoadingScreen.SetActive(true);
                    NFTManager.instance.SendNFTOwned(ServerConfig.LeaderboardNFT_API_URL_FORMAT + ServerConfig.API_POST_NFT_Create, "NFT_1", PlayerPrefs.GetString("suiaddress"));
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
                CreateNFTRequest createNFTRequest_Taral = new CreateNFTRequest();
                createNFTRequest_Taral.name = "Taral";
                createNFTRequest_Taral.imageUrl = "char_Taral.png";
                createNFTRequest_Taral.quantity = 1;
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

        ///////////////////////////////////////

        /////Wallet Screen//////////////////

        ClaimTokens_Button.onClick.AddListener(() =>
        {
            WalletScreen.SetActive(false);
          
            RequestTokenDto requestTokenDto = new RequestTokenDto();
            requestTokenDto.amount = 100;
            requestTokenDto.recipient = PlayerData.NFTRecipent;
            NetworkManager.Instance.RequestToken(requestTokenDto, OnSuccessfulRequestPrivateToken, OnErrorRequestPrivateToken);
            LoadingScreen.SetActive(true);
            //link_successful.text = PlayerData.NFTRecipent;
            //Debug.Log(PlayerData.NFTRecipent);
            //Debug.Log(PlayerData.NFTAddress);
            //ClaimTokensScreen.SetActive(true);
            //txtScore_ClaimScreen.text = "100";
           
        });

        Close_WalletScreen.onClick.AddListener(() =>
        {
            WalletScreen.SetActive(false);
        });
        ////////////////////////////////////

        ///Close Leaderboard/////////////////////
        Close_LeaderboardScreen.onClick.AddListener(() =>
        {
            LeaderboardScreen.SetActive(false);
        });
        ////////////////////////////////////
        
        
        ///ClaimTokens/////////////////////
        Close_ClaimTokens.onClick.AddListener(() =>
        {
            ClaimTokensScreen.SetActive(false);
            WalletScreen.SetActive(true);
            txtScore_WalletScreen.text = PlayerData.totalBalance.ToString();
        });
        ///////////////////////////////////
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
         
    ///////////////////////////////////
}

    void NFTSCREENOPEN()
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
    public void SelectNFTS()
    {
        if (PlayerPrefs.HasKey("suiaddress"))
        {
            HomeScreen.SetActive(true);
            PlaySongScreen.SetActive(true);
            NFTLinkAdd = "https://explorer.devnet.sui.io/addresses/" + SuiWallet.GetActiveAddress();

            txtAddressNFT_WalletScreen.text = NFTLinkAdd;
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
    private void OnSuccessfulCreateNFT(CreateNFTResponseDto createNFTResponseDto)
    {
        PlayerData.NFTAddress = createNFTResponseDto.addresses[0].ToString();
       
        string NFTAdd = "https://explorer.devnet.sui.io/transactions/" + createNFTResponseDto.signature;
        link_successful.text = NFTAdd;
        PlayerPrefs.SetString("nftSignature", NFTAdd);

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
    private void OnErrorCreateNFT(string Error)
    {
        //Show error
        LoadingScreen.SetActive(false);
        ErrorScreen.SetActive(true);
        txtError_ErrorScreen.text = Error;
    }
    private void OnSuccessfulRequestPrivateToken(RequestTokenResponseDto requestTokenResponseDto)
    {
        string transactionLink = "https://explorer.devnet.sui.io/transactions/" + requestTokenResponseDto.signature;
        PlayerPrefs.SetString("nftSignature_claim", transactionLink);
       
        txtAddressNFT_ClaimScreen.text = transactionLink;
        LoadingScreen.SetActive(false);
        ClaimTokensScreen.SetActive(true);
       
        PlayerData.totalBalance += 100;
        txtScore_ClaimScreen.text = "100";
        Debug.Log("signature...>" + requestTokenResponseDto.signature + PlayerData.totalBalance);
    }
    private void OnErrorRequestPrivateToken(string Error)
    {
        LoadingScreen.SetActive(false);
        ErrorScreen.SetActive(true);
        txtError_ErrorScreen.text = Error;
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
    private void OnErrorGetTokenBalance(string Error)
    {
        LoadingScreen.SetActive(false);
        ErrorScreen.SetActive(true);
        txtError_ErrorScreen.text = Error;
    }


    private void OnSuccessfulCreateNFT_Modify(CreateNFTResponseDto createNFTResponseDto)
    {
        PlayerData.NFTAddress = createNFTResponseDto.addresses[0];
        string NFTAdd = "https://explorer.devnet.sui.io/transactions/" + createNFTResponseDto.signature;
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
    private void OnErrorCreateNFT_Modify(string Error)
    {
        //Show error
        LoadingScreen.SetActive(false);
        ErrorScreen.SetActive(true);
        txtError_ErrorScreen.text = Error;
    }


    public void ShowNFTWallet()
    {
        NetworkManager.Instance.GetPrivateTokenBalance(PlayerData.NFTRecipent, OnSuccessfulGetTokenBalance, OnErrorGetTokenBalance);
        LoadingScreen.SetActive(true);
    }

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
}
