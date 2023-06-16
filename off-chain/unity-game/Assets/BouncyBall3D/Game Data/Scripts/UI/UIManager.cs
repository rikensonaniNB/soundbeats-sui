using UnityEngine;
using UnityEngine.UI;

public class UIManager : Singleton<UIManager>
{
   // public GameObject HUDPanel;

    [SerializeField] GameObject menuUI;
    [SerializeField] GameObject gameUI;
 
   // [SerializeField] Text bestScoreText;
    //[SerializeField] Text ScoreText;
    public void CloseMenu()
    {
        menuUI.SetActive(false);
        gameUI.SetActive(true);
    }

    public void ShowMainMenu()
    {
        menuUI.SetActive(true);
        gameUI.SetActive(false);
    }

    public void ShowNFTWallet()
    {
        menuUI.SetActive(true);
        gameUI.SetActive(false);
        menuUI.GetComponent<UIController>().ShowNFTWallet();
    }
    public void ShowPlayerSelection()
    {
        Debug.Log("Me here");
        menuUI.SetActive(true);
        gameUI.SetActive(false);
        menuUI.GetComponent<UIController>().ShowPlayerSelectionScreen();
    }
    private void OnEnable()
    {
        //bestScoreText.text = PlayerPrefs.GetInt("bestScore", 0).ToString();
       // ScoreText.text = PlayerPrefs.GetInt("Score", 0).ToString();
    }

    public void ShowHUD(bool value)
    {
       // HUDPanel.SetActive(value);
    }
}
