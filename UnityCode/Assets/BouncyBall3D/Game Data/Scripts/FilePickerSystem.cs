//using Newtonsoft.Json;
//using RhythmTool;
//using RhythmTool.Examples;
//using SFB;
//using System;
//using System.Collections;
//using System.Collections.Generic;
//using System.IO;
//using System.Net;
//using TMPro;
//using UnityEngine;
//using UnityEngine.UI;

//namespace RhythmTool
//{

//    public class FilePickerSystem : MonoBehaviour
//    {
//        public string demo;

//        private static string jsonFileType;
//        private string songFileType;
//        public AudioSource audioSource;
//        public AudioClip audioClip;
//        public GameObject customSongHolder;

//        public SongJsonDataSave songData = new SongJsonDataSave();
//        public string jsonSavePath;

//        public GameObject playBtn;
//        public GameObject pauseBtn;
//        public GameObject muteBtn;
//        public GameObject UnMuteBtn;

//        int seconds = 0;


//        //public GameObject soundManager;

//        public Slider progressBar;



//        public List<GameObject> soundSeconds;

//        public GameObject spawn;
//        public TMP_InputField inputField;

//        public TextMeshProUGUI timerText;
//        public float requiredStrength;
//        private float startTime;
//        public bool isRunning = false;
//        public int intValue;


        

//        public static FilePickerSystem instance;
//        private void Awake()
//        {
//            if (instance == null)
//            {
//                instance = this;
//            }
//            //line.GetComponentInChildren<TextMeshProUGUI>().text = seconds.ToString();
//        }



//        void Start()
//        {
//            jsonFileType = NativeFilePicker.ConvertExtensionToFileType("txt");
//            Debug.Log("json's MIME/UTI is: " + jsonFileType);

//            songFileType = NativeFilePicker.ConvertExtensionToFileType("mp3");
//            Debug.Log("song's MIME/UTI is: " + songFileType);

//            //playBtn.SetActive(true);
//            //pauseBtn.SetActive(false);

//            //UnMuteBtn.SetActive(true);
//            //muteBtn.SetActive(false);

//        }

//        private void Update()
//        {
//            //progressBar.maxValue = audioClip.length;

//            //progressBar.value = audioSource.time;
//            //spawnLines = audioClip.length;
//            //requiredStrength = float.Parse(inputField.text.ToString());
//            //if (isRunning)
//            //{
//            //    startTime -= Time.deltaTime;
//            //    intValue = Mathf.FloorToInt(startTime);
//            //    timerText.text = intValue.ToString();
//            //}
//        }


//        ///////////////////////////////// Read audio file from filepath /////////////////////////////////
//        private IEnumerator LoadAudio(string soundPath)
//        {
//            WWW request = GetAudioFromFile(soundPath);
//            yield return request;
//            audioClip = request.GetAudioClip();
//            audioClip.name = name;
//            audioSource.clip = audioClip;
//            Debug.Log("audio=" + audioClip.name);
//            customSongHolder.GetComponent<SongHolder>().song.song = audioClip;
//            Debug.Log("load");

//            /////////// RhythmPlayer.Instance.rhythmData = analyzer.Analyze(audioClip);


//            //audioSource.Play();


//            //SongJsonSave songItem = new SongJsonSave();
//            //songItem.time = Time.time;
//            //songData.songDataSave.Add(songItem);

//            //var songTemp = JsonConvert.SerializeObject(songData);
//            //demo = JsonConvert.SerializeObject(songData);
//            //File.WriteAllText(jsonSavePath, songTemp);
//            //Debug.Log(songTemp);
//        }

//        private WWW GetAudioFromFile(string path)
//        {
//            string audioToLoad = path;
//            WWW request = new WWW(audioToLoad);
//            return request;
//        }
//        /////////////////////////////////////////////////////////////////////////////////////////////////



//        ///////////////////////////////// NEW BUTTON /////////////////////////////////
//        public void NewBtn()
//        {
//            audioSource.clip = null;

//        }
//        /////////////////////////////////////////////////////////////////////////////////////////////////



//        ///////////////////////////////// IMPORT BUTTON /////////////////////////////////
//        public void ImportBtn()
//        {
//            if (NativeFilePicker.IsFilePickerBusy())
//                return;
//            {

//                NativeFilePicker.Permission permission = NativeFilePicker.PickFile((path) =>
//                {
//                    if (path == null)
//                        Debug.Log("Operation cancelled");
//                    else
//                    {
//                        Debug.Log("Picked file: " + path);

//                        StartCoroutine(LoadAudio(path));
//                        //StartCoroutine(Spawn());
//                        audioClip = audioSource.clip;


//                        startTime = audioClip.length;
//                        Debug.Log("startTime= " + startTime);
//                    }
//                }, new string[] { songFileType });

//                Debug.Log("Permission result: " + permission);

//            }
//        }
//        /////////////////////////////////////////////////////////////////////////////////////////////////



//        ///////////////////////////////// OPEN BUTTON /////////////////////////////////
//        public void OpenBtn()
//        {
//            if (NativeFilePicker.IsFilePickerBusy())
//                return;
//            {
//                NativeFilePicker.Permission permission = NativeFilePicker.PickFile((path) =>
//                {
//                    if (path == null)
//                        Debug.Log("Operation cancelled");
//                    else
//                    {
//                        Debug.Log("Picked file: " + path);
//                        if (File.Exists(path))
//                        {
//                            string txtFileContents = File.ReadAllText(path);
//                            Debug.Log(txtFileContents);
//                        }
//                    }
//                }, new string[] { jsonFileType });

//                Debug.Log("Permission result: " + permission);

//            }
//        }
//        /////////////////////////////////////////////////////////////////////////////////////////////////



//        ///////////////////////////////// SAVE BUTTON /////////////////////////////////

//#if UNITY_WEBGL && !UNITY_EDITOR
//    // WebGL
//    [DllImport("__Internal")]
//    private static extern void DownloadFile(string gameObjectName, string methodName, string filename, byte[] byteArray, int byteArraySize);

//    public void OnClickSave() {
//        var bytes = Encoding.UTF8.GetBytes(textMeshPro.text);
//        DownloadFile(gameObject.name, "OnFileDownload", "model.obj", bytes, bytes.Length);
//    }

//    // Called from browser
//    public void OnFileDownload() { }
//#else

//        // Standalone platforms & editor
//        public void SaveBtn()
//        {
//            string path = StandaloneFileBrowser.SaveFilePanel("Save File", "", "model", "txt");
//            if (!string.IsNullOrEmpty(path))
//            {
//                File.WriteAllText(path, demo);
//            }
//        }
//#endif

//        /////////////////////////////////////////////////////////////////////////////////////////////////



//        ///////////////////////////////// EXPORT TO JSON  BUTTON /////////////////////////////////
//        public void ExportToJson()
//        {
//            SongJsonSave songItem = new SongJsonSave();
//            songItem.time = Time.time;
//            //songData.songDataSave.Add(songItem);

//            var songTemp = JsonConvert.SerializeObject(songData);
//            demo = JsonConvert.SerializeObject(songData);
//            File.WriteAllText(jsonSavePath, songTemp);
//            Debug.Log(songTemp);
//        }
//        /////////////////////////////////////////////////////////////////////////////////////////////////



//        ///////////////////////////////// PLAY /////////////////////////////////
//        public void Play()
//        {
//            if (requiredStrength > 0.99f && requiredStrength < 5.9f)
//            {
//                audioSource.Play();
//                startTime = audioClip.length;
//                isRunning = true;
//            }
//        }
//        /////////////////////////////////////////////////////////////////////////////////////////////////



//        ///////////////////////////////// PAUSE /////////////////////////////////
//        public void Pause()
//        {
//            audioSource.Pause();
//            isRunning = false;
//        }
//        /////////////////////////////////////////////////////////////////////////////////////////////////



//        ///////////////////////////////// MUTE /////////////////////////////////
//        public void Mute()
//        {
//            audioSource.mute = false;
//        }
//        /////////////////////////////////////////////////////////////////////////////////////////////////



//        ///////////////////////////////// UNMUTE /////////////////////////////////
//        public void Unmute()
//        {
//            audioSource.mute = true;
//        }
//        /////////////////////////////////////////////////////////////////////////////////////////////////



//        public void LineSpawn(GameObject spawn)
//        {


//        }


//    }

//    [System.Serializable]
//    public class SongJsonDataSave
//    {
//        public List<SongJsonSave> songDataSave = new List<SongJsonSave>();
//    }

//    [System.Serializable]
//    public class SongJsonSave
//    {
//        public float time;
//        //public Vector3 boxPosition;
//        //public Vector3 boxRotation;
//    }
//}

