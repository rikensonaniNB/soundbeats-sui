using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using System;
using UnityEngine.UI;
using System.Linq;

public class GetLeaderboard : MonoBehaviour
{
    public GameObject prefabObj;
    public Transform parentObj;

    void Start()
    {
    }

    /// <summary>
    /// This method kicks off the process of calling the API method to get leaderboard scores, and displaying them 
    /// in the display table. 
    /// </summary>
    [ContextMenu("Get Leaderboard")]
    public void GetLeaderboardAPI()
    {
        NetworkManager.Instance.GetLeaderboard(OnGetLeaderboardsSuccess, OnGetLeaderboardError);
    }

    /// <summary>
    /// Clears the UI row items in the leaderboard display table. 
    /// </summary>
    private void ClearList()
    {
        foreach (Transform s in parentObj.transform)
        {
            Destroy(s.gameObject);
        }
    }

    /// <summary>
    /// Adds the items in the given response to the UI table as rows. 
    /// </summary>
    /// <param name="response">Response from API call to get leaderboard scores.</param>
    private void DisplayList(LeaderboardResponseDto response)
    {
        var scores = response.scores.OrderBy(s => s.score).Reverse().ToArray();
        foreach (var score in scores)
        {
            var dataObject = Instantiate(prefabObj, parentObj);
            dataObject.GetComponent<Image>().color = SuiWallet.ActiveWalletAddress == score.wallet ? Color.green : Color.grey;
            dataObject.transform.GetChild(0).GetComponent<Text>().text = score.wallet;
            dataObject.transform.GetChild(3).GetComponent<Text>().text = score.score.ToString();
        }
    }

    /// <summary>
    /// Executes when the API call to get leaderboard scores succeeds. 
    /// </summary>
    /// <param name="response">API response object</param>
    private void OnGetLeaderboardsSuccess(LeaderboardResponseDto response) 
    {
        ClearList(); 
        DisplayList(response);
    }

    /// <summary>
    /// Executes when the API call to get leaderboard scores fails.
    /// </summary>
    /// <param name="error">Error message</param>
    private void OnGetLeaderboardError(string error) 
    {
        //TODO: (MED) do on error? 
    }
}