using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class PlayingLoading : MonoBehaviour
{
    public GameObject loaderImage;
    void Start()
    {
        StartCoroutine(loadPlayingScene());
    }
    IEnumerator loadPlayingScene()
    {
        yield return new WaitForSeconds(1f);
        SceneManager.LoadScene("GamePlayingScene");
    }

    private void Update()
    {
        loaderImage.transform.Rotate(Vector3.forward * -100 * Time.deltaTime);
    }
}
