using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
public class ShowMSG : MonoBehaviour
{
    // Start is called before the first frame update
    public GameObject message;
    public GameObject answer;
    public AudioSource AudioSource;
    public AudioClip audioClip;
 
    public void showAnswer()
    {
        Invoke("msg",2.0f);
    }
    private void msg()
    {
        
        if (message.activeSelf == true)
        {
            answer.SetActive(true);
            AudioSource.PlayOneShot(audioClip);
        }
    }
    public void restart()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }

}
