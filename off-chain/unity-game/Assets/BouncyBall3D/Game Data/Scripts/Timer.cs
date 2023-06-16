using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
public class Timer : MonoBehaviour
{
    public float timer = 0f;
    public GameObject CallAnsweredPanel;
    // Start is called before the first frame update
    void Start()
    {
    }

    // Update is called once per frame
    void Update()
    {
        if (CallAnsweredPanel.gameObject.activeSelf == true)
        {
             timer += Time.deltaTime;

            string minutes = Mathf.Floor(timer / 60).ToString("00");
            string seconds = (timer % 60).ToString("00");

            print(string.Format("{0}:{1}", minutes, seconds));
            this.gameObject.GetComponent<Text>().text = string.Format("{0}:{1}", minutes, seconds);
        }

    }
}
