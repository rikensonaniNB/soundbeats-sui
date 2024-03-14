using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.UI;

public class LevelGenerator : Singleton<LevelGenerator>
{
    #region Fields
    //[HideInInspector]
    public Song currentSong;
    [Space]
    [HideInInspector] public int platformsPassed = 0;
    [SerializeField] int platformsDrawn = 7;
    [SerializeField] float platformTurnStep = 0.5f;
    [SerializeField] float levelWidth = 10;
    [Range(0f, 1f)]
    [SerializeField] float movingPlatformChance = 0.2f;
    [Space]
    [SerializeField] Player player;
    public Pool platformPool;
    public Pool movingPlatformPool;
    [SerializeField] GameObject starPrefab, PowerUpPrefab;
    public int hitindex = 0;
    int[] starIDs = new int[3];

    //int songLevel = 0;
    int platformCount;
#pragma warning disable 0414
    bool nextPlatformIsStart = false;
#pragma warning restore 0414
    float lastPlatformZ = 0;
    public List<GameObject> platformList = new List<GameObject>();
    public List<int> countlist = new List<int>();
    public int randomNum = 0;
    public GameObject WinPlace;
    public int count = 1;
    [Space(25)]
    [Header("PRODUCER")]
    //public GameObject FileNamePrefab;
    //public Transform FileNameparraent;
    public string fileName;
    public DataList myDataList = new DataList();
    public int Distance;

    public int beatPerSong => (int)((currentSong.song.length / 60f) * currentSong.BPM);
    public float distanceBetweenPlatforms => currentSong.song.length / beatPerSong * (player == null ? 10 : player.speed) /*+ hitindex*/;
    public bool PathIsValid => platformList.Count > 2;

    float TurnStep
    {
        get
        {
            float value = 0;

            if (Random.Range(0f, 1f) > 0.1f)
                value = Random.Range(platformTurnStep / 2, platformTurnStep);
            else
                value = platformTurnStep * 2;

            return value;
        }
    }

    public Transform GetSpecificPlatform(int id)
    {
        return platformList[id].transform;
    }

    public int check = 0;
    public int getcount;
    public Transform GetNextPlatform
    {

        get
        {
            //hitindex = 100;
            //getcount = countlist[player.platformHitCount];

            if (count % Random.Range(1, 6) == 0)
            {
                hitindex = Random.Range(-3, -6);
                count++;
            }
            else
            {
                hitindex = Random.Range(0, 3);
                count++;
                //Debug.Log(hitindex);

            }


            GameObject platform = platformList[2];
            if (platformList[0].tag == "Moving")
                movingPlatformPool.ReturnItem(platformList[0]);
            else
                platformPool.ReturnItem(platformList[0]);
            platformList.RemoveAt(0);

            GameObject newPlatform = null;
            if (Random.Range(0f, 1f) <= movingPlatformChance && platformCount != beatPerSong - 1)
                newPlatform = movingPlatformPool.GetItem;
            else
                newPlatform = platformPool.GetItem;

            newPlatform.GetComponent<Animator>().SetTrigger("Spawn");
            if (check == 1)
            {
                //nextPlatformIsStart = false;
                newPlatform.name = "Start";
                Reposition(WinPlace, platformCount);
                //WinPlace.transform.position = newPlatform.transform.position;
                platformList.Add(WinPlace);

                Debug.Log("winner");
                //return WinPlace.transform;
                return platform.transform;
            }

            Reposition(newPlatform, platformCount);
            platformList.Add(newPlatform);
            platformCount++;
            platformsPassed++;

            if (platformsPassed >= beatPerSong)
            {
                IncreaseDificulty();

            }
            //hitindex = 10;

            return platform.transform;
        }
    }



    #endregion



    public void StartWithSong()
    {
        platformCount = 0;
        platformsPassed = 0;
        SetStarIDs();
        player.MakeCharacterReady();
        movingPlatformPool.SetMovingPlatform();
        for (int i = 0; i < platformsDrawn; i++)
        {
            GameObject newPlatform = platformPool.GetItem;

            Reposition(newPlatform, platformCount);
            platformList.Add(newPlatform);

            platformCount++;
            platformsPassed++;
        }

    }

    void SetStarIDs()
    {
        starIDs[0] = currentSong.BeatFromTime(0.3f);
        starIDs[1] = currentSong.BeatFromTime(0.64f);
        starIDs[2] = currentSong.BeatFromTime(0.97f);
    }

    void IncreaseDificulty()
    {
        //platformsPassed = 0;
        lastPlatformZ += 40;
        nextPlatformIsStart = true;
    }

    bool CheckForStar()
    {
        for (int i = 0; i < 3; i++)
        {
            if (platformCount == starIDs[i])
                return true;
        }

        return false;
    }

    public void Reposition(GameObject platform, int id)
    {
        float posX = id > 3 ? Random.Range(-levelWidth, levelWidth) : 0;

        platform.transform.position = new Vector3(posX, platform.transform.position.y, lastPlatformZ);
        platform.transform.localRotation = Quaternion.Euler(new Vector3(0, /*Random.Range(0, 360)*/0, 0));

        if (platformCount <= 4)
        {
            lastPlatformZ += distanceBetweenPlatforms + 7;

        }

        else
        {
            lastPlatformZ += distanceBetweenPlatforms - hitindex;
            //Debug.Log(lastPlatformZ - platform);
        }


        if (CheckForStar())
        {
            //GameObject star = Instantiate(starPrefab, platform.transform);
        }

        if (GameManager.Instance.gameState == GameState.Gameplay && Random.Range(0, 10) > 5 && GameManager.Instance.isSpeedupActive == false)
        {
            GameObject speedUp = Instantiate(PowerUpPrefab, platform.transform);
        }

    }


    public void RemovePlatforms()
    {
        lastPlatformZ = 0;
        platformsPassed = 0;
        platformList.Clear();
        platformPool.RemoveAllPlatforms();
        movingPlatformPool.RemoveAllPlatforms();
    }
    void OnDrawGizmos()
    {
        if (currentSong == null)
            return;
        else if (currentSong.song == null)
            return;

        for (int i = 0; i < beatPerSong; i++)
        {
            Gizmos.DrawSphere(new Vector3(0, 0, distanceBetweenPlatforms * i), 0.5f);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////// PRODUCER /////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public Transform GetNextPlatformProducer
    {

        get
        {
            //hitindex = 100;
            //getcount = countlist[player.platformHitCount];

            if (count % Random.Range(1, 6) == 0)
            {
                hitindex = Random.Range(-3, -6);
                count++;
            }
            else
            {
                hitindex = Random.Range(0, 3);
                count++;
                //Debug.Log(hitindex);

            }


            GameObject platform = platformList[2];
            if (platformList[0].tag == "Moving")
                movingPlatformPool.ReturnItem(platformList[0]);
            else
                platformPool.ReturnItem(platformList[0]);
            platformList.RemoveAt(0);

            GameObject newPlatform = null;
            if (Random.Range(0f, 1f) <= movingPlatformChance && platformCount != beatPerSong - 1)
                newPlatform = movingPlatformPool.GetItem;
            else
                newPlatform = platformPool.GetItem;

            newPlatform.GetComponent<Animator>().SetTrigger("Spawn");
            if (check == 1)
            {
                //nextPlatformIsStart = false;
                newPlatform.name = "Start";
                RepositionProducer(WinPlace, platformCount);
                //WinPlace.transform.position = newPlatform.transform.position;
                platformList.Add(WinPlace);

                Debug.Log("winner");
                //return WinPlace.transform;
                return platform.transform;
            }

            RepositionProducer(newPlatform, platformCount);
            platformList.Add(newPlatform);
            platformCount++;
            platformsPassed++;

            if (platformsPassed >= beatPerSong)
            {
                IncreaseDificulty();

            }
            //hitindex = 10;

            return platform.transform;
        }
    }

    public void OpenFileAndPlaySongWithGameStart(string filename)
    {
        string filePath = Path.Combine(Application.persistentDataPath, filename);

        if (File.Exists(filePath))
        {
            // Read the JSON file as a string
            string json = File.ReadAllText(filePath);

            // Deserialize the JSON string into an object
            FileName data = JsonUtility.FromJson<FileName>(json);
            myDataList.dataSave.Clear();
            for (int i = 0; i < data.dataSave.Count; i++)
            {
                myDataList.dataSave.Add((float)data.dataSave[i]);
            }
            string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(filename);
            Debug.LogError("Filename" + fileNameWithoutExtension);
            for (int i = 0; i < GameManager.Instance.SongLists.Count; i++)
            {
                if (GameManager.Instance.SongLists[i].name == fileNameWithoutExtension)
                {
                    currentSong = GameManager.Instance.SongLists[i];
                    Debug.LogError(currentSong);
                }
            }
            StartCoroutine(StartWithSongProducer(this.gameObject, UIManager.Instance.menuUI));
        }
        else
        {
            Debug.LogError("File not found at path: " + filePath);
        }
    }

    public string[] GetFileNamesInPersistentDataPath()
    {
        // Get the persistent data path
        string persistentDataPath = Application.persistentDataPath;

        // Get file names in the persistent data path
        string[] fileNames = Directory.GetFiles(persistentDataPath);

        // Return only the file names without the path
        for (int i = 0; i < fileNames.Length; i++)
        {
            fileNames[i] = Path.GetFileName(fileNames[i]);
        }

        return fileNames;
    }

    public void OpenFolder()
    {
        // Get the persistent data path
        string folderPath = Application.persistentDataPath;

        // Open the folder in the file explorer
        Application.OpenURL("file://" + folderPath);
    }

    public static char GetLastDigit(string input)
    {
        // Iterate over the characters of the input string from the end
        for (int i = input.Length - 1; i >= 0; i--)
        {
            // Check if the current character is a digit
            if (char.IsDigit(input[i]))
            {
                // Return the last digit found
                return input[i];
            }
        }

        // Return '\0' (null character) if no digit is found
        return '\0';
    }

    // Name of the JSON file to be saved
    // Call this method to save the float list to JSON
    public void SaveFloatList()
    {
        // Convert the float list to JSON string
        string jsonString = JsonUtility.ToJson(myDataList);
        fileName = currentSong.name + ".json";
        // Get the persistent data path
        string filePath = Path.Combine(Application.persistentDataPath, fileName);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        // Write the JSON string to the file
        File.WriteAllText(filePath, jsonString);

        Debug.Log("Float list saved to: " + filePath);
    }

    public IEnumerator StartWithSongProducer(GameObject go1, GameObject go2)
    {
        yield return new WaitForSeconds(1);

        GameManager.Instance.producerManagerPopup.SetActive(false);
        UIManager.Instance.gameUI.SetActive(true);
        Debug.Log("wait is over");
        platformCount = 0;
        platformsPassed = 0;
        //SetStarIDs();
        player.MakeCharacterReady();
        movingPlatformPool.SetMovingPlatform();

        for (int i = 0; i < platformsDrawn; i++)
        {
            GameObject newPlatform = platformPool.GetItem;
            //GameObject newPlatformBox = platformPool.GetItem;

            RepositionProducer(newPlatform, platformCount);
            //Reposition(newPlatformBox, platformCount);

            platformList.Add(newPlatform);
            //platformListBox.Add(newPlatformBox);

            Debug.Log(newPlatform);

            platformCount++;
            platformsPassed++;
        }

        //for (int i = 0; i < myDataList.dataSave.Count-1; i++)
        //{
        //    GameObject myplateform = Instantiate(platformPool.GetItem);
        //    myplateform.transform.position = new Vector3(0, myplateform.transform.position.y, (float)myDataList.dataSave[i].time*2);
        //}
        // go1.SetActive(false);
        go2.SetActive(false);
    }
    public void RepositionProducer(GameObject platform, int id)
    {
        float posX = id > 3 ? Random.Range(-levelWidth, levelWidth) : 0;
        float temp1 = (float)myDataList.dataSave[0] * Distance;
        //Debug.LogError("temp after" + temp1);

        lastPlatformZ = temp1;
        platform.transform.position = new Vector3(posX, platform.transform.position.y, lastPlatformZ);
        platform.transform.localRotation = Quaternion.Euler(new Vector3(0, /*Random.Range(0, 360)*/0, 0));

        if (platformCount <= 4)
        {

            //lastPlatformZ += distanceBetweenPlatforms + 7;
            float temp = (float)myDataList.dataSave[0] * Distance;

            lastPlatformZ = temp;
            myDataList.dataSave.RemoveAt(0);
            Debug.Log("LAST PLATFORM Z - 1 :-" + lastPlatformZ);
        }
        else
        {
            float temp = (float)myDataList.dataSave[0] * Distance;

            lastPlatformZ = temp;
            myDataList.dataSave.RemoveAt(0);
            Debug.Log("LAST PLATFORM Z - 2 :-" + lastPlatformZ);
            //lastPlatformZ += distanceBetweenPlatforms - hitindex;
        }

        if (CheckForStar())
        {
            GameObject star = Instantiate(starPrefab, platform.transform);
        }


    }
    [System.Serializable]
    public class FileName
    {
        public List<double> dataSave;
    }

    [System.Serializable]
    public class DataList
    {
        // public List<DataSave> dataSave=new List<DataSave>();
        public List<float> dataSave = new List<float>();
    }
}