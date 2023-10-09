using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Android;
using UnityEngine.SceneManagement;
public class OpenScenes : MonoBehaviour
{

    //public string SceneName;

    //public string GameUrl;
    //GameObject dialog = null;


    private void Start()
    {



        //Advertisements.Instance.Initialize();


    }

    public void OpenScene(int SceneIndex)
    {
        //SceneManager.LoadScene(SceneIndex);
        //Advertisements.Instance.ShowInterstitial();
        //print("ShowInter");

    }

    //public void RateUs( /*Game Link*/)
    //{
    //}

    //public void Share( /*Game Link*/)
    //{
    //  NativeShare MyShare=  new NativeShare();
    //}
    public void ShowAds()
    {
        Advertisements.Instance.ShowInterstitial();
        print("ShowInter");
    }

    public void ShowBanner()
    {
        //Advertisements.Instance.ShowBanner(BannerPosition.BOTTOM, BannerType.SmartBanner);
        print("ShowBanner");

    }

    public void HideBanner()
    {
        //Advertisements.Instance.HideBanner();
        print("HideBanner");

    }

}
