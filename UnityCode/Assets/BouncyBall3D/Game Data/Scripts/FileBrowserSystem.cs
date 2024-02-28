using System.Collections;
using System.Collections.Generic;
using UnityEngine;



public class FileBrowserSystem : MonoBehaviour
{
    public AudioSource audioSource;
    public AudioClip audioClip;
    public GameObject customSongHolder;
    private float startTime;
    private string[] extensions = { "mp3", "wav" };
    public string path;



    public static FileBrowserSystem instance;

    private void Awake()
    {
        if (instance == null)
            instance = this;
    }
    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }

    public void OpenSingleFile()
    {
        ////Example.instance.OpenFileDialogButtonOnClickHandler();
        //WebGLFileBrowser.OpenFilePanelWithFilters(".mp3,.wave");
        //string path = FileBrowserWebGL.OpenFiles("Open file", "", "",  params string[] extensions);

        //string path = FileBrowser.Instance.OpenSingleFile("txt");
       
        Debug.Log("path=" + path);
        StartCoroutine(LoadAudio(path));
        

        //Debug.Log($"OpenSingleFile: '{path}'", this);
    }
    private IEnumerator LoadAudio(string soundPath)
    {
        yield return new WaitForSeconds(1f);
        WWW request = GetAudioFromFile(soundPath);
        yield return request;
        audioClip = request.GetAudioClip();
        audioClip.name = name;
        audioSource.clip = audioClip;
        customSongHolder.GetComponent<SongHolder>().song.song = audioClip;
        AudioVisualizeManager.visualizeManager.audioSource.clip = audioClip;

    }
    private WWW GetAudioFromFile(string path)
    {
        string audioToLoad = path;
        WWW request = new WWW(audioToLoad);
        return request;
    }
}

