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
    public Vector3 levelPlayerPosition;
    public int LevelNumber;

    private void Start()
    {
        //_songDataSet = FindObjectOfType<SongDataSet>();

        _songDataSetObj = GameObject.Find(_songDataSetObjName);
        _songDataSet = _songDataSetObj.GetComponent<SongDataSet>();
    }

    public void init(string songname, string songdetail, Sprite image, Song _song)
    {
        Name.text = $"<size=16><b>{songname}</b></size>\n{songdetail}";
        ThumbnailImage.sprite = image;
    }

    public void setSong()
    {
        Player.instance.levelSelectorPlayer.transform.DOLocalMove(levelPlayerPosition, 1f);
        SongSelectionPopup.Instance.setData(LevelNumber - 1);

        StartCoroutine(SetSongData());
    }

    public IEnumerator SetSongData()
    {
        yield return new WaitForSeconds(1.2f);
        if (toggle.isOn)
        {
            LevelGenerator.Instance.currentSong = _song;
            foreach (SongData data in _songDataSet.Songs)
            {
                //if (gameObject.name == data.openPlayPanel.name)
                //{
                //    //data.openPlayPanel.SetActive(true);
                //    toggle.isOn = false;
                //}
            }
        }
    }

}