using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class ProducerLoading : MonoBehaviour
{
    void Start()
    {
        Debug.Log("ProducerLoading");
        SceneManager.LoadSceneAsync(SceneManager.GetActiveScene().buildIndex - 3);

    }
}
