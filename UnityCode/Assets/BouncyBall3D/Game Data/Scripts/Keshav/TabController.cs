using UnityEngine;
using UnityEngine.UI;

public class TabController : MonoBehaviour
{
    public Toggle Option1;
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
            GetLeaderboard.Instance.GetLeaderboardAPI();
        }
    }

    public void BeatMapData(bool value)
    {
        if (value)
        {
            GetLeaderboard.Instance.GetBeatmapLeaderboardAPI();
        }
    }

}
