using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using System;
using System.Text.RegularExpressions;

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

    //TODO: this should be removable
    /*
    [ContextMenu("Get NFT Owned And Score")]
    public void GetNFTSCORE(string address)
    {
        StartCoroutine(GetNFTSCORE_Post(address));
    }

    IEnumerator GetNFTSCORE_Post(string address)
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get("http://45.79.126.10:3009/user/NFT/" + address))
        {
            yield return webRequest.SendWebRequest();

            if (webRequest.result == UnityWebRequest.Result.ConnectionError || webRequest.result == UnityWebRequest.Result.ProtocolError)
            {
                Debug.Log("Error: " + webRequest.error);
            }
            else
            {
                string jsonResponse = webRequest.downloadHandler.text;
                Debug.Log("Json Response" + jsonResponse);
                GETNFTResponse response = JsonConvert.DeserializeObject<GETNFTResponse>(jsonResponse);
                Debug.Log("Response" + response.NFTs.Count);
                Debug.Log("Response" + response.leaderBoardData.Count);
                // Do something with the leaderboard data, e.g. add it to a custom class
                //MyLeaderboardClass myLeaderboard = new MyLeaderboardClass();
                int count = 0;

                foreach (NFT data in response.NFTs)
                {
                    Debug.Log(response.NFTs.Count);
                    Debug.Log(data._id);
                    Debug.Log(data.wallet_address);
                    Debug.Log(data.nft);
                    Debug.Log(int.Parse(data.nft.Substring(4)));
                    PlayerPrefs.SetInt("NFTOwned_count", response.NFTs.Count);
                    PlayerPrefs.SetInt("NFTOwned_" + count, int.Parse(data.nft.Substring(4)));
                    count += 1;
                    //myLeaderboard.AddData(data._id, data.wallet_address, data.score, data.__v);
                }

                if(PlayerPrefs.HasKey("NFTOwned_count"))
                {
                    for (int i = 0; i < PlayerPrefs.GetInt("NFTOwned_count"); i++)
                    {
                        GameManager.Instance.NFTOwned.Add(PlayerPrefs.GetInt("NFTOwned_" + i));
                        PlayerPrefs.SetString("selectedIndex", PlayerPrefs.GetInt("NFTOwned_" + i).ToString());
                        PlayerData.SelectIndex = PlayerPrefs.GetInt("NFTOwned_" + i);
                    }
                    uiController.GetComponent<UIController>().SelectNfts();
                }

                foreach (LeaderBoardDatum data in response.leaderBoardData)
                {
                    Debug.Log(response.leaderBoardData.Count);
                    Debug.Log(data._id);
                    Debug.Log(data.wallet_address);
                    Debug.Log(data.score);
                    PlayerPrefs.SetInt("bestScore", data.score);
                }
            }
        }
    }

    [Serializable]
    public class GETNFTResponse
    {
        public bool success;
        public List<NFT> NFTs;
        public List<LeaderBoardDatum> leaderBoardData;
    }
    */ 
}
