using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SendToDrive : MonoBehaviour
{
    public static SendToDrive instance;
    public string yourDocId;
    private const string baseUrl = "https://docs.google.com/forms/u/0/d/e/";
    private const string responceString = "/formResponse";
    private string txt1, txt2, txt3, txt4;
    
    //create a new form and get shareable link
    //entries are find in your google form link https://docs.google.com/forms/d/e/<YourDocId>/viewform
    //inspect in this link and find entry link this in input type <input type="hidden" name="entry.1392865032" value="">
    //paste all entries in this
    private const string entry1 = "entry.65750810";
    private const string entry2 = "entry.562148096";
    private const string entry3 = "entry.1271498660";
    private const string entry4 = "entry.1392865032";

    private void Awake()
    {
        instance = this;
    }

    private IEnumerator Post(string text1, string text2, string text3, string text4)
    {
        var url = baseUrl + yourDocId + responceString;
        WWWForm form = new WWWForm();
        form.AddField(entry1, text1);
        form.AddField(entry2, text2);
        form.AddField(entry3, text3);
        form.AddField(entry4, text4);
        byte[] bytes = form.data;
        WWW www = new WWW(url, bytes);
        yield return www;
    }
}
