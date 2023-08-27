using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

public class GoogleAnalytics : Singleton<GoogleAnalytics>
{
    //call to request the front end Javascript code to send a GA tag (google analytics)
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void CallSendGTag(string category, string action, string label, int value);

    private const string TrackingID = "G-ZC639JTDEW";

    public void SendGameStart(string songName)
    {
        SendEvent("gameplay", "gameStart", songName);
    }

    public void SendPlayerWin(int score)
    {
        SendEvent("gameplay", "gameResult", "Win", score);
    }

    public void SendPlayerLost(int score)
    {
        SendEvent("gameplay", "gameResult", "Loss", score);
    }

    public void SendSelectedCharacter(string charName)
    {
        SendEvent("gameplay", "selectedCharacter", charName);
    }

    public void SendSelectedSong(string songName)
    {
        SendEvent("gameplay", "selectedSong", songName);
    }

    public void SendEvent(string category, string action, string label, int value = 0) 
    {
        CallSendGTag(category, action, label, value);
    }

    /*
    public void SendEvent(string category, string action, string label, int value = 0)
    {
        string url = "https://www.google-analytics.com/collect";

        // Construct the Measurement Protocol parameters
        string payload = $"v=1&t=event&tid={TrackingID}&cid={SystemInfo.deviceUniqueIdentifier}&ec={category}&ea={action}&el={label}&ev={value}";

        UnityWebRequest www = UnityWebRequest.Post(url, payload);
        StartCoroutine(SendRequest(www, payload));
    }

    private IEnumerator SendRequest(UnityWebRequest www, string payload)
    {
        yield return www;

        if (www.error != null)
        {
            Debug.LogError($"Error sending analytics event{payload}: {www.error}");
        }
        else {
            Debug.Log(payload);
        }
    }
    */
}
