using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.Networking;
using UnityEngine;
using UnityEngine.UI;


public class CSVDownloader : MonoBehaviour
{
    //Make sure your spreedsheet is share to anyone with this link and give access to editor
    public List<CSVData> csvDataList;
    public string yourDocID;
    //public Text text1, text2, text3, text4;
    private string exportString = "&exportFormat=csv";
    private string baseUrl = "https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=";
    public GameObject prefabObj;
    public Transform parentObj;

    private void Start()
    {
        //MyFunc();
    }

    [ContextMenu("MyFunc")]
    public void MyFunc()
    {
        //StartCoroutine(MyCoro());
    }
    IEnumerator MyCoro()
    {
        var url = baseUrl + yourDocID + exportString;
        csvDataList.Clear();
        foreach (Transform s in parentObj.transform)
        {
            Destroy(s.gameObject);
        }
        UnityWebRequest www = UnityWebRequest.Get(url); // Create a UnityWebRequest to download the CSV file
        yield return www.SendWebRequest(); // Send the request and wait for the response

        if (www.result == UnityWebRequest.Result.Success) // If the request was successful
        {
            string csvText = www.downloadHandler.text; // Get the CSV text from the response
            string[] lines = csvText.Split('\n'); // Split the CSV text into lines

            List<List<string>> rows = new List<List<string>>(); // Create a list to store the rows

            // Loop through the lines starting from the second row (index 1)
            for (int i = 1; i < lines.Length; i++)
            {
                if (string.IsNullOrEmpty(lines[i])) // Skip empty lines
                    continue;

                string[] values = lines[i].Split(','); // Split the line into values

                List<string> row = new List<string>(); // Create a list to store the values

                // Loop through the values starting from the second column (index 1)
                for (int j = 1; j < values.Length; j++)
                {
                    row.Add(values[j]); // Add the value to the list of values
                }
                rows.Add(row); // Add the row to the list of rows
            }
            // Sort rows by column 3 in descending order
            rows.Sort((a, b) =>
            {
                int aVal, bVal;
                if (!int.TryParse(a[3], out aVal))
                {
                    // Return -1 if value in a is not a valid integer
                    return -1;
                }
                if (!int.TryParse(b[3], out bVal))
                {
                    // Return 1 if value in b is not a valid integer
                    return 1;
                }
                // First sort by column 3 in descending order
                int cmp = bVal.CompareTo(aVal);
                if (cmp != 0)
                    return cmp;

                // Then sort by column 0 in ascending order
                return a[0].CompareTo(b[0]);
            });

            HashSet<string> uniqueValues = new HashSet<string>();
            foreach (var row in rows)
            {
                string column0Value = row[0];

                // Check if column 0 value has already been added to the list
                if (uniqueValues.Contains(column0Value))
                    continue;

                uniqueValues.Add(column0Value);

                CSVData csvData = new CSVData(row[0], /*row[1], row[2],*/ row[3]);
                csvDataList.Add(csvData);
            }
            foreach (var data in csvDataList)
            {
                var dataObject = Instantiate(prefabObj, parentObj);
                dataObject.GetComponent<Image>().color = SuiWallet.ActiveWalletAddress == data.Column1 ? Color.green : Color.grey;
                dataObject.transform.GetChild(0).GetComponent<Text>().text = data.Column1;
                /*dataObject.transform.GetChild(1).GetComponent<Text>().text = data.Column2;
                dataObject.transform.GetChild(2).GetComponent<Text>().text = data.Column3;*/
                dataObject.transform.GetChild(3).GetComponent<Text>().text = data.Column4;
            }
            Debug.Log("RowCount...>" + rows.Count);
        }
        else
        {
            Debug.Log("Failed to download CSV file: " + www.error);
        }
    }
    
    [Serializable]
    public class CSVData
    {
        public string Column1;
        /*public string Column2;
        public string Column3;*/
        public string Column4;

        [SerializeField]
        public CSVData(string column1, /*string column2, string column3,*/ string column4)
        {
            Column1 = column1;
            /*Column2 = column2;
            Column3 = column3;*/
            Column4 = column4;
        }
    }
}
