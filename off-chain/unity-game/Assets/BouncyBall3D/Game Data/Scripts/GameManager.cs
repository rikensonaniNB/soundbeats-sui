using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using System.Collections.Generic;

public class GameManager : Singleton<GameManager>
{
    public PlayerData playerData = new PlayerData();
    public int score = 0;
    public int bestScore = 0;
    public int star = 0;
    public GameObject gameStartText;

    private int gameSpeed = 1;
    public float GameSpeed => ((gameSpeed - 1) * 0.2f) + 1;
    public GameState CurrentGameState => gameState;

    public GameState gameState;
    public Player player;
    float songProgress = 0;

    [Header("UI")]
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

    public List<int> NFTOwned = new List<int>();

    protected override void Awake()
    {
        base.Awake();

        player = FindObjectOfType<Player>();
        bestScore = PlayerPrefs.GetInt("bestScore", 0);
        for(int i=0;i< PlayerPrefs.GetInt("NFTOwned_count");i++)
        {
            NFTOwned.Add(PlayerPrefs.GetInt("NFTOwned_" + i));
        }
    }

    private void Start()
    {
        scoreText.text = score.ToString();
        gameStartText.SetActive(false);
        if (scoreAnim.isActiveAndEnabled)
            scoreAnim.SetTrigger("Up");
    }
    public Text ScoreWin;
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

        if (score > bestScore)
        {
            PlayerPrefs.SetInt("bestScore", score);
        }
        ShowLevelProgress();
        ScoreWin.text = score.ToString();
        if (score > PlayerPrefs.GetInt(LevelGenerator.Instance.currentSong.name))
        {
            PlayerPrefs.SetInt(LevelGenerator.Instance.currentSong.name, score);
        }
        PlayerPrefs.Save();
        Debug.Log("win");
    }

    public void PlayerFailed()
    {
        //if (ServicesManager.instance != null)
        //{
        //    ServicesManager.instance.ShowInterstitialAdmob();
        //    ServicesManager.instance.ShowInterstitialUnityAds();
        //}
        Debug.Log("SelectIndex...>" + PlayerData.SelectIndex);
        var myPlayer = player.Selected_character[PlayerData.SelectIndex].gameObject;
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
        
        if (score > bestScore)
        {
            bestScore = score;
            PlayerPrefs.SetInt("bestScore", score);
            //SendToDrive.instance.Send();
            LeaderboardManager.instance.SendBestScore(
                ServerConfig.LeaderboardNFT_API_URL_FORMAT + ServerConfig.API_POST_Leaderboard_Create, 
                PlayerPrefs.GetString(SuiWallet.WalletAddressKey),
                bestScore
            );
        }
        ShowLevelProgress();
        if (score > PlayerPrefs.GetInt(LevelGenerator.Instance.currentSong.name))
        {
            PlayerPrefs.SetInt(LevelGenerator.Instance.currentSong.name, score);
        }        //Debug.Log(PlayerPrefs.GetInt(songName.name));


        PlayerPrefs.Save();
        // Add score here
        scoreTextCompletion.text = score.ToString();
        bestScoreTxt.text = bestScore.ToString();
        scoreTokens.text = score.ToString()+" Tokens";
        // PlayerData.TokenEanred += score;
        //PlayerPrefs.SetInt("tokens", PlayerData.TokenEanred);
        LevelGenerator.Instance.RemovePlatforms();
        if (score > 0)
        {
            RequestTokenDto requestTokenDto = new RequestTokenDto
            {
                amount = score,
                recipient = SuiWallet.GetActiveAddress()
            };
            NetworkManager.Instance.RequestToken(requestTokenDto, OnSuccessfulRequestPrivateToken, OnErrorRequestPrivateToken);
        }
        score = 0;
    }


    //TODO: is this used? 
    private void OnSuccessfulRequestPrivateToken(RequestTokenResponseDto requestTokenResponseDto)
    {
        Debug.Log("RequestPrivateToken successfully updated " + requestTokenResponseDto.signature);
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
        if (Advertisements.Instance.IsRewardVideoAvailable())
        {
            player.Revive();
            revivePanel.SetActive(false);
            //playButton.SetActive(true);
            Advertisements.Instance.ShowRewardedVideo(videocomplet);
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
        //playButton.SetActive(true);
        LevelGenerator.Instance.StartWithSong();
        
    }
    public void StartGame()
    {
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
        
       Advertisements.Instance.ShowInterstitial();
    }

    public void onClose()
    {
        Time.timeScale = 1;
        gameState = GameState.Menu;
        SoundManager.Instance.StopTrack();
        score = 0;
        LevelGenerator.Instance.RemovePlatforms();
        quitScreen.SetActive(false);
        pauseButton.SetActive(true);
        HidePopup();
        UIManager.Instance.ShowMainMenu();
    }

    public void onNO()
    {
        quitScreen.SetActive(false);
        Time.timeScale = 1;
        pauseButton.SetActive(true);
    }


    public void onPause()
    {
        pauseButton.SetActive(false);
        quitScreen.SetActive(true);
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
        Advertisements.Instance.ShowInterstitial();
    }
    
    public IEnumerator GameStartText() {
        gameStartText.SetActive(true);
        yield return new WaitForSecondsRealtime(3);
        gameStartText.SetActive(false);
    }
}
