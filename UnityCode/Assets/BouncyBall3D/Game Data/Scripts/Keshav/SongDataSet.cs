using System;
using UnityEngine;

public class SongDataSet : MonoBehaviour
{
    public SongData[] Songs;
}

[Serializable]
public class SongData
{
    public Song currentSong;
    public string ExtraInfo;
}