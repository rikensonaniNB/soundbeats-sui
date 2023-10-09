using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Rotate2 : MonoBehaviour
{

    // Update is called once per frame
    void Update()
    {
       
        // ...also rotate around the World's Y axis
        transform.Rotate(0, Time.deltaTime*-20, 0, Space.Self); 
    }
}
