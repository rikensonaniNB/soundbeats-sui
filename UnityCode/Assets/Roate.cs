using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Roate : MonoBehaviour
{
    void Update()
    {
      

        // ...also rotate around the World's Y axis
        transform.Rotate(0, Time.deltaTime*15, 0, Space.Self);
    }
}
