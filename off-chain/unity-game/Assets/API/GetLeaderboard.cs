using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using System;
using UnityEngine.UI;
using System.Linq;

//TODO: is this used? Is it needed? 
public class GetLeaderboard : MonoBehaviour
{
    public List<LeaderboardData> leaderboardList;
    public GameObject prefabObj;
    public Transform parentObj;

    void Start()
    {
        GetLeaderboardAPI();
    }

    [ContextMenu("Get Leaderboard")]
    public void GetLeaderboardAPI()
    {
        StartCoroutine(GetLeaderboards());
    }

    IEnumerator GetLeaderboards()
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get("http://45.79.126.10:3009/user/leaderboard"))
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
                LeaderboardResponse response = JsonConvert.DeserializeObject<LeaderboardResponse>(jsonResponse);
                Debug.Log("Response" + response.data.Count);
                // Do something with the leaderboard data, e.g. add it to a custom class
                //MyLeaderboardClass myLeaderboard = new MyLeaderboardClass();
                leaderboardList.Clear();
                foreach (Transform s in parentObj.transform)
                {
                    Destroy(s.gameObject);
                }
                foreach (LeaderboardData data in response.data)
                {
                    Debug.Log(response.data.Count);
                    Debug.Log(data._id);
                    Debug.Log(data.wallet_address);
                    Debug.Log(data.score);
                    LeaderboardData leaderboard = new LeaderboardData(data._id, data.wallet_address, data.score, data.__v);
                    leaderboardList.Add(leaderboard);
                    leaderboardList = leaderboardList.OrderByDescending(x => x.score).ToList();
                    //myLeaderboard.AddData(data._id, data.wallet_address, data.score, data.__v);
                }
                foreach (var data in leaderboardList)
                {
                    var dataObject = Instantiate(prefabObj, parentObj);
                    dataObject.GetComponent<Image>().color = SuiWallet.GetActiveAddress() == data.wallet_address ? Color.green : Color.grey;
                    dataObject.transform.GetChild(0).GetComponent<Text>().text = data.wallet_address;
                    dataObject.transform.GetChild(3).GetComponent<Text>().text = data.score.ToString();
                }
            }
        }
    }

    [System.Serializable]
    public class LeaderboardData
    {
        public string _id;
        public string wallet_address;
        public int score;
        public int __v;

        [SerializeField]
        public LeaderboardData(string id, string walletAddress, int _score, int version)
        {
            _id = id;
            wallet_address = walletAddress;
            score = _score;
            __v = version;
        }
    }

    [System.Serializable]
    public class LeaderboardResponse
    {
        public bool success;
        public List<LeaderboardData> data;
    }
}
[Serializable]
public class MyLeaderboardClass
{
    private List<string> ids = new List<string>();
    private List<string> walletAddresses = new List<string>();
    private List<int> scores = new List<int>();
    private List<int> versions = new List<int>();

    [SerializeField]
    public void AddData(string id, string walletAddress, int score, int version)
    {
        ids.Add(id);
        walletAddresses.Add(walletAddress);
        scores.Add(score);
        versions.Add(version);
    }
}