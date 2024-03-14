
using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class SongHolder : MonoBehaviour
{
    [SerializeField] Image icon;
    [SerializeField] Sprite[] Icon_image;
    [SerializeField] Text SongScore;

    public Song song;
    public Text songName;
    public bool songgo = false;
    public Button PlayButton;
    public static SongHolder Instance;
    //[SerializeField] Image[] stars = new Image[3];
    [SerializeField] Color activeStars, inactiveStars;

    public GameObject player;
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
    }
    private void OnEnable()
    {
        PlayButton.interactable = true;
        GameManager.Instance.ThresoldSlider.interactable = true;
        PlayButton.transform.GetChild(0).GetComponent<Text>().text = "Generate";
        GameManager.Instance.PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text = "Generate";
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
        PlayButton.interactable = false;
        //GameManager.Instance.ThresoldSlider.interactable = false;
        songgo = true;
        //GoogleAnalytics.Instance.SendSelectedSong(song.name);
        //UIManager.Instance.CloseMenu();
        LevelGenerator.Instance.currentSong = song;
        Debug.Log("currentSong" + LevelGenerator.Instance.currentSong.name);
        AudioVisualizeManager.visualizeManager.audioSource.clip = song.song;
        AudioVisualizeManager.visualizeManager.audioSource.Play();
        AudioVisualizeManager.visualizeManager.StartBeatDetect();
        Debug.Log("count=" + LevelGenerator.Instance.myDataList.dataSave.Count);

        //int sountTimeInIntValue = (int)song.song.length;
        StartCoroutine(waitforsavedata(song.song));
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
    }
    public IEnumerator waitforsavedata(AudioClip clipTime)
    {
        Debug.Log("StartCorutine");
        yield return new WaitForSeconds(clipTime.length);
        PlayButton.transform.GetChild(0).GetComponent<Text>().text = "Finish";
        LevelGenerator.Instance.SaveFloatList();
        GameManager.Instance.PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text = "Finish";
        GameManager.Instance.PlayBtn.interactable = false;
        Debug.Log("22222 DATA : " + GameManager.Instance.SongListObj[GameManager.Instance.n].GetComponent<SongHolder>().PlayButton.gameObject.name);
        GameManager.Instance.SongListObj[GameManager.Instance.n].GetComponent<SongHolder>().PlayButton.GetComponent<Button>().interactable = true;
    }


    public void PlaySong()
    {
        GameManager.instance.producer = false;
        Debug.Log("PlaySong " + song.name);

        //GoogleAnalytics.Instance.SendSelectedSong(song.name);
        UIManager.Instance.CloseMenu();

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


        LevelGenerator.Instance.currentSong = song;
        LevelGenerator.Instance.StartWithSong();
        Advertisements.Instance.ShowInterstitial();
        this.gameObject.SetActive(false);

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