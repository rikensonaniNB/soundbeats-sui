using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SongSelectionPopup : Singleton<SongSelectionPopup>
{
    public Text Name;
    public Image ThumbnailImage;
    public Text AutherName;
    public Text Length;
    public Song _song;
    public SongDataSet _songDataSet;
    public SongDataSet _songDataSetProducer;
    public GameObject InfoPanel;
    private bool canWaitForFewSec = true;

    public void setData(int songIndex = 0, bool canWait = true)
    {
        canWaitForFewSec = canWait;
        if (GameManager.instance.producer == false)
        {
            Name.text = _songDataSet.Songs[songIndex].currentSong.name;
            AutherName.text = _songDataSet.Songs[songIndex].ExtraInfo;
            float totalSeconds = _songDataSet.Songs[songIndex].currentSong.song.length;
            float minutes = Mathf.Floor(totalSeconds / 60f);
            float seconds = totalSeconds % 60f;
            string formattedTime = string.Format("{0:00}:{1:00} mins", minutes, seconds);
            Length.text = formattedTime;
            _song = _songDataSet.Songs[songIndex].currentSong;
            ThumbnailImage.sprite = _song.SongImage;
            StartCoroutine(DisplayPopup());
        }
        if (GameManager.instance.producer == true)
        {
            Name.text = _songDataSetProducer.Songs[songIndex].currentSong.name;
            AutherName.text = _songDataSetProducer.Songs[songIndex].ExtraInfo;
            float totalSeconds = _songDataSet.Songs[songIndex].currentSong.song.length;
            float minutes = Mathf.Floor(totalSeconds / 60f);
            float seconds = totalSeconds % 60f;
            string formattedTime = string.Format("{0:00}:{1:00} mins", minutes, seconds);
            Length.text = formattedTime;
            _song = _songDataSetProducer.Songs[songIndex].currentSong;
            ThumbnailImage.sprite = _song.SongImage;
            StartCoroutine(DisplayPopup());
            setProducerSongIndex = songIndex;
        }
    }

    public IEnumerator DisplayPopup()
    {
        if (canWaitForFewSec)
            yield return new WaitForSeconds(0.2f);
        InfoPanel.SetActive(true);
        Player.instance.levelSelectorPlayer.SetActive(false);
    }
    private int setProducerSongIndex = 0;
    public void closePopupAndStartGame()
    {
        if (GameManager.instance.producer == false)
        {
            UIManager.Instance.gameUI.SetActive(true);
            GameManager.instance.player.gameObject.SetActive(true);
            GameManager.instance.pauseButton.SetActive(true);
            GameManager.instance.platform.SetActive(true);
            Player.instance.ResetPlayer();
            Debug.Log("PlaySong " + _song.name);

            Player.instance.characters[Player.instance.characterSelect].transform.position
                = new Vector3(Player.instance.characters[Player.instance.characterSelect].transform.position.x, 0,
                    Player.instance.characters[Player.instance.characterSelect].transform.position.z);

            LevelGenerator.Instance.currentSong = _song;
            LevelGenerator.Instance.StartWithSong();
            Advertisements.Instance.ShowInterstitial();
            InfoPanel.SetActive(false);
            GameManager.instance.levelSelection.SetActive(false);
            GameManager.instance.mainCamera.SetActive(true);
            GameManager.instance.sky.SetActive(true);
            RenderSettings.skybox = GameManager.instance.mainCameraMat;
            GameManager.instance.producerCamera.SetActive(false);
            foreach (Transform allwhiteBalls in SetBox.instance.whiteBallParent.transform)
            {
                Destroy(allwhiteBalls);
            }
            GameManager.instance.player.gameObject.transform.GetChild(10).gameObject.SetActive(true);
            GameManager.instance.platform.SetActive(true);
            UIController.instance.HomeScreen.SetActive(false);
            UIController.instance.SelectCharacterScreen.SetActive(false);
            UIController.instance.LeaderboardScreen.SetActive(false);
            UIController.instance.SuiWalletScreen.SetActive(false);
        }
        if (GameManager.instance.producer == true)
        {
            LevelGenerator.Instance.currentSong = _song;
            GameManager.instance.SelectSong(setProducerSongIndex);
            InfoPanel.SetActive(false);
        }
    }

    public void closePopup()
    {
        Player.instance.levelSelectorPlayer.SetActive(true);
    }
}
