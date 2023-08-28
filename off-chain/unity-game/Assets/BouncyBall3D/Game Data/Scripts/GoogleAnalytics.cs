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

    public void SendError(string errorMessage, string action = "") 
    {
        SendEvent("error", action, errorMessage);
    }

    public void SendGameStart(string songName)
    {
        SendEvent("gameplay", "gameStart", songName);
    }

    public void SendPlayerWin(int score, int duration)
    {
        SendEvent("gameplay", "gameResult", "W " + duration.ToString(), score);
    }

    public void SendPlayerLost(int score, int duration)
    {
        SendEvent("gameplay", "gameResult", "L " + duration.ToString(), score);
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
}
