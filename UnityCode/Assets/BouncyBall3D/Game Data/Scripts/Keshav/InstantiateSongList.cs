using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class InstantiateSongList : MonoBehaviour
{
    public SelectSong songPrefab;
    public Transform contentParent;
    public SongDataSet songDataSet;

    void Start()
    {
        InstantiateSongs();
    }

    void InstantiateSongs()
    {
        foreach (SongData songData in songDataSet.Songs)
        {
            SelectSong newSongObject = Instantiate(songPrefab, contentParent);
            newSongObject.name = songData.Name;
            newSongObject.init(songData.Name, songData.ExtraInfo, songData.Thumbnail, songData.currentSong);
            newSongObject.gameObject.SetActive(true);
        }
    }
}
