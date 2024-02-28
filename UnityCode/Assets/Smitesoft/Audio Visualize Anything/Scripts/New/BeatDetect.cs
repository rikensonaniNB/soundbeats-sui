using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BeatDetect : MonoBehaviour
{
    public static BeatDetect beatDetect;
    public List<float> beatDetectList = new List<float>();
    public List<float> beatTimes = new List<float>();
    public float audioLength;
    public float currentTime;

    private void Start()
    {
        if (beatDetect == null)
            beatDetect = this;
        else if (beatDetect != this)
            Destroy(gameObject);

       // audioLength = AudioVisualizeManager.visualizeManager.audioSource.clip.length;
        Debug.Log("Beat Detect.cs :::=  " + audioLength);
    }

    public void AddToBeatList(float value)
    {
        beatDetectList.Add(value);
    }
}