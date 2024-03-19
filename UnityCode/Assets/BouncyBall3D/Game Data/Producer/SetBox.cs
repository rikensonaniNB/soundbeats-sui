using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SetBox : MonoBehaviour
{
    public List<GameObject> boxs;
    public List<Vector3> boxPos;
    public float boxZPos;
    public float cameraZPos;
    public float lastPos;
    public bool camerabool;
    public GameObject whiteBallObj;
    public static SetBox instance;
    private void Awake()
    {
        instance = this;
    }

    public void SetBoxUseList()
    {
        int randomBox = Random.Range(0, boxs.Count);

        int randomboxPos = Random.Range(0, boxPos.Count);

        Vector3 setBoxPos = boxPos[randomboxPos];
        setBoxPos.z = boxZPos;

        Instantiate(boxs[randomBox], setBoxPos, Quaternion.identity, gameObject.transform);

    }
    private void Start()
    {
        for (int i = 0; i < 500; i++)
        {
            Instantiate(whiteBallObj, new Vector3(0, -1, i * 10), Quaternion.identity, gameObject.transform);
        }
    }
    private void Update()
    {

        if (camerabool)
        {
            GameManager.instance.producerCamera.transform.position = new Vector3(25, 8.5f, cameraZPos * LevelGenerator.Instance.Distance - 20);
        }
    }
}
