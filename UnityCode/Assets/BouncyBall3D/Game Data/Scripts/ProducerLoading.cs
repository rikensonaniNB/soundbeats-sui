using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class ProducerLoading : MonoBehaviour
{
    public GameObject loaderImage;
    void Start()
    {
        StartCoroutine(LoadProducerScene());
    }

    IEnumerator LoadProducerScene()
    {
        yield return new WaitForSeconds(1f);
        SceneManager.LoadScene(1);
    }
    private void Update()
    {
        loaderImage.transform.Rotate(Vector3.forward * -100 * Time.deltaTime);
    }
}
