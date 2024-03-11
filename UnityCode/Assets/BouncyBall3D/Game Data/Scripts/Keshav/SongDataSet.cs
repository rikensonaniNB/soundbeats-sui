using System;
using UnityEngine;

public class SongDataSet : MonoBehaviour
{
    public SongData[] Songs;
}

[Serializable]
public class SongData
{
    public string Name;
    public string ExtraInfo;
    public Sprite Thumbnail;
    public string Duration;
    public string score;
    public int stars;
    public Song currentSong;
    public GameObject openPlayPanel;
}