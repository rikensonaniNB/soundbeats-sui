using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using System;
using System.Text.RegularExpressions;

//TODO: (MED) can this all be removed? 
public class NFTManager : MonoBehaviour
{
    public static NFTManager instance;
    //public List<GETNFTResponse> userList;
    public GameObject uiController;
    
    private void Awake()
    {
        instance = this;
    }

    [ContextMenu("Send NFT Owned")]
    public void SendNFTOwned(string url, string nft, string address)
    {
        StartCoroutine(SendNFTOwned_Post(url, nft, address));
    }

    IEnumerator SendNFTOwned_Post(string url, string nft, string address)
    {
        NFTOwned_Post data = new NFTOwned_Post();
        data.wallet_address = address;
        data.NFT = nft;
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

    public class NFTOwned_Post
    {
        public string NFT;
        public string wallet_address;
    }

    [Serializable]
    public class LeaderBoardDatum
    {
        public string _id;
        public string wallet_address;
        public int score;
        public int __v;
    }

    [Serializable]
    public class NFT
    {
        public string _id;
        public string wallet_address;
        public string nft;
        public int __v;
    }
}
