using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

//TODO: used or not  ?
public class callController : MonoBehaviour
{
    public int ID;
    public Image avatar;
    public string NameAvatar;
    public Text NameText;
    public Text NameText2;
    public Text NameText3;

    public float SelectedTime;
    private static float Time=0;
    public GameObject CallPanel;
    public Image AvatarCalled;
    public Image AvatarCalled2;
    public Image AvatarCalled3;
    public GameObject Mainmenu;
    public GameObject TimePanel;

    //public AudioClip[] Clips;
    public AudioSource[] Audio;
    private string Name;

    public Sprite[] sprites;

    private void Awake()
    {
        //Advertisements.Instance.Initialize();
    }
    private void Start()
    {
        //avatar.sprite=
       
        //print(PlayerPrefs.GetInt("CallID", ID));
    }

    public void chooseAvatar()
    {
        PlayerPrefs.SetInt("CallID", ID);
        avatar.sprite = sprites[PlayerPrefs.GetInt("CallID", ID)];
        Name = NameAvatar;
        PlayerPrefs.SetString("avatarname", Name);
        NameText.text = Name;
        NameText2.text = Name;
        NameText3.text = Name;

        Debug.Log(Name);
    }

    public void call()
    {
        this.Wait(Time, () =>
         {
             SelectedCall();
             });

        //Advertisements.Instance.ShowInterstitial();
    }
    public void chooseTime()
    {
        Time = SelectedTime;
        Debug.Log(Time);
    }

    void SelectedCall()
    {
        CallPanel.SetActive(true);
        AvatarCalled.sprite = avatar.sprite;
        AvatarCalled2.sprite = avatar.sprite;
        AvatarCalled3.sprite = avatar.sprite;
        TimePanel.SetActive(false);

        Mainmenu.SetActive(true);
        Advertisements.Instance.ShowInterstitial();

        //print("5");
    }

    public void AnswerCall()
    {

        if (PlayerPrefs.GetString("avatarname") == "Marshmello")
        {
            Audio[0].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "MarshmelloSkater")
        {
            Audio[1].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "Slushii")
        {
            Audio[2].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "DJJauz")
        {
            Audio[3].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "Burglar")
        {
            Audio[4].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "TeddyBearGirl")
        {
            Audio[5].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "DJGamejam")
        {
            Audio[6].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "JohnImah")
        {
            Audio[7].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "Mime_LOW")
        {
            Audio[8].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "Mobster")
        {
            Audio[9].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "Shalizi")
        {
            Audio[10].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "Skullsy")
        {
            Audio[11].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "Spaceman")
        {
            Audio[12].PlayDelayed(2f);
        }
        if (PlayerPrefs.GetString("avatarname") == "TronBiker")
        {
            Audio[13].PlayDelayed(2f);
        }
        



    }
    public void StopAudio()
    {
        allAudioSources = FindObjectsOfType(typeof(AudioSource)) as AudioSource[];
        foreach (AudioSource audioS in allAudioSources)
        {
            audioS.Stop();
        }
    }

    private AudioSource[] allAudioSources;

   

}
