
using UnityEngine;
using UnityEngine.UI;

public class SongHolder : MonoBehaviour
{
    [SerializeField] Image icon;
    [SerializeField] Sprite[] Icon_image;
    [SerializeField] Text SongScore;

    public Song song;
    public Text songName;

    //[SerializeField] Image[] stars = new Image[3];
    [SerializeField] Color activeStars, inactiveStars;

     public GameObject player;
    private void Awake()
    {
   
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
    public void PlaySong()
    {
        Debug.Log("PlaySong "+song.name);
        
       
        UIManager.Instance.CloseMenu();

        if (PlayerData.SelectIndex==0)
        {
            player.GetComponent<Player>().Selected_character[0].SetActive(true);
            player.GetComponent<Player>().Selected_character[1].SetActive(false);
            player.GetComponent<Player>().Selected_character[2].SetActive(false);
        }
        else if (PlayerData.SelectIndex==1)
        {
            player.GetComponent<Player>().Selected_character[0].SetActive(false);
            player.GetComponent<Player>().Selected_character[1].SetActive(true);
            player.GetComponent<Player>().Selected_character[2].SetActive(false);
        }
        else if (PlayerData.SelectIndex==2)
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