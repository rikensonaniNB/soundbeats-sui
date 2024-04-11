using UnityEngine;
using UnityEngine.UI;

public class TabController : MonoBehaviour
{
    public Toggle Option1;
    public Toggle Option2;

    // Add any variables for data you want to reset

    private void OnEnable()
    {
        Option2.isOn = true;
    }

    public void playerData(bool value)
    {
        if (value)
        {
            //GetLeaderboard._instance.GetLeaderboardAPI();
        }
    }

    public void sprintData(bool value)
    {
        if (value)
        {
            //GetLeaderboard._instance.GetLeaderboardAPI("?sprint=current");
        }
    }

    public void BeatMapData(bool value)
    {
        if (value)
        {

        }
    }

}
