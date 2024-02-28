using Newtonsoft.Json;
using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;
//using RhythmTool;

public class SongHolder : MonoBehaviour
{
    [SerializeField] Image icon;
    [SerializeField] Sprite[] Icon_image;
    [SerializeField] Text SongScore;

    // public RhythmAnalyzer analyzer;
    public Song song;
    public Text songName;
    public bool songgo = false;
    public Button PlayButton;

    //[SerializeField] Image[] stars = new Image[3];
    [SerializeField] Color activeStars, inactiveStars;

    // public RhythmData rhythmdata;
    public GameObject player;
    public static SongHolder Instance;


    private void OnEnable()
    {
        PlayButton.interactable = true;
        GameManager.Instance.ThresoldSlider.interactable = true;
        PlayButton.transform.GetChild(0).GetComponent<Text>().text = "Generate";
        GameManager.Instance.PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text = "Generate";
    }
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }

    }

    private void Start()
    {

        player = GameObject.Find("Player");
        //Debug.Log( song.name);
        //icon.sprite = Icon_image[Random.Range(0, Icon_image.Length)];
        foreach (var t in Icon_image)
        {
            if (t.name == song.name)
            {
                icon.sprite = t;
            }
        }
    }

    public void SetSong(Song newSong)
    {
        song = newSong;

        UpdateInfo();
    }
    private void Update()
    {
        if (songgo)
        {
            //Debug.Log("songgo=true");
            //  Debug.Log("ISDone= "+analyzer.isDone);
            //if (analyzer.isDone)
            //{
            //    songgo = false;
            //    Debug.Log("songgo=false");
            //    for (int i = 0; i < LevelGenerator.Instance.myDataList.dataSave.Count - 1; i++)
            //    {
            //        float n = UnityEngine.Random.Range(0.001f, 0.2f);
            //        Debug.Log("in for loop");
            //        if (LevelGenerator.Instance.myDataList.dataSave[i + 1] > LevelGenerator.Instance.myDataList.dataSave[i] + n)
            //        {
            //            if (UnityEngine.Random.Range(0, 100) > 50)
            //            {
            //                Debug.Log("range 0-100");
            //                LevelGenerator.Instance.myDataList.dataSave[i] = LevelGenerator.Instance.myDataList.dataSave[i] + n;
            //                Debug.Log("data= " + LevelGenerator.Instance.myDataList.dataSave[i]);

            //            }
            //        }
            //    }
            //    StartCoroutine(LevelGenerator.Instance.StartWithSong(this.gameObject, UIManager.Instance.menuUI));
            //}
        }
    }
    public void UpdateInfo()
    {

        song.LoadData();

        //for (int i = 0; i < 3; i++)
        //    stars[i].color = i < song.stars ? activeStars : inactiveStars;
        //Debug.Log(PlayerPrefs.GetInt(songName.name));

        SongScore.text = PlayerPrefs.GetInt(song.name).ToString();
        Debug.Log(PlayerPrefs.GetInt(song.name));
        songName.text = song.name;



    }
    /*    public void SetIcon_image(Sprite Icon_image)
    {
        icon = Resources.Load("songName", typeof(Image)) as Image;
        icon.sprite = Icon_image;
        
    }*/
    float f;
    float f1;
    public void PlaySong()
    {
        Debug.Log("PlaySong " + song.name);
        PlayButton.interactable = false;
        GameManager.Instance.ThresoldSlider.interactable = false;
        songgo = true;
        //GoogleAnalytics.Instance.SendSelectedSong(song.name);
        //UIManager.Instance.CloseMenu();

        if (UserData.SelectedNftIndex == 0)
        {
            player.GetComponent<Player>().Selected_character[0].SetActive(true);
            player.GetComponent<Player>().Selected_character[1].SetActive(false);
            player.GetComponent<Player>().Selected_character[2].SetActive(false);
        }
        else if (UserData.SelectedNftIndex == 1)
        {
            player.GetComponent<Player>().Selected_character[0].SetActive(false);
            player.GetComponent<Player>().Selected_character[1].SetActive(true);
            player.GetComponent<Player>().Selected_character[2].SetActive(false);
        }
        else if (UserData.SelectedNftIndex == 2)
        {
            player.GetComponent<Player>().Selected_character[0].SetActive(false);
            player.GetComponent<Player>().Selected_character[1].SetActive(false);
            player.GetComponent<Player>().Selected_character[2].SetActive(true);
        }

        /* for (int i = 0; i <= player.GetComponent<Player>().Selected_character.Length - 1; i++)
         {
             player.GetComponent<Player>().Selected_character[i].SetActive(false);
         }
         for (int i = 0; i <= player.GetComponent<Player>().characters.Length - 1; i++)
         {
             player.GetComponent<Player>().characters[i].SetActive(false);
         }
         player.GetComponent<Player>().Selected_character[PlayerPrefs.GetInt("Selected_player")].SetActive(true);*/
        //player.SetActive(true);

        //  Debug.Log("currentsong:" + LevelGenerator.Instance.currentSong.song.name);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //LevelGenerator.Instance.myDataList = JsonUtility.FromJson<LevelGenerator.DataList>(LevelGenerator.Instance.currentSong.songTxtJson.text);
        LevelGenerator.Instance.currentSong = song;
        AudioVisualizeManager.visualizeManager.audioSource.clip = song.song;
        AudioVisualizeManager.visualizeManager.audioSource.Play();
        AudioVisualizeManager.visualizeManager.StartBeatDetect();
        Debug.Log("count=" + LevelGenerator.Instance.myDataList.dataSave.Count);
        StartCoroutine(waitforsavedata(song.song));
        // rhythmdata = analyzer.Analyze(LevelGenerator.Instance.currentSong.song);
        //  Debug.Log("rhythmdata" + rhythmdata);
        //  StartCoroutine(AudioVisualizeManager.visualizeManager.StartBeat());
        //for (int i = 0; i < LevelGenerator.Instance.myDataList.dataSave.Count-1; i++)
        //{
        //    float n = Random.RandomRange(0.001f, 0.2f);

        //    if (LevelGenerator.Instance.myDataList.dataSave[i + 1].time > LevelGenerator.Instance.myDataList.dataSave[i].time + n)
        //    {
        //        if (Random.Range(0, 100) > 50)
        //        {
        //            LevelGenerator.Instance.myDataList.dataSave[i].time = LevelGenerator.Instance.myDataList.dataSave[i].time + n;
        //            Debug.Log("data= " + LevelGenerator.Instance.myDataList.dataSave[i].time);

        //        }
        //    }
        //    else
        //    {
        //        Debug.Log("Chance to Missing plateform= " + LevelGenerator.Instance.myDataList.dataSave[i].time + " =next is = " + LevelGenerator.Instance.myDataList.dataSave[i + 1].time);
        //    }

        //}
        //levelgenerator.instance.mydatalist = jsonutility.fromjson<levelgenerator.datalist>(levelgenerator.instance.currentsong.songtxtjson.text);

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //StartCoroutine(LevelGenerator.Instance.StartWithSong(this.gameObject, UIManager.Instance.menuUI,song.song));

        //Advertisements.Instance.ShowInterstitial();
        //this.gameObject.SetActive(false);

    }

    public IEnumerator waitforsavedata(AudioClip clip)
    {
        yield return new WaitForSeconds(clip.length);
        LevelGenerator.Instance.SaveFloatList();
        PlayButton.transform.GetChild(0).GetComponent<Text>().text = "Finish";
        GameManager.Instance.PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text = "Finish";
        GameManager.Instance.PlayBtn.interactable = false;
        GameManager.Instance.SongListObj[GameManager.Instance.n].GetComponent<SongHolder>().PlayButton.interactable = true;
    }
}






/*using UnityEngine;
using UnityEngine.UI;

public class SongHolder : MonoBehaviour
{
    [SerializeField] Image icon;
    [SerializeField] Sprite[] Icon_image;
    [SerializeField] Text SongScore;

    [SerializeField] Song song;
    [SerializeField] Text songName;
    //[SerializeField] Image[] stars = new Image[3];
    [SerializeField] Color activeStars, inactiveStars;

     GameObject player;
    private void Awake()
    {

    }
    private void Start()
    {
        player = GameObject.Find("Player");
        icon.sprite = Icon_image[Random.Range(0, Icon_image.Length)];
        //player.SetActive(false);
    }
    public void SetSong(Song newSong)
    {
        song = newSong;
        UpdateInfo();
    }

    public void UpdateInfo()
    {
        song.LoadData();

        //for (int i = 0; i < 3; i++)
        //    stars[i].color = i < song.stars ? activeStars : inactiveStars;
        //Debug.Log(PlayerPrefs.GetInt(songName.name));
        
        SongScore.text = PlayerPrefs.GetInt(song.name).ToString();
        Debug.Log(PlayerPrefs.GetInt(song.name));
        songName.text = song.name;
    }

    public void PlaySong()
    {

        LevelGenerator.Instance.currentSong = song;
        LevelGenerator.Instance.StartWithSong();
        UIManager.Instance.CloseMenu();
        for (int i = 0; i <= player.GetComponent<Player>().Selected_character.Length - 1; i++)
        {
            player.GetComponent<Player>().Selected_character[i].SetActive(false);
        }
        for (int i = 0; i <= player.GetComponent<Player>().characters.Length - 1; i++)
        {
            player.GetComponent<Player>().characters[i].SetActive(false);
        }
        player.GetComponent<Player>().Selected_character[PlayerPrefs.GetInt("Selected_player")].SetActive(true);
        //player.SetActive(true);

        Advertisements.Instance.ShowInterstitial();
    }
}
*/