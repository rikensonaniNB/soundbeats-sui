using System.IO;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Newtonsoft.Json;


namespace RhythmTool.Examples
{
    public class Visualizer : MonoBehaviour
    {
        public jsonDataSave data = new jsonDataSave();
        public RhythmAnalyzer analyzer;
        public RhythmPlayer player;
        public RhythmEventProvider eventProvider;


        public GameObject[] Boxs;

        private List<Line> lines;

        private List<Chroma> chromaFeatures;

        private Note lastNote = Note.FSHARP;

        public static Visualizer instance;


        void Awake()
        {
            instance = this;

            analyzer.Initialized += OnInitialized;
            player.Reset += OnReset;

            eventProvider.Register<Beat>(OnBeat);
            eventProvider.Register<Onset>(OnOnset);
            //eventProvider.Register<Value>(OnSegment, "Segments");

            lines = new List<Line>();

            chromaFeatures = new List<Chroma>();
        }

        void Update()
        {

            if (!player.isPlaying)
                return;

            UpdateLines();
        }

        private void UpdateLines()
        {
            float time = player.time;

            //Destroy all lines with a timestamp less than the current playback time.
            List<Line> toRemove = new List<Line>();
            foreach (Line line in lines)
            {
                if (line.timestamp < time || line.timestamp > time + eventProvider.offset)
                {
                    Destroy(line.gameObject);
                    toRemove.Add(line);
                }
            }

            foreach (Line line in toRemove)
                lines.Remove(line);

            //Update all Line positions based on their timestamp and current playback time, 
            //so they will move as the song plays.
            foreach (Line line in lines)
            {
                Vector3 position = line.transform.position;

                position.x = line.timestamp - time;

                line.transform.position = position;
            }
        }

        private void OnInitialized(RhythmData rhythmData)
        {
            //Start playing the song.
            player.Play();
        }

        private void OnReset()
        {
            //Destroy all lines when playback is reset.
            foreach (Line line in lines)
                Destroy(line.gameObject);

            lines.Clear();
        }

        private void OnBeat(Beat beat)
        {
            //Instantiate a line to represent the Beat.
            //CreateLine(beat.timestamp, 0, 1, Color.black, 1, 1);

            //Update BPM text.
            float bpm = Mathf.Round(beat.bpm * 10) / 10;
        }

        private void OnOnset(Onset onset)
        {
            //Clear any previous Chroma features.
            chromaFeatures.Clear();

            //Find Chroma features that intersect the Onset's timestamp.
            player.rhythmData.GetIntersectingFeatures(chromaFeatures, onset.timestamp, onset.timestamp);

            //Instantiate a line to represent the Onset and Chroma feature.
            //foreach (Chroma chroma in chromaFeatures)
            //{
            //    //CreateLine(onset.timestamp, onset.strength / 10, 2);

            //}



            if (chromaFeatures.Count > 0)
            {
                lastNote = chromaFeatures[chromaFeatures.Count - 1].note;
                Debug.LogError("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                CreateLine(2);
            }

            //If no Chroma Feature was found, use the last known Chroma feature's note.
            //if (chromaFeatures.Count == 0)
            //{
            //    //CreateLine(onset.timestamp, -2 + (float)lastNote * .1f, .2f, Color.red, onset.strength / 10, 4);
            //}
        }

        //private void OnSegment(Value segment)
        //{
        //    //Instantiate a line to represent the segment.
        //    //CreateLine(segment.timestamp, -3, 1, Color.green, segment.value / 10, 3);

        //}

        public List<Vector3> RandomPosList = new List<Vector3>();
        public List<Vector3> RandomRotList = new List<Vector3>();

        public GameObject spawnParent;

        private void CreateLine(int numbr)
        {
            string path = "Assets/Sound.txt";

            // random Box Color
            int randomBoxs = Random.Range(0, Boxs.Length);

            // random Box Position
            int randPosInedx = Random.Range(0, RandomPosList.Count);
            Vector3 randomPos = RandomPosList[randPosInedx];

            int randRotIndex = Random.Range(0, RandomRotList.Count);
            Vector3 randomRot = RandomRotList[randRotIndex];

            if (numbr == 2)
            {
                Debug.Log("Spawn Box");
                var obj = Instantiate(Boxs[randomBoxs], randomPos, Quaternion.Euler(randomRot),spawnParent.transform);


                /////////////////////////////////////////////////////////// temparary json save class make //////////////////////////////////////////////////////

                //JsonSave jsonItem = new JsonSave();
                //jsonItem.boxPosition = obj.transform.position;
                //jsonItem.boxRotation = obj.transform.eulerAngles;
                //jsonItem.time = Time.time;
                //data.dataSave.Add(jsonItem);

                //var temp = JsonConvert.SerializeObject(data);
                //File.WriteAllText(path, temp);
                //Debug.Log(temp);
            }

        }
    }
}

public class jsonDataSave
{
    public List<JsonSave> dataSave = new List<JsonSave>();
}

public class JsonSave
{
    public float time;
    public Vector3 boxPosition;
    public Vector3 boxRotation;
}