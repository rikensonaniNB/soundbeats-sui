using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using System.Collections.Generic;

public class GameManager : Singleton<GameManager>
{
    public int score = 0;
    public int star = 0;
    public GameObject gameStartText;

    private int gameSpeed = 1;
    public float GameSpeed => ((gameSpeed - 1) * 0.2f) + 1;
    public GameState CurrentGameState => gameState;
    private System.DateTime gameStartTime;

    public GameState gameState;
    public Player player;
    float songProgress = 0;
    public bool isPausePopupOpen = false;
    int tempTokenAmount = 0;

    [Header("UI")]

    public GameObject homePanel;
    public Image levelProgress;
    [SerializeField] Text scoreText;
    [SerializeField] Animator scoreAnim;
    [SerializeField] Animator reviveAnim;
    [SerializeField] GameObject revivePanel, playButton, Winpanel;
    [Space]
    [SerializeField] Text songName;
    [SerializeField] Text songNameWin;

    [SerializeField] Text levelScore;
    [SerializeField] Image[] stars = new Image[3];
    [SerializeField] Color activeStars, inactiveStars;

    [SerializeField] Text scoreTextCompletion;
    [SerializeField] Text bestScoreTxt;
    [SerializeField] Text scoreTokens;
    [SerializeField] Button playAgain_Button;

    [SerializeField] GameObject quitScreen;
    [SerializeField] GameObject pauseButton;
    [SerializeField] GameObject SongList;
    [SerializeField] Button OpenSongListbtn;
    public Button PlayBtn;
    public GameObject ThresoldPanal;
    public Slider ThresoldSlider;
    public Text ThresoldValueTxt;
    public float ThresoldValue;
    public List<GameObject> SongListObj = new List<GameObject>();
    public List<Song> SongLists = new List<Song>();
    public int n;
    protected override void Awake()
    {
        base.Awake();

        player = FindObjectOfType<Player>();
    }

    private void Start()
    {
        scoreText.text = score.ToString();
        gameStartText.SetActive(true);
        if (scoreAnim.isActiveAndEnabled)
            scoreAnim.SetTrigger("Up");
    }

    public Text ScoreWin;

    public int GetGameDuration()
    {
        return (int)System.DateTime.Now.Subtract(this.gameStartTime).TotalSeconds;
    }

    public void PlayerWin()
    {
        gameState = GameState.Win;
        //WinPanel.SetActive(true);
        //revivePanel.SetActive(true);
        Winpanel.SetActive(true);
        UIManager.Instance.ShowHUD(false);

        if (LevelGenerator.Instance.currentSong.stars < star)
        {
            LevelGenerator.Instance.currentSong.stars = star;
            LevelGenerator.Instance.currentSong.SaveData();
        }

        //replace best score 
        int bestScore = this.GetBestScore(score);

        //send score to leaderboard
        if (SuiWallet.HasActiveAddress())
        {
            NetworkManager.Instance.SendLeaderboardScore(
                UserData.WalletAddress,
                score,
                null,
                null
            );
        }

        ShowLevelProgress();
        ScoreWin.text = score.ToString();
        if (score > PlayerPrefsExtra.GetInt(LevelGenerator.Instance.currentSong.name))
        {
            PlayerPrefsExtra.SetInt(LevelGenerator.Instance.currentSong.name, score);
        }
        PlayerPrefsExtra.Save();
        Debug.Log("win");
        GoogleAnalytics.Instance.SendPlayerWin(score, this.GetGameDuration());
    }

    public void PlayerFailed()
    {
        //if (ServicesManager.instance != null)
        //{
        //    ServicesManager.instance.ShowInterstitialAdmob();
        //    ServicesManager.instance.ShowInterstitialUnityAds();
        //}
        Debug.Log("SelectIndex...>" + UserData.SelectedNftIndex);
        var myPlayer = player.Selected_character[UserData.SelectedNftIndex].gameObject;
        Debug.Log("PlayerFailed...>" + myPlayer.name);
        gameState = GameState.Lost;
        SoundManager.Instance.StopTrack();
        revivePanel.SetActive(true);
        UIManager.Instance.ShowHUD(false);

        if (LevelGenerator.Instance.currentSong.stars < star)
        {
            LevelGenerator.Instance.currentSong.stars = star;
            LevelGenerator.Instance.currentSong.SaveData();
        }

        //replace best score 
        int bestScore = this.GetBestScore(score);

        //send score to leaderboard
        if (SuiWallet.HasActiveAddress())
        {
            NetworkManager.Instance.SendLeaderboardScore(
                UserData.WalletAddress,
                score,
                null,
                null
            );
        }

        ShowLevelProgress();
        if (score > PlayerPrefsExtra.GetInt(LevelGenerator.Instance.currentSong.name))
        {
            PlayerPrefsExtra.SetInt(LevelGenerator.Instance.currentSong.name, score);
        }        //Debug.Log(PlayerPrefsExtra.GetInt(songName.name));


        PlayerPrefsExtra.Save();
        // Add score here
        scoreTextCompletion.text = score.ToString();
        bestScoreTxt.text = bestScore.ToString();
        scoreTokens.text = score.ToString() + " Tokens";

        LevelGenerator.Instance.RemovePlatforms();
        //if (score > 0)
        //{
        //    RequestTokenDto requestTokenDto = new RequestTokenDto
        //    {
        //        amount = score,
        //        recipient = SuiWallet.ActiveWalletAddress
        //    };
        //    this.tempTokenAmount = requestTokenDto.amount; //TODO: we really should have the amount be part of the response DTO
        //    NetworkManager.Instance.RequestToken(requestTokenDto, OnSuccessfulRequestPrivateToken, OnErrorRequestPrivateToken);
        //}
        //GoogleAnalytics.Instance.SendPlayerLost(score, this.GetGameDuration());
        score = 0;
    }

    private int GetBestScore(int score)
    {
        int bestScore = UserData.BestScore;
        if (score > bestScore)
        {
            bestScore = score;
            UserData.BestScore = bestScore;
        }

        return bestScore;
    }

    private void OnSuccessfulRequestPrivateToken(RequestTokenResponseDto requestTokenResponseDto)
    {
        Debug.Log("RequestPrivateToken successfully updated " + requestTokenResponseDto.signature);
        GoogleAnalytics.Instance.SendMintedTokens(SuiWallet.ActiveWalletAddress, this.tempTokenAmount);
    }

    private void OnErrorRequestPrivateToken(string Error)
    {
        Debug.Log("Error on RequestPrivateToken " + Error);
    }
    public void SelectSong(int Num)
    {
        n = Num;
        OpenThresoldPanal();
    }
    public void OnCloseThresoldpanal()
    {
        if (PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text == "Generate")
        {
            PlaySong();
        }
        else if (PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text == "Finish")
        {
            ThresoldPanal.SetActive(false);
            LevelGenerator.Instance.OpenFileAndPlaySongWithGameStart(LevelGenerator.Instance.currentSong.name + ".json");
            foreach (Transform a in SetBox.instance.gameObject.transform)
            {
                Destroy(a.gameObject);
            }
            ThresoldPanal.GetComponent<Image>().enabled = true;
            ThresoldPanal.transform.GetChild(0).localPosition = new Vector3(0, 0, 0);
            ThresoldPanal.transform.GetChild(0).localScale = new Vector3(1f, 1f, 1f);
            playsongs1.SetActive(true);
            gameui.SetActive(true);
            gameObject.transform.GetChild(0).gameObject.SetActive(true);
            playerObj.SetActive(true);
            foreach (Transform b in playsongs.gameObject.transform)
            {
                b.gameObject.transform.GetChild(0).gameObject.SetActive(false);
            }
        }
    }

    public GameObject playsongs, playsongs1, gameui, playerObj;
    public void PlaySong()
    {
        SongListObj[n].GetComponent<SongHolder>().PlaySong();
        SongListObj[n].GetComponent<SongHolder>().PlayButton.interactable = false;
        homePanel.SetActive(false);
        ThresoldPanal.GetComponent<Image>().enabled = false;
        ThresoldPanal.transform.GetChild(0).localPosition = new Vector3(400, 0, 0);
        ThresoldPanal.transform.GetChild(0).localScale = new Vector3(0.5f, 0.5f, 0.5f);
        playsongs1.SetActive(false);
        gameui.SetActive(false);
        gameObject.transform.GetChild(0).gameObject.SetActive(false);
        playerObj.SetActive(false);
        foreach (Transform b in playsongs.gameObject.transform)
        {
            b.gameObject.transform.GetChild(0).gameObject.SetActive(false);
        }
    }
    void ShowLevelProgress()
    {
        songName.text = LevelGenerator.Instance.currentSong.name;
        songNameWin.text = LevelGenerator.Instance.currentSong.name;

        levelScore.text = score.ToString();
        for (int i = 0; i < 3; i++)
        {
            if (i < star)
                stars[i].color = activeStars;
            else
                stars[i].color = inactiveStars;
        }
    }

    void videocomplet(bool copmlet) { }

    [ContextMenu("Revive")]
    public void Revive()
    {
        //Advertisements.Instance.ShowInterstitial();
        Debug.Log("Revive");
        // if (Advertisements.Instance.IsRewardVideoAvailable())
        {
            player.Revive();
            revivePanel.SetActive(false);
            //playButton.SetActive(true);
            //  Advertisements.Instance.ShowRewardedVideo(videocomplet);
        }
    }

    [ContextMenu("ReviveSucceed")]
    public void ReviveSucceed(bool completed)
    {
        Debug.Log("ReviveSucceed");
        if (completed)
        {
            player.Revive();
            revivePanel.SetActive(false);
            //playButton.SetActive(true);
        }
    }
    public void HidePopup()
    {
        Debug.Log("HidePopup");
        scoreText.text = "0";
        player.ResetPlayer();
        revivePanel.SetActive(false);
        playButton.SetActive(true);

        // LevelGenerator.Instance.StartWithSong();
        //SongHolder.Instance.PlaySong();



    }
    public void StartGame()
    {
        this.gameStartTime = System.DateTime.Now;
        Debug.Log("StartGame" + CurrentGameState);
        if (CurrentGameState == GameState.Menu)
        {
            star = 0;
            gameState = GameState.Gameplay;
            player.StartMoving();
            SoundManager.Instance.PlayMusicFromBeat(player.platformHitCount);
        }
        else if (CurrentGameState == GameState.Lost)
        {
            gameState = GameState.Gameplay;
            player.StartMoving();
            SoundManager.Instance.PlayMusicFromBeat(player.platformHitCount);
        }
        UIManager.Instance.ShowHUD(true);
        // GoogleAnalytics.Instance.SendGameStart(LevelGenerator.Instance.currentSong.name);
    }
    public void OpenSongSelectList()
    {
        if (!SongList.activeSelf)
        {
            SongList.SetActive(true);
            OpenSongListbtn.transform.GetChild(0).GetComponent<Text>().text = "Close List";
        }
        else if (SongList.activeSelf)
        {
            SongList.SetActive(false);
            OpenSongListbtn.transform.GetChild(0).GetComponent<Text>().text = "Open List";
        }
    }
    public void OnvlaueChange()
    {
        ThresoldValue = ThresoldSlider.value;
        ThresoldValueTxt.text = ThresoldSlider.value.ToString();
        Debug.LogError("value:::::" + ThresoldValue);
    }
    public void OpenThresoldPanal()
    {
        ThresoldSlider.value = 0;
        ThresoldSlider.maxValue = 2;
        ThresoldSlider.minValue = 0;

        ThresoldValueTxt.text = ThresoldSlider.value.ToString();
        if (!ThresoldPanal.activeSelf)
        {
            ThresoldPanal.SetActive(true);
        }
    }

    public void IncreaseGameSpeed()
    {
        if (gameSpeed < 5)
            gameSpeed++;
    }

    public void AddScore(bool perfect)
    {
        if (perfect)
            score += 10;
        else
            score += 5;

        scoreText.text = score.ToString();
        scoreAnim.SetTrigger("Up");
    }
    public LevelGenerator LevelGenerator;
    public void UpdateSongProgress(float value)
    {
        songProgress = value;
        levelProgress.fillAmount = Mathf.Lerp(levelProgress.fillAmount, value, 0.1f);
    }

    public void NoThanks()
    {
        reviveAnim.SetTrigger("No");

        //  Advertisements.Instance.ShowInterstitial();
    }

    public void onClose()
    {
        // SongHolder.Instance.rhythmdata = null;
        LevelGenerator.Instance.currentSong = null;
        Debug.Log("on close");
        Time.timeScale = 1;
        gameState = GameState.Menu;
        SoundManager.Instance.StopTrack();
        score = 0;
        // LevelGenerator.Instance.RemovePlatforms();
        quitScreen.SetActive(false);
        pauseButton.SetActive(true);
        HidePopup();
        LevelGenerator.Instance.RemovePlatforms();
        LevelGenerator.Instance.myDataList.dataSave.Clear();
        // SongHolder.Instance.rhythmdata = null;
        UIManager.Instance.ShowMainMenu();
    }

    public void onNO()
    {
        quitScreen.SetActive(false);
        Time.timeScale = 1;
        SoundManager._Instance.ResumeMusic();
        GameManager.Instance.gameState = GameState.Gameplay;
        pauseButton.SetActive(true);
        GameManager.Instance.isPausePopupOpen = false;
    }

    public void onPause()
    {
        GameManager.Instance.isPausePopupOpen = true;
        pauseButton.SetActive(false);
        quitScreen.SetActive(true);
        GameManager.Instance.gameState = GameState.Pause;
        Time.timeScale = 0;
    }

    public void OnSendingToWallet()
    {
        HidePopup();
        UIManager.Instance.ShowNFTWallet();
    }

    public void OnSendingCharacterSelection()
    {
        HidePopup();
        UIManager.Instance.ShowPlayerSelection();
    }

    public void Menu()
    {
        SceneManager.LoadScene(0);
        //  Advertisements.Instance.ShowInterstitial();
    }

    public IEnumerator GameStartText()
    {
        gameStartText.SetActive(true);
        yield return new WaitForSecondsRealtime(5);
        //gameStartText.SetActive(false);
    }

    public void GameStartTextHide()
    {
        gameStartText.SetActive(false);
    }
}
