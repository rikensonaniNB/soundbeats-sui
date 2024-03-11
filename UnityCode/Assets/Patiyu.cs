using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class Patiyu : MonoBehaviour
{
    public List<GameObject> gameObjectsList;

    public positionSaveJson datta = new positionSaveJson();

    public string path;
    void Start()
    {
        // Iterate through the list of GameObjects
        foreach (GameObject obj in gameObjectsList)
        {
            //string path = "Assets/Sound.txt";


            // Access the z-position of the GameObject
            float zPosition = obj.transform.position.z;


            positionSave positionItem = new positionSave();
            positionItem.zPositons = zPosition;

            datta.dattaSave.Add(positionItem);

            var temp = JsonConvert.SerializeObject(datta);
            File.WriteAllText(path, temp);

        }
    }
}

[System.Serializable]
public class positionSaveJson
{
    public List<positionSave> dattaSave = new List<positionSave>();
}

[System.Serializable]
public class positionSave
{
    public float zPositons;
}
