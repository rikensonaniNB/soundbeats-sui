using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using System.Collections.Generic;
using UnityEditor;
using System.Reflection;
using Unity.VisualScripting;

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
    public bool isSpeedupActive = false;
    public Player player;
    float songProgress = 0;
    public bool isPausePopupOpen = false;
    int tempTokenAmount = 0;
    private int previousGameSpeed = 0;

    [Header("UI")]

    public Image levelProgress;
    [SerializeField] PowerupProgress powerupTimer;
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
    public Text ScoreWin;
    public LevelGenerator LevelGenerator;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////// PRODUCER /////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    [Space(25)]
    [Header("          PRODUCER")]
    [Space(25)]
    public bool producer;
    [Space]

    //[SerializeField] Button OpenSongListbtn;
    public Button PlayBtn;

    public GameObject producerManagerPopup;
    [Header("Thresold")]
    [Space]
    public Slider ThresoldSlider;
    public Text ThresoldValueTxt;
    public float ThresoldValue;

    [Header("RefreshTime")]
    [Space]
    public Slider RefreshTimeSlider;
    public Text RefreshTimeValueTxt;
    public float RefreshTimeValue;

    [Header("Output Multiplier")]
    [Space]
    public Slider PushMultiplierPartOneSlider;
    public Text PushMultiplierPartOneValueTxt;
    public float PushMultiplierPartOneValue;
    [Space]
    public Slider PushMultiplierPartTwoSlider;
    public Text PushMultiplierPartTwoValueTxt;
    public float PushMultiplierPartTwoValue;

    [Header("MinOutput_AND_MaxOutput")]
    [Space]
    public Slider MinOutputSlider;
    public Text MinOutputValueTxt;
    public float MinOutputValue;
    [Space]
    public Slider MaxOutputSlider;
    public Text MaxOutputValueTxt;
    public float MaxOutputValue;

    public List<GameObject> SongListObj = new List<GameObject>();
    public List<Song> SongLists = new List<Song>();
    public int n;
    public GameObject playsongs;
    public GameObject platform;
    public GameObject playerObj;
    public GameObject selectCharacter;
    public GameObject producerCloseBtn;
    public GameObject producerQuitScreen;
    public GameObject mainCamera;
    public GameObject producerCamera;
    public bool songPlaying = false;
    public GameObject holdPopUp;
    public GameObject congrats;
    public static GameManager instance;
    protected override void Awake()
    {
        base.Awake();

        player = FindObjectOfType<Player>();
        instance = this;
    }


    private void Start()
    {
        scoreText.text = score.ToString();
        gameStartText.SetActive(true);
        if (scoreAnim.isActiveAndEnabled)
            scoreAnim.SetTrigger("Up");
    }


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
        }
        //Debug.Log(PlayerPrefsExtra.GetInt(songName.name));


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
    //public void OpenSongSelectList()
    //{
    //    if (!SongList.activeSelf)
    //    {
    //        SongList.SetActive(true);
    //        OpenSongListbtn.transform.GetChild(0).GetComponent<Text>().text = "Close List";
    //    }
    //    else if (SongList.activeSelf)
    //    {
    //        SongList.SetActive(false);
    //        OpenSongListbtn.transform.GetChild(0).GetComponent<Text>().text = "Open List";
    //    }
    //}

    public void IncreaseGameSpeed()
    {
        if (gameSpeed < 5)
            gameSpeed++;
    }


    public void IncreaseGameSpeedForNSec()
    {
        if (gameState == GameState.Gameplay)
        {
            previousGameSpeed = gameSpeed;
            gameSpeed += 3;
            powerupTimer.gameObject.SetActive(true);
            Invoke("resetGameSpeedToPrevious", PowerUp.powerUpTimer);
        }
    }

    public void resetGameSpeedToPrevious()
    {
        Debug.Log("Resetting to Previous state");
        gameSpeed = previousGameSpeed;
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
    public void UpdateSongProgress(float value)
    {
        songProgress = value;
        levelProgress.fillAmount = Mathf.Lerp(levelProgress.fillAmount, value, 0.1f);
    }

    public void NoThanks()
    {
        reviveAnim.SetTrigger("No");

        //Advertisements.Instance.ShowInterstitial();
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
        gameState = GameState.Gameplay;
        pauseButton.SetActive(true);
        isPausePopupOpen = false;
    }

    public void onPause()
    {
        isPausePopupOpen = true;
        pauseButton.SetActive(false);
        quitScreen.SetActive(true);
        gameState = GameState.Pause;
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////// PRODUCER /////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public void okBtn()
    {
        producerManagerPopup.SetActive(false);
        platform.SetActive(true);
        pauseButton.SetActive(false);
        gameState = GameState.Menu;
        UIManager.Instance.ShowMainMenu();
        producerManagerPopup.SetActive(false);
        producerQuitScreen.SetActive(false);
        UIController.instance.HomeScreen.SetActive(true);
        UIController.instance.Mint_NFTScreen.SetActive(false);
        UIManager.Instance.gameUI.SetActive(false);
        gameObject.transform.GetChild(0).gameObject.SetActive(true);
        playerObj.SetActive(true);
        UIController.instance.SuiWalletScreen.SetActive(false);
        UIController.instance.SelectCharacterScreen.SetActive(false);
        selectCharacter.SetActive(true);
        congrats.SetActive(false);
        foreach (Transform b in playsongs.gameObject.transform)
        {
            b.gameObject.transform.GetChild(0).gameObject.SetActive(false);
            b.gameObject.transform.gameObject.SetActive(true);

        }
        AudioVisualizeManager.instance.audioSource.enabled = false;
        foreach (Transform allboxs in SetBox.instance.gameObject.transform)
        {
            Destroy(allboxs.gameObject);
        }
    }

    public void CloseNftPopUp()
    {
        foreach (Transform alljson in LevelGenerator.Instance.FileNameparraent)
        {
            Destroy(alljson.gameObject);
        }
    }

    public void closeBtnProducer()
    {
        Time.timeScale = 0;
        producerCloseBtn.SetActive(false);
        producerQuitScreen.SetActive(true);
    }

    public void onCloseProducer()
    {
        LevelGenerator.Instance.currentSong = null;
        platform.SetActive(true);
        Debug.Log("on close");
        Time.timeScale = 1;
        gameState = GameState.Menu;
        SoundManager.Instance.StopTrack();
        score = 0;
        LevelGenerator.Instance.RemovePlatforms();
        quitScreen.SetActive(false);
        pauseButton.SetActive(true);
        HidePopup();
        LevelGenerator.Instance.myDataList.dataSave.Clear();
        UIManager.Instance.ShowMainMenu();
        producerManagerPopup.SetActive(false);
        producerQuitScreen.SetActive(false);
        UIController.instance.HomeScreen.SetActive(true);
        UIController.instance.Mint_NFTScreen.SetActive(false);
        UIManager.Instance.gameUI.SetActive(false);
        gameObject.transform.GetChild(0).gameObject.SetActive(false);
        playerObj.SetActive(true);
        UIController.instance.SuiWalletScreen.SetActive(false);
        UIController.instance.SelectCharacterScreen.SetActive(false);
        selectCharacter.SetActive(true);
        PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text = "Generate";
        foreach (Transform b in playsongs.gameObject.transform)
        {
            b.gameObject.transform.GetChild(0).gameObject.SetActive(false);
            b.gameObject.transform.gameObject.SetActive(true);

        }
        AudioVisualizeManager.instance.audioSource.enabled = false;
        foreach (Transform b in playsongs.gameObject.transform)
        {
            b.gameObject.transform.GetChild(0).gameObject.SetActive(true);
            b.gameObject.transform.gameObject.SetActive(false);
        }
        foreach (Transform allboxs in SetBox.instance.gameObject.transform)
        {
            Destroy(allboxs.gameObject);
        }
    }

    public void ProducerQuitNo()
    {
        Time.timeScale = 1;
        SoundManager._Instance.ResumeMusic();
        gameState = GameState.Gameplay;
        producerCloseBtn.SetActive(true);
        producerQuitScreen.SetActive(false);
    }
    public void SelectSong(int Num)
    {
        foreach (Transform platformPool in LevelGenerator.Instance.platformPool.transform)
        {
            Debug.Log(platformPool.name);
        }
        foreach (Transform movingPlatformPool in LevelGenerator.Instance.movingPlatformPool.transform)
        {
            Debug.Log(movingPlatformPool.name);
        }

        n = Num;

        OpenThresoldPanal();
    }

    public void OpenThresoldPanal()
    {
        ///// ThresoldSlider /////
        ThresoldSlider.value = 0;
        ThresoldSlider.minValue = 0;
        ThresoldSlider.maxValue = 2;
        ThresoldValueTxt.text = ThresoldSlider.value.ToString();

        ///// RefreshTimeSlider /////
        RefreshTimeSlider.value = 0.1f;
        RefreshTimeSlider.minValue = 0.01f;
        RefreshTimeSlider.maxValue = 0.1f;
        RefreshTimeValueTxt.text = RefreshTimeSlider.value.ToString();

        ///// Output_Multiplier /////
        PushMultiplierPartOneSlider.value = 0f;
        PushMultiplierPartOneSlider.minValue = 0f;
        PushMultiplierPartOneSlider.maxValue = 1f;
        ///////////////////////////////////////////
        PushMultiplierPartTwoSlider.value = 1f;
        PushMultiplierPartTwoSlider.minValue = 0f;
        PushMultiplierPartTwoSlider.maxValue = 100f;

        ///// MinOutput_AND_MaxOutput /////
        MinOutputSlider.value = -1f;
        MinOutputSlider.minValue = -4f;
        MinOutputSlider.maxValue = 4f;
        /////////////////////////////////
        MaxOutputSlider.value = 1f;
        MaxOutputSlider.minValue = -4f;
        MaxOutputSlider.maxValue = 4f;


        if (!producerManagerPopup.activeSelf)
        {
            AudioVisualizeManager.instance.audioSource.enabled = true;
            producerManagerPopup.SetActive(true);
            producerCloseBtn.SetActive(true);
            LevelGenerator.Instance.RemovePlatforms();
            ////////// Add Strat //////////
            UIController.instance.HomeScreen.SetActive(false);
            //UIController.instance.Mint_NFTScreen.SetActive(false);
            producerObj.SetActive(false);
            platform.SetActive(false);
            UIManager.Instance.gameUI.SetActive(false);
            gameObject.transform.GetChild(0).gameObject.SetActive(false);
            playerObj.SetActive(false);
            UIController.instance.SuiWalletScreen.SetActive(false);
            UIController.instance.SelectCharacterScreen.SetActive(false);
            selectCharacter.SetActive(false);
            PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text = "Generate";
            foreach (Transform b in playsongs.gameObject.transform)
            {
                b.gameObject.transform.GetChild(0).gameObject.SetActive(false);
                b.gameObject.transform.gameObject.SetActive(true);

            }
            mainCamera.SetActive(true);
            producerCamera.SetActive(false);
            songPlaying = false;
            ////////// End //////////
        }
    }
    public GameObject producerObj;

    public void ResetPopManager()
    {
        ThresoldSlider.value = 0;
        Debug.Log($"<color=blue> Threshold_Slider_Value </color>" + ThresoldSlider.value);
        RefreshTimeSlider.value = 0.1f;
        Debug.Log($"<color=blue> Refresh_Time_Slider_Value </color>" + RefreshTimeSlider.value);
        PushMultiplierPartOneSlider.value = 0f;
        Debug.Log($"<color=blue> Push_Multiplier_Past_One_Slider_Value </color>" + PushMultiplierPartOneSlider.value);
        PushMultiplierPartTwoSlider.value = 1f;
        Debug.Log($"<color=blue> Push_Multiplier_Past_Two_Slider_Value </color>" + PushMultiplierPartTwoSlider.value);
        MinOutputSlider.value = -1f;
        Debug.Log($"<color=blue> Min_Output_Slider_Value </color>" + MinOutputSlider.value);
        MaxOutputSlider.value = 1f;
        Debug.Log($"<color=blue> max_Output_Slider_Value </color>" + MaxOutputSlider.value);
    }

    public void OnvlaueChange()
    {
        ///// Thresold /////
        ThresoldValue = ThresoldSlider.value;
        ThresoldValueTxt.text = ThresoldSlider.value.ToString();

        ///// RefreshTime /////
        RefreshTimeValue = RefreshTimeSlider.value;
        RefreshTimeValueTxt.text = RefreshTimeSlider.value.ToString();

        ///// Output_Multiplier /////
        PushMultiplierPartOneValue = PushMultiplierPartOneSlider.value;
        PushMultiplierPartOneValueTxt.text = PushMultiplierPartOneSlider.value.ToString();
        ////////////////////////////
        PushMultiplierPartTwoValue = PushMultiplierPartTwoSlider.value;
        PushMultiplierPartTwoValueTxt.text = PushMultiplierPartTwoSlider.value.ToString();

        ///// MinOutput_AND_MaxOutput /////
        MinOutputValue = MinOutputSlider.value;
        MinOutputValueTxt.text = MinOutputSlider.value.ToString();
        ///////////////////////////
        MaxOutputValue = MaxOutputSlider.value;
        MaxOutputValueTxt.text = MaxOutputSlider.value.ToString();


        Debug.Log($"<color=yellow> ThresoldValue :: </color>" + ThresoldValue);
        Debug.Log($"<color=yellow> RefreshTimeValue :: </color>" + RefreshTimeValue);
        Debug.Log($"<color=yellow> PushMultiplierPartOneValue :: </color>" + PushMultiplierPartOneValue);
        Debug.Log($"<color=yellow> PushMultiplierPartTwoValue :: </color>" + PushMultiplierPartTwoValue);
        Debug.Log($"<color=yellow> MinOutputValue :: </color>" + MinOutputValue);
        Debug.Log($"<color=yellow> MaxOutputValue :: </color>" + MaxOutputValue);
    }

    public void OnCloseThresoldpanal()
    {
        if (PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text == "Generate")
        {
            if (songPlaying == true)
            {
                ShowPlayingPopUp();
            }
            else
            {
                PlaySong();
                SetBox.instance.SpawnWhiteBalls();
            }
        }
        else if (PlayBtn.transform.GetChild(0).gameObject.GetComponent<Text>().text == "Finish")
        {
            producerManagerPopup.SetActive(false);
            LevelGenerator.Instance.OpenFileAndPlaySongWithGameStart(LevelGenerator.Instance.currentSong.name + ".json");
            foreach (Transform a in SetBox.instance.gameObject.transform)
            {
                Destroy(a.gameObject);
            }
            platform.SetActive(true);
            UIController.instance.Mint_NFTScreen.SetActive(false);
            UIManager.Instance.gameUI.SetActive(true);
            gameObject.transform.GetChild(0).gameObject.SetActive(true);
            playerObj.SetActive(true);
            foreach (Transform b in playsongs.gameObject.transform)
            {
                b.gameObject.transform.GetChild(0).gameObject.SetActive(false);
                b.gameObject.transform.gameObject.SetActive(true);
            }
            mainCamera.SetActive(true);
            producerCamera.SetActive(false);
        }
    }

    public void RegenerateBtn()
    {
        Debug.Log($"<color=green> REGENRATE </color>");
        AudioVisualizeManager.visualizeManager.audioSource.Stop();
        LevelGenerator.Instance.myDataList.dataSave.Clear();
        foreach (Transform allboxs in SetBox.instance.gameObject.transform)
        {
            Destroy(allboxs.gameObject);
        }
        ////////// RESTART SONG SAVE DATA AND PLAYING //////////
        SongListObj[n].GetComponent<SongHolder>().PlaySongProducer();
    }

    public void PlaySong()
    {
        Debug.Log("Song name:" + songName);
        SongListObj[n].GetComponent<SongHolder>().PlaySongProducer();
        SongListObj[n].GetComponent<SongHolder>().PlayButton.interactable = true;
        SetBox.instance.camerabool = true;
        mainCamera.SetActive(false);
        producerCamera.SetActive(true);
        songPlaying = true;
    }

    public void ShowPlayingPopUp()
    {
        Debug.Log("Show_Hold_PopUp");
        holdPopUp.SetActive(true);
    }

}
