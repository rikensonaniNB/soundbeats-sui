/*
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MintNFT : MonoBehaviour
{
    public Button Mint_Button_TeddyBearGirl;
    public Button Mint_Button_Marshmallow;
    public Button Mint_Button_Taral;

    public Sprite sprite_Pink;
    public Sprite sprite_Green;

    public GameObject Mint_SuccessfulScreen;
    public GameObject Mint_NFTScreen;
    public Button Mint_NFTButton;
    public Button WalletButton;

    // Start is called before the first frame update
    void Start()
    {
        Mint_Button_TeddyBearGirl.onClick.AddListener(() =>
        {
            Mint_Button_TeddyBearGirl.GetComponent<Image>().sprite = sprite_Green;
            Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;
            PlayerData.SelectedNFTName = "TeddyBearGirl";
            Mint_SuccessfulScreen.SetActive(true);
        });
        Mint_Button_Marshmallow.onClick.AddListener(() =>
        {
            Mint_Button_TeddyBearGirl.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Green;
            Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Pink;
            PlayerData.SelectedNFTName = "Marshmello";
            Mint_SuccessfulScreen.SetActive(true);
        });
        Mint_Button_Taral.onClick.AddListener(() =>
        {
            Mint_Button_TeddyBearGirl.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Marshmallow.GetComponent<Image>().sprite = sprite_Pink;
            Mint_Button_Taral.GetComponent<Image>().sprite = sprite_Green;
            PlayerData.SelectedNFTName = "Taral";
            Mint_SuccessfulScreen.SetActive(true);
        });
        Mint_NFTButton.onClick.AddListener(() =>
        {
            Mint_NFTScreen.SetActive(true);
        });
    }

  
}
*/