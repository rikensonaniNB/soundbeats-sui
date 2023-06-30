using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;

//TODO: (MED) I think this whole class can be removed
public class LeaderboardManager : MonoBehaviour
{
    public static LeaderboardManager instance;
    private void Awake()
    {
        instance = this;
    }

    [ContextMenu("Send Score - Create Leaderboard")]
    public void SendScore(string url, string address, int score)
    {
        StartCoroutine(SendCreateLeaderboard(url, address, score));
    }
    
    IEnumerator SendCreateLeaderboard(string url, string address, int score)
    {
        CreateLeaderboardDto data = new CreateLeaderboardDto();
        data.wallet = address;
        data.score = score;
        string jsonData = JsonUtility.ToJson(data);
        byte[] postData = System.Text.Encoding.UTF8.GetBytes(jsonData);

        using (UnityWebRequest www = UnityWebRequest.Post(url, ""))
        {
            www.uploadHandler = new UploadHandlerRaw(postData);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Error sending request: " + www.error);
            }
            else
            {
                Debug.Log("Request successful");
            }
        }
    }
}

