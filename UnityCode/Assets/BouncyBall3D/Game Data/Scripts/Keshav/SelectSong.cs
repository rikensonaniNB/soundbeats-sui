using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class SelectSong : MonoBehaviour
{
    public TMP_Text Name;
    public Image ThumbnailImage;
    private Song _song;
    public Toggle toggle;

    public void init(string songname, string songdetail, Sprite image, Song _song)
    {
        Name.text = $"<size=16><b>{songname}</b></size>\n{songdetail}";
        ThumbnailImage.sprite = image;
    }

    public void setSong()
    {
        if (toggle.isOn)
        {
            LevelGenerator.Instance.currentSong = _song;
        }
    }

}