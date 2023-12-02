using UnityEngine;
using UnityEngine.UI;

public class TabController : MonoBehaviour
{
    public Button buttonOption1;
    public Button buttonOption2;
    public Color activeTabColor = Color.green;
    public Color inactiveTabColor = Color.white;

    // Add any variables for data you want to reset

    private void OnEnable()
    {
        OnTabButtonClick(true);
    }

    private void Start()
    {
        buttonOption1.onClick.AddListener(() =>
        {
            OnTabButtonClick(true);
        });

        buttonOption2.onClick.AddListener(() =>
        {
            OnTabButtonClick(false);
        });
    }

    void OnTabButtonClick(bool isOption1)
    {
        // Reset data here based on the selected tab
        if (isOption1)
        {
            GetLeaderboard._instance.GetLeaderboardAPI();
        }
        else
        {
            GetLeaderboard._instance.GetLeaderboardAPI("?sprint=current");
        }

        // Set tab colors based on the selected tab
        SetTabColors(isOption1, !isOption1);
    }

    void SetTabColors(bool option1Active, bool option2Active)
    {
        // Set button colors based on active/inactive state
        buttonOption1.image.color = option1Active ? activeTabColor : inactiveTabColor;
        buttonOption2.image.color = option2Active ? activeTabColor : inactiveTabColor;
    }
}
