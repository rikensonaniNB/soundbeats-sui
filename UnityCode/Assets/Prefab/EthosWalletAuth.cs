using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;
//using Ethos.Sui;
using UnityEngine.Networking;
using System.Collections;
using Unity.VisualScripting;

public class EthosWalletAuth : MonoBehaviour
{
    public Button loginButton;
    private string EthosWalletAPIKey = "735bd22b-b0ad-4d05-ae87-f025c119fea3";
    private string baseURL = "https://api.ethoswallet.xyz/api/v1";
    private string apikeyUrl = "/auth/apikey";


    private void Start()
    {
        loginButton.onClick.AddListener(() => Login());
        MakePostRequest();
    }

    public void MakePostRequest()
    {
        StartCoroutine(SendPostRequest());
    }

    private IEnumerator SendPostRequest()
    {

        // Create a new UnityWebRequest object.
        UnityWebRequest request = new UnityWebRequest(baseURL + apikeyUrl, "POST");

        // Set the request headers.
        //request.SetRequestHeader("accept", "application/json");
        request.SetRequestHeader("authorization", EthosWalletAPIKey);
        request.SetRequestHeader("content-type", "application/json");

        // Set the request body.
        request.uploadHandler = new UploadHandlerRaw(Encoding.UTF8.GetBytes(""));

        // Send the request and wait for the response.
        yield return request.SendWebRequest();

        // Check if the request was successful.
        if ((request.result == UnityWebRequest.Result.ConnectionError || request.result == UnityWebRequest.Result.DataProcessingError))
        {
            Debug.LogError(request.error);
            yield break;
        }

        //Debug.Log("Outout1 : " + request.downloadHandler);
        //Debug.Log("Outout2 : " + request.result);
        //Debug.Log("Outout3 : " + request.downloadProgress);
        //Debug.Log("Outout4 : " + request.result.GetType());
        //Debug.Log("Outout5 : " + request.downloadHandler.ToShortString());

        EthosWalletAuthAPIKeyResponse response = JsonUtility.FromJson<EthosWalletAuthAPIKeyResponse>(request.downloadHandler.text);
        Debug.Log("ID: " + response.id);
        Debug.Log("Name: " + response.name);

        Debug.Log($"Auth request successful");

        // Dispose of the request and download handler objects.
        request.Dispose();

        // Yield the response data.
        //yield return responseData;
    }

    private void Login()
    {

    }
}


public class EthosWalletAuthAPIKeyResponse
{
    public string id { get; set; }
    public string name { get; set; }
}