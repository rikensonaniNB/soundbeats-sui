using Newtonsoft.Json;
using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;
//using Nethereum.ABI.CompilationMetadata;
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
        GameManager.instance.ThresoldSlider.interactable = true;
        PlayButton.transform.GetChild(0).GetComponent<Text>().text = "Generate";
        GameManager.instance.PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text = "Generate";
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
    public void PlaySongProducer()
    {
        GameManager.instance.producer = true;

        Debug.Log("PlaySong " + song.name);
        PlayButton.interactable = true;
        songgo = true;
        //LevelGenerator.Instance.currentSong = song;
        //Debug.Log("currentSong" + LevelGenerator.Instance.currentSong.name);
        //AudioVisualizeManager.visualizeManager.audioSource.clip = song.song;
        AudioVisualizeManager.visualizeManager.audioSource.Play();
        AudioVisualizeManager.visualizeManager.StartBeatDetect();
        Debug.Log("count=" + LevelGenerator.Instance.myDataList.dataSave.Count);

        StartCoroutine(waitforsavedata(song.song));
    }
    public IEnumerator waitforsavedata(AudioClip clipTime)
    {
        Debug.Log("StartCorutine");
        yield return new WaitForSeconds(clipTime.length);
        GameManager.instance.congrats.SetActive(true);
        GameManager.instance.songPlaying = false;
        PlayButton.transform.GetChild(0).GetComponent<Text>().text = "Finish";
        LevelGenerator.Instance.SaveFloatList();
        GameManager.instance.PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text = "Finish";
        SetBox.instance.camerabool = false;
        GameManager.instance.PlayBtn.interactable = false;
    }


    public void PlaySong()
    {
        UIManager.Instance.gameUI.SetActive(true);
        GameManager.instance.playerObj.SetActive(true);
        GameManager.instance.platform.SetActive(true);
        Player.instance.ResetPlayer();
        GameManager.instance.producer = false;
        Debug.Log("PlaySong " + song.name);
        player.transform.GetChild(10).gameObject.SetActive(false);
        player.transform.GetChild(10).gameObject.SetActive(true);

        //GoogleAnalytics.Instance.SendSelectedSong(song.name);
        UIManager.Instance.CloseMenu();

        //if (UserData.SelectedNftIndex == 0)
        //{
        //    player.GetComponent<Player>().Selected_character[0].SetActive(true);
        //    player.GetComponent<Player>().Selected_character[1].SetActive(false);
        //    player.GetComponent<Player>().Selected_character[2].SetActive(false);
        //}
        //else if (UserData.SelectedNftIndex == 1)
        //{
        //    player.GetComponent<Player>().Selected_character[0].SetActive(false);
        //    player.GetComponent<Player>().Selected_character[1].SetActive(true);
        //    player.GetComponent<Player>().Selected_character[2].SetActive(false);
        //}
        //else if (UserData.SelectedNftIndex == 2)
        //{
        //    player.GetComponent<Player>().Selected_character[0].SetActive(false);
        //    player.GetComponent<Player>().Selected_character[1].SetActive(false);
        //    player.GetComponent<Player>().Selected_character[2].SetActive(true);
        //}
        Player.instance.characters[Player.instance.characterSelect].transform.position
            = new Vector3(Player.instance.characters[Player.instance.characterSelect].transform.position.x, 0,
                Player.instance.characters[Player.instance.characterSelect].transform.position.z);


        LevelGenerator.Instance.currentSong = song;
        LevelGenerator.Instance.StartWithSong();
        Advertisements.Instance.ShowInterstitial();
        this.gameObject.SetActive(false);
        GameManager.instance.mainCamera.SetActive(true);
        GameManager.instance.sky.SetActive(true);
        RenderSettings.skybox = GameManager.instance.mainCameraMat;
        GameManager.instance.producerCamera.SetActive(false);
        foreach (Transform allwhiteBalls in SetBox.instance.whiteBallParent.transform)
        {
            Destroy(allwhiteBalls);
        }

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