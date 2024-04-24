using System;
using UnityEngine;

public class SongDataSet : MonoBehaviour
{
    public SongData[] Songs;
    public static SongDataSet Instance;
    private void Start()
    {
        Instance = this;
    }
}

[Serializable]
public class SongData
{
    public Song currentSong;
    public string ExtraInfo;
}
