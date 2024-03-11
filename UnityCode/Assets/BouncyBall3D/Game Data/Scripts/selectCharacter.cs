using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class selectCharacter : MonoBehaviour
{
    public GameObject[] buttons;
    public GameObject NoReawrded;

    public List<string> names ;
    // Start is called before the first frame update
    void Start()
    {
        //PlayerPrefs.DeleteKey("names");  
        names = PlayerPrefsExtra.GetList<string>("names", new List<string>());
        for (int i = 0; i <= names.Count-1; i++)
        {
            for (int j = 0; j <= buttons.Length - 1; j++)
            {
                if (names[i] == buttons[j].name)
                {
                    buttons[j].transform.GetChild(0).gameObject.SetActive(false);

                }
            }
        }
        

    }
    private void Update()
    {
        //if (Advertisements.Instance.IsRewardVideoAvailable())
        //{
        //    for (int i = 0; i <= buttons.Length - 1; i++)
        //    {

        //        buttons[i].transform.GetChild(0).gameObject.GetComponent<Button>().interactable = false;

        //    }
        //}
    }
    void videocomplet(bool complet) { }
    public void unlockPlayer(string name)
    {
        if (false/*Advertisements.Instance.IsRewardVideoAvailable()*/)
        {
           // Advertisements.Instance.ShowRewardedVideo(videocomplet);
            for (int i = 0; i <= buttons.Length - 1; i++)
            {
                if (name == buttons[i].name)
                    buttons[i].transform.GetChild(0).gameObject.SetActive(false);
            }
            PlayerPrefs.SetString(name, name);
            names.Add(name);
            PlayerPrefsExtra.SetList("names", names);
        }
        else
        {
            NoReawrded.SetActive(true);
        }
       

    }
}
