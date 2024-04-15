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
    private Song _song;
    public SongDataSet _songDataSet;
    public GameObject InfoPanel;

    public void setData(int songIndex = 0)
    {
        Name.text = _songDataSet.Songs[songIndex].Name;
        AutherName.text = _songDataSet.Songs[songIndex].ExtraInfo;
        int totalSeconds = int.Parse(_songDataSet.Songs[songIndex].Duration);
        int minutes = totalSeconds / 60;
        int seconds = totalSeconds % 60;
        string formattedTime = string.Format("{0:00}:{1:00} mins", minutes, seconds);
        Length.text = formattedTime;
        ThumbnailImage.sprite = _songDataSet.Songs[songIndex].Thumbnail;
        _song = _songDataSet.Songs[songIndex].currentSong;
        StartCoroutine(DisplayPopup());
    }

    public IEnumerator DisplayPopup()
    {
        yield return new WaitForSeconds(1.2f);
        InfoPanel.SetActive(true);
        GameManager.instance.levelSelectorPlayer.SetActive(false);
    }

    public void closePopupAndStartGame()
    {

        UIManager.Instance.gameUI.SetActive(true);
        GameManager.instance.playerObj.SetActive(true);
        GameManager.instance.platform.SetActive(true);
        Player.instance.ResetPlayer();
        GameManager.instance.producer = false;
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
    }

    public void closePopup()
    {
        GameManager.instance.levelSelectorPlayer.SetActive(true);
    }
}
