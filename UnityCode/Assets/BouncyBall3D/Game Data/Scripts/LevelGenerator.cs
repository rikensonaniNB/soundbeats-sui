using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LevelGenerator : Singleton<LevelGenerator>
{
    #region Fields
    [HideInInspector]
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
    [SerializeField] Pool platformPool;
    [SerializeField] Pool movingPlatformPool;
    [SerializeField] GameObject starPrefab, PowerUpPrefab;
    public int hitindex = 0;
    int[] starIDs = new int[3];

    //int songLevel = 0;
    int platformCount;
#pragma warning disable 0414
    bool nextPlatformIsStart = false;
#pragma warning restore 0414
    float lastPlatformZ = 0;
    List<GameObject> platformList = new List<GameObject>();
    public List<int> countlist = new List<int>();

    //bool checkAnim = true;
    public int randomNum = 0;

    public GameObject WinPlace;
    //bool checkrun = true;
    public int count = 1;


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
    private void Start()
    {
        //for (int i = 0; i <= 300; i++)
        //{
        //    countlist.Add(Random.Range(1, 6));
        //}
    }
    public int check = 0;
    private void Update()
    {

    }

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
}