using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SetBox : MonoBehaviour
{
    public List<GameObject> boxs;
    public List<Vector3> boxPos;
    public float boxZPos;
    public static SetBox instance;
    private void Awake()
    {
        if (instance == null)
        {
            instance = this;
        }
    }

    public void SetBoxUseList()
    {
        int randomBox = Random.Range(0, boxs.Count);

        int randomboxPos = Random.Range(0, boxPos.Count);

        Vector3 setBoxPos = boxPos[randomboxPos];
        setBoxPos.z = boxZPos;

        Instantiate(boxs[randomBox], setBoxPos, Quaternion.identity, gameObject.transform);
    }


}
