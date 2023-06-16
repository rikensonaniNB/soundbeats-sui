using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.Networking;
using System;
using Newtonsoft.Json;

public class NetworkManager : Singleton<NetworkManager>
{
    public GetTokenBalanceResponseDto getTokenBalanceResponseDto;

    #region [Server Communication]
    /// <summary>
    /// This method is used to begin sending request process.
    /// </summary>
    /// <param name="url">API url.</param>
    /// <param name="callbackOnSuccess">Callback on success.</param>
    /// <param name="callbackOnFail">Callback on fail.</param>
    /// <typeparam name="T">Data Model Type.</typeparam>
    private void SendRequest<T>(string url, UnityAction<T> callbackOnSuccess, UnityAction<string> callbackOnFail, string reqType, Dictionary<string,string> body=null)
    {
        if (reqType == "post")
        {
            StartCoroutine(RequestCoroutine_Post(url, callbackOnSuccess, callbackOnFail, body));
            Debug.Log(body);
        }
        else if(reqType == "postToken")
        {
            StartCoroutine(RequestTokenCoroutine_Post(url, callbackOnSuccess, callbackOnFail, body));
            Debug.Log("Post Token: " + body);
        }
        else
        {
            StartCoroutine(RequestCoroutine_Get(url, callbackOnSuccess, callbackOnFail));
        }
    }
    /// <summary>
    /// Coroutine that handles communication with REST server For GET Request.
    /// </summary>
    /// <returns>The coroutine.</returns>
    /// <param name="url">API url.</param>
    /// <param name="callbackOnSuccess">Callback on success.</param>
    /// <param name="callbackOnFail">Callback on fail.</param>
    /// <typeparam name="T">Data Model Type.</typeparam>
    private IEnumerator RequestCoroutine_Get<T>(string url, UnityAction<T> callbackOnSuccess, UnityAction<string> callbackOnFail)
    {
        UnityWebRequest request;
        request = UnityWebRequest.Get(url);
       
        yield return request.SendWebRequest();
        if (request.isNetworkError || request.isHttpError)
        {
            Debug.LogError(request.error);
            callbackOnFail?.Invoke(request.error);
            request.Dispose();
        }
        else
        {
            Debug.Log(request.downloadHandler.text);
            ParseResponse(request.downloadHandler.text, callbackOnSuccess, callbackOnFail);
            request.Dispose();
        }
    }

    /// <summary>
    /// Coroutine that handles communication with REST server for POST request.
    /// </summary>
    /// <returns>The coroutine.</returns>
    /// <param name="url">API url.</param>
    /// <param name="callbackOnSuccess">Callback on success.</param>
    /// <param name="callbackOnFail">Callback on fail.</param>
    /// <typeparam name="T">Data Model Type.</typeparam>
    private IEnumerator RequestCoroutine_Post<T>(string url, UnityAction<T> callbackOnSuccess, UnityAction<string> callbackOnFail, Dictionary<string, string> body)
    {

        UnityWebRequest request;
        
        WWWForm form = new WWWForm();

        foreach (KeyValuePair<string, string> post_arg in body)
        {
            Debug.Log("key   " + post_arg.Key + "   value  " + post_arg.Value);
            form.AddField(post_arg.Key, post_arg.Value);
        }
        body.Clear();

        request = UnityWebRequest.Post(url, form);
       
        yield return request.SendWebRequest();
        if (request.isNetworkError || request.isHttpError)
        {
            Debug.LogError(request.error);
            callbackOnFail?.Invoke(request.error);
            request.Dispose();
        }
        else
        {
            Debug.Log(request.downloadHandler.text);
            ParseResponse(request.downloadHandler.text, callbackOnSuccess, callbackOnFail);
            request.Dispose();
        }
    }

    public class Root
    {
        public int amount { get; set; }
        public string recipient { get; set; }
    }

    /// <summary>
    /// Coroutine that handles communication with REST server for POST request.
    /// </summary>
    /// <returns>The coroutine.</returns>
    /// <param name="url">API url.</param>
    /// <param name="callbackOnSuccess">Callback on success.</param>
    /// <param name="callbackOnFail">Callback on fail.</param>
    /// <typeparam name="T">Data Model Type.</typeparam>
    private IEnumerator RequestTokenCoroutine_Post<T>(string url, UnityAction<T> callbackOnSuccess, UnityAction<string> callbackOnFail, Dictionary<string, string> body)
    {
        //UnityWebRequest request;


        Root form = new Root();
        int index = 0;
        foreach (KeyValuePair<string, string> post_arg in body)
        {
            Debug.Log("key   " + post_arg.Key + "   value  " + post_arg.Value);
            if(index == 0)
            {
                form.amount = int.Parse(post_arg.Value);
                index++;
            }
            else
            {
                form.recipient = post_arg.Value;
            }
            
        }
        Debug.Log("key   " + form.amount + "   value  " + form.recipient);
        //body.Clear();
        //request = UnityWebRequest.Post(url, form);

        var request = new UnityWebRequest(url, UnityWebRequest.kHttpVerbPOST);
        string json = JsonConvert.SerializeObject(form);
        byte[] bodyRaw = new System.Text.UTF8Encoding().GetBytes(json);
        Debug.Log(bodyRaw);
        Debug.Log(json);
        request.uploadHandler = (UploadHandler)new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = (DownloadHandler)new DownloadHandlerBuffer();
        request.SetRequestHeader("Accept", "application/json");
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();
        Debug.Log("Status Code: " + request.responseCode);
        if (request.isNetworkError || request.isHttpError)
        {
            Debug.LogError(request.error);
            callbackOnFail?.Invoke(request.error);
            request.Dispose();
        }
        else
        {
            Debug.Log(request.downloadHandler.text);
            ParseResponse(request.downloadHandler.text, callbackOnSuccess, callbackOnFail);
            request.Dispose();
        }
    }

    /// <summary>
	/// This method finishes request process as we have received answer from server.
    /// </summary>
    /// <param name="data">Data received from server in JSON format.</param>
    /// <param name="callbackOnSuccess">Callback on success.</param>
    /// <param name="callbackOnFail">Callback on fail.</param>
    /// <typeparam name="T">Data Model Type.</typeparam>
    private void ParseResponse<T>(string data, UnityAction<T> callbackOnSuccess, UnityAction<string> callbackOnFail)
    {
        var parsedData = JsonUtility.FromJson<T>(data);
        Debug.Log(data);
        Debug.Log(parsedData);
        callbackOnSuccess?.Invoke(parsedData);
    }
    #endregion

    /// <summary>
    /// This method call server API to create NFT.
    /// </summary>
    /// <param name="callbackOnSuccess">Callback on success.</param>
    /// <param name="callbackOnFail">Callback on fail.</param>
    public void CreateNFT(CreateNFTRequest body, UnityAction<CreateNFTResponseDto> callbackOnSuccess, UnityAction<string> callbackOnFail)
    {
        var json = JsonConvert.SerializeObject(body);
        //Debug.Log("Json   " + json);
        var dictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
        //Debug.Log("Dictionary  " + dictionary["signature"]);
        SendRequest(string.Format(ServerConfig.SERVER_API_URL_FORMAT, ServerConfig.API_POST_CREATE_NFT), callbackOnSuccess, callbackOnFail, "post", dictionary);
    }

    //TODO: remove this 
    /// <summary>
    /// This method call server API to request NFT.
    /// </summary>
    /// <param name="callbackOnSuccess">Callback on success.</param>
    /// <param name="callbackOnFail">Callback on fail.</param>
    public void RequestNFT(RequestNFTDto body, UnityAction<RequestNFTResponseDto> callbackOnSuccess, UnityAction<string> callbackOnFail)
    {
        var json = JsonConvert.SerializeObject(body);
        var dictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
        Debug.Log(json);
        SendRequest(string.Format(ServerConfig.SERVER_API_URL_FORMAT, ServerConfig.API_POST_REQUEST_NFT), callbackOnSuccess, callbackOnFail, "post", dictionary);
    }

    /// <summary>
    /// This method call server API to request Token.
    /// </summary>
    /// <param name="callbackOnSuccess">Callback on success.</param>
    /// <param name="callbackOnFail">Callback on fail.</param>
    public void RequestToken(RequestTokenDto body, UnityAction<RequestTokenResponseDto> callbackOnSuccess, UnityAction<string> callbackOnFail)
    {
        var json = JsonConvert.SerializeObject(body);
        var dictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
        Debug.Log(json);
        Debug.Log(dictionary.ContainsKey("signature"));
        foreach(KeyValuePair<string, string> items in dictionary)
        {
            Debug.Log("You have " + items.Value + " " + items.Key);

        }
        SendRequest(string.Format(ServerConfig.SERVER_API_URL_FORMAT, ServerConfig.API_POST_REQUEST_PRIVATE_TOKEN), callbackOnSuccess, callbackOnFail, "postToken",dictionary);
    }

    /// <summary>
    /// This method call server API to Get Private Token Balance.
    /// </summary>
    /// <param name="callbackOnSuccess">Callback on success.</param>
    /// <param name="callbackOnFail">Callback on fail.</param>
    public void GetPrivateTokenBalance(string wallet, UnityAction<GetTokenBalanceResponseDto> callbackOnSuccess, UnityAction<string> callbackOnFail)
    {
        Debug.Log(ServerConfig.API_GET_PRIVATE_TOKEN_BALANCE+wallet);
        
        SendRequest(string.Format(ServerConfig.SERVER_API_URL_FORMAT, ServerConfig.API_GET_PRIVATE_TOKEN_BALANCE+wallet), callbackOnSuccess, callbackOnFail, "get");
    }
}

/// <summary>
/// This class store server config keys and urls.
/// </summary>
public class ServerConfig
{
    // URL with place to put API method in it.
    public const string SERVER_API_URL_FORMAT = "http://43.206.80.52/{0}";
    public const string API_POST_CREATE_NFT = "api/v1/nfts";
    public const string API_POST_REQUEST_NFT = "api/v1/nfts/request";
    public const string API_POST_REQUEST_PRIVATE_TOKEN = "api/v1/token";
    public const string API_GET_PRIVATE_TOKEN_BALANCE = "api/v1/token?wallet=";

    //URL of Leaderboard and NFT
    public const string LeaderboardNFT_API_URL_FORMAT = "http://45.79.126.10:3009/user/";
    public const string API_POST_Leaderboard_Create = "leaderboard/create";
    public const string API_POST_NFT_Create = "NFT/create";
    public const string API_GET_Leaderboard = "leaderboard";
    public const string API_GET_NFT = "NFT";
}

[Serializable]
public class CreateNFTRequest
{
    public string name;// Name of the NFT
    public string imageUrl;//URL of the NFT image
    public int quantity; //default: 1    Number of NFT to be minted
    public string recipient; //The address of the recipient
}

[Serializable]
public class CreateNFTResponseDto
{
    public string signature;//The signature of the transaction
    public string[] addresses;//The list of NFT addresses minted
}

//TODO: remove this 
[Serializable]
public class RequestNFTDto
{
    public string nftAddress;//The address of the NFT
    public string recipient; //The address of the recipient
}

//TODO: remove this 
[Serializable]
public class RequestNFTResponseDto
{
    public string signature;//The signature of the transaction
}

[Serializable]
public class RequestTokenDto
{
    public int amount;//The amount of the token
    public string recipient;//The address of the recipient
}

[Serializable]
public class RequestTokenResponseDto
{
    public string signature;//The signature of the transaction

}
[Serializable]
public class GetTokenBalanceResponseDto
{
    public int balance;//The balance of the wallet
}

[Serializable]
public class CreateLeaderboard_Post
{
    public string wallet_address;
    public int score;
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

[Serializable]
public class GETNFT
{
    public bool success;
    public List<NFT> NFTs;
    public List<LeaderBoardDatum> leaderBoardData;
}