using System;
using System.Collections;
using UnityEngine;

public class GoogleAnalytics :  Singleton<GoogleAnalytics>
{
    private const string TrackingID = "G-ZC******W"; 

    public void SendGameStart()
    {
        SendEvent("user_engagement", "game_start", "Game Started", 1);
    }

    public void SendPlayerWin()
    {
        SendEvent("user_engagement", "player_win", "Player Won", 1);
    }

    public void SendPlayerFailed()
    {
        SendEvent("user_engagement", "player_lose", "Player Failed", 1);
    }

    public void SendEvent(string category, string action, string label, int value = 0)
    {
        string url = "https://www.google-analytics.com/collect";
        
        // Construct the Measurement Protocol parameters
        string payload = $"v=1&t=event&tid={TrackingID}&cid={SystemInfo.deviceUniqueIdentifier}&ec={category}&ea={action}&el={label}&ev={value}";

        WWW www = new WWW(url, System.Text.Encoding.UTF8.GetBytes(payload));
        StartCoroutine(SendRequest(www));
    }

    private IEnumerator SendRequest(WWW www)
    {
        yield return www;

        if (www.error != null)
        {
            Debug.LogError("Error sending analytics event: " + www.error);
        }
        else
        {
            Debug.Log("Analytics event sent successfully!");
        }
    }
}

