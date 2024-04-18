using UnityEngine;
using UnityEngine.UI;

public class TabController : MonoBehaviour
{
    public GameObject playerDataObj;
    public Toggle Option1;
    public GameObject beatmapDataObj;
    public Toggle Option2;


    // Add any variables for data you want to reset

    private void OnEnable()
    {
        Option1.isOn = true;
        playerData(Option1);
        Option2.isOn = false;
    }

    public void playerData(bool value)
    {
        if (value)
        {
            playerDataObj.SetActive(true);
            beatmapDataObj.SetActive(false);
            GetLeaderboard.Instance.GetLeaderboardAPI();
        }
    }

    public void BeatMapData(bool value)
    {
        if (value)
        {
            beatmapDataObj.SetActive(true);
            playerDataObj.SetActive(false);
            GetLeaderboard.Instance.GetBeatmapLeaderboardAPI();
        }
    }

}
