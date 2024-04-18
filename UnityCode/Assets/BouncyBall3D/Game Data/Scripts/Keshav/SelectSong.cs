using DG.Tweening;
using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class SelectSong : MonoBehaviour
{
    public TMP_Text Name;
    public Image ThumbnailImage;
    private Song _song;
    public Toggle toggle;
    public SongDataSet _songDataSet;
    public GameObject _songDataSetObj;
    public string _songDataSetObjName;
    private Vector3 levelPlayerPosition = new Vector3(-1.79f, 113.45f, -2.45f);
    public int LevelNumber;
    private bool canSeePlayer = true;

    private void Start()
    {
        //_songDataSet = FindObjectOfType<SongDataSet>();

        _songDataSetObj = GameObject.Find(_songDataSetObjName);
        _songDataSet = _songDataSetObj.GetComponent<SongDataSet>();
    }

    public void init(string songname, string songdetail, Sprite image, Song _song, bool playerDisplay)
    {
        Name.text = $"<size=16><b>{songname}</b></size>\n{songdetail}";
        ThumbnailImage.sprite = image;
        canSeePlayer = playerDisplay;
    }

    public void setSong()
    {
        // Player.instance.levelSelectorPlayer.transform.DOLocalMove(levelPlayerPosition, 1f);
        if (toggle)
        {
            if (GameManager.instance.producer == false && canSeePlayer == true)
            {
                Player.instance.levelSelectorPlayer.transform.SetParent(toggle.transform);
                Player.instance.levelSelectorPlayer.transform.DOLocalMove(levelPlayerPosition, 1f);
                Player.instance.levelSelectorPlayer.transform.localScale = new Vector3(9000, 9000, 9000);
            }
        }
        GameManager.instance.songDataPopUp.SetActive(true);
        SongSelectionPopup.Instance.setData(LevelNumber - 1, canSeePlayer);

        StartCoroutine(SetSongData());
    }

    public IEnumerator SetSongData()
    {
        //yield return new WaitForSeconds(0.001f);
        if (canSeePlayer)
        {
            yield return new WaitForSeconds(1.2f);
        }
        //if (toggle.isOn)
        //{
        LevelGenerator.Instance.currentSong = _song;
        foreach (SongData data in _songDataSet.Songs)
        {
            //if (gameObject.name == data.openPlayPanel.name)
            //{
            //    //data.openPlayPanel.SetActive(true);
            //    toggle.isOn = false;
            //}
        }
        //}
    }

}