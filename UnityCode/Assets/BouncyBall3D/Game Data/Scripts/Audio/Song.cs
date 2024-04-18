using UnityEngine;

[CreateAssetMenu(fileName = "New Song", menuName = "Create Song Asset")]
public class Song : ScriptableObject
{
    public AudioClip song;
    public int BPM;
    public int stars;
    public int SongScore;
    public Sprite SongImage;
    public TextAsset songTxtJson;
    public float TimeFromBeat(int beat)
    {
        return song.length / (song.length / 60 * BPM) * beat;
    }

    public int BeatFromTime(float time)
    {
        return (int)((time * song.length) / 60 * BPM);
    }

    public void LoadData()
    {
        stars = PlayerPrefs.GetInt(name + "Stars", 0);
        SongScore = PlayerPrefs.GetInt(song.name);

    }

    public void SaveData()
    {
        PlayerPrefs.SetInt(name + "Stars", stars);
    }
}