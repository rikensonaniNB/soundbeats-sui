using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class ProducerManager : MonoBehaviour
{
    public static ProducerManager Instance;
    private void Awake()
    {
        Instance = this;
    }

    public Camera producerCamera;
    public GameObject popUp;
    public GameObject pauseButton;
    public GameObject producerQuitScreen;
    public GameObject producerHoldscreen;
    public GameObject congratsBeatPopup;
    public GameObject songTime;

    [Header("Complexity")]
    [Space]
    public Slider complexitySlider;
    public Text complexityValueTxt;
    public float complexityValue;

    [Header("RefreshTime")]
    [Space]
    public Slider RefreshTimeSlider;
    public Text RefreshTimeValueTxt;
    public float RefreshTimeValue;

    [Header("Output Multiplier")]
    [Space]
    public Slider PushMultiplierPartOneSlider;
    public Text PushMultiplierPartOneValueTxt;
    public float PushMultiplierPartOneValue;
    [Space]
    public Slider PushMultiplierPartTwoSlider;
    public Text PushMultiplierPartTwoValueTxt;
    public float PushMultiplierPartTwoValue;

    [Header("MinOutput_AND_MaxOutput")]
    [Space]
    public Slider MinOutputSlider;
    public Text MinOutputValueTxt;
    public float MinOutputValue;
    [Space]
    public Slider MaxOutputSlider;
    public Text MaxOutputValueTxt;
    public float MaxOutputValue;

    public GameObject Generate;
    public GameObject StartAgain;

    private void Start()
    {
        ///// ThresoldSlider /////
        complexitySlider.value = 0.35f;
        complexityValue = complexitySlider.value;
        complexitySlider.minValue = 0.1f;
        complexitySlider.maxValue = 0.8f;
        complexityValueTxt.text = complexitySlider.value.ToString();

        ///// RefreshTimeSlider /////
        RefreshTimeSlider.value = 0.1f;
        RefreshTimeValue = RefreshTimeSlider.value;
        RefreshTimeSlider.minValue = 0.01f;
        RefreshTimeSlider.maxValue = 0.1f;
        RefreshTimeValueTxt.text = RefreshTimeSlider.value.ToString();
        AudioVisualizeManager.instance.refreshTime = RefreshTimeValue;

        ///// Output_Multiplier /////
        PushMultiplierPartOneSlider.value = 0f;
        PushMultiplierPartOneValue = PushMultiplierPartOneSlider.value;
        PushMultiplierPartOneSlider.minValue = 0f;
        PushMultiplierPartOneSlider.maxValue = 1f;
        PushMultiplierPartOneValueTxt.text = PushMultiplierPartOneSlider.value.ToString();
        AudioVisualizeManager.instance.PushMultiplierPartOne = PushMultiplierPartOneValue;
        ///////////////////////////////////////////
        PushMultiplierPartTwoSlider.value = 1f;
        PushMultiplierPartTwoValue = PushMultiplierPartTwoSlider.value;
        PushMultiplierPartTwoSlider.minValue = 0f;
        PushMultiplierPartTwoSlider.maxValue = 100f;
        PushMultiplierPartTwoValueTxt.text = PushMultiplierPartTwoSlider.value.ToString();
        AudioVisualizeManager.instance.PushMultiplierPartTwo = PushMultiplierPartTwoValue;

        /////// MinOutput_AND_MaxOutput /////
        MinOutputSlider.value = 0f;
        MinOutputValue = MinOutputSlider.value;
        AudioVisualizeManager.instance.minOutput = MinOutputValue;
        //MinOutputSlider.minValue = -4f;
        //MinOutputSlider.maxValue = 4f;
        ///////////////////////////////////
        MaxOutputSlider.value = 1f;
        MaxOutputValue = MaxOutputSlider.value;
        AudioVisualizeManager.instance.maxOutput = MaxOutputValue;
        //MaxOutputSlider.minValue = -4f;
        //MaxOutputSlider.maxValue = 4f;
    }
    public void ResetPopManager()
    {
        complexitySlider.value = 0.35f;
        Debug.Log($"<color=blue> Threshold_Slider_Value </color>" + complexitySlider.value);

        RefreshTimeSlider.value = 0.30f;
        Debug.Log($"<color=blue> Refresh_Time_Slider_Value </color>" + RefreshTimeSlider.value);
        AudioVisualizeManager.instance.refreshTime = RefreshTimeValue;

        PushMultiplierPartOneSlider.value = 0f;
        Debug.Log($"<color=blue> Push_Multiplier_Past_One_Slider_Value </color>" + PushMultiplierPartOneSlider.value);
        AudioVisualizeManager.instance.PushMultiplierPartOne = PushMultiplierPartOneValue;

        PushMultiplierPartTwoSlider.value = 1f;
        Debug.Log($"<color=blue> Push_Multiplier_Past_Two_Slider_Value </color>" + PushMultiplierPartTwoSlider.value);
        AudioVisualizeManager.instance.PushMultiplierPartTwo = PushMultiplierPartTwoValue;

        //MinOutputSlider.value = 1f;
        //Debug.Log($"<color=blue> Min_Output_Slider_Value </color>" + MinOutputSlider.value);
        //MaxOutputSlider.value = 1f;
        //Debug.Log($"<color=blue> max_Output_Slider_Value </color>" + MaxOutputSlider.value);
    }

    public void OnvlaueChange()
    {
        ///// Thresold /////
        complexityValue = complexitySlider.value;
        complexityValueTxt.text = complexitySlider.value.ToString();

        ///// RefreshTime /////
        RefreshTimeValue = RefreshTimeSlider.value;
        AudioVisualizeManager.instance.refreshTime = RefreshTimeValue;
        RefreshTimeValueTxt.text = RefreshTimeSlider.value.ToString();

        ///// Output_Multiplier /////
        PushMultiplierPartOneValue = PushMultiplierPartOneSlider.value;
        AudioVisualizeManager.instance.PushMultiplierPartOne = PushMultiplierPartOneValue;
        PushMultiplierPartOneValueTxt.text = PushMultiplierPartOneSlider.value.ToString();
        ////////////////////////////
        PushMultiplierPartTwoValue = PushMultiplierPartTwoSlider.value;
        AudioVisualizeManager.instance.PushMultiplierPartTwo = PushMultiplierPartTwoValue;
        PushMultiplierPartTwoValueTxt.text = PushMultiplierPartTwoSlider.value.ToString();

        ///// MinOutput_AND_MaxOutput /////
        //MinOutputValue = MinOutputSlider.value;
        //MinOutputValueTxt.text = MinOutputSlider.value.ToString();
        ///////////////////////////
        //MaxOutputValue = MaxOutputSlider.value;
        //MaxOutputValueTxt.text = MaxOutputSlider.value.ToString();


        Debug.Log($"<color=yellow> ThresoldValue :: </color>" + complexityValue);
        Debug.Log($"<color=yellow> RefreshTimeValue :: </color>" + RefreshTimeValue);
        Debug.Log($"<color=yellow> PushMultiplierPartOneValue :: </color>" + PushMultiplierPartOneValue);
        Debug.Log($"<color=yellow> PushMultiplierPartTwoValue :: </color>" + PushMultiplierPartTwoValue);

        //Debug.Log($"<color=yellow> MinOutputValue :: </color>" + MinOutputValue);
        //Debug.Log($"<color=yellow> MaxOutputValue :: </color>" + MaxOutputValue);
    }


    public void OnCloseThresoldpanal()
    {
        AudioVisualizeManager.instance.audioSource.clip = LevelGenerator.Instance.currentSong.song;
        if (GameManager.instance.songPlaying == true)
        {
            producerHoldscreen.SetActive(true);
        }
        else
        {
            GameManager.instance.PlaySong();
            //Player.instance.ResetPlayer();
            SetBox.instance.SpawnWhiteBalls();
            songTime.SetActive(true);
        }
    }

    public void closeBtnProducer()
    {
        Time.timeScale = 0;
        pauseButton.SetActive(false);
        producerQuitScreen.SetActive(true);
    }
    public void ProducerQuitNo()
    {
        Time.timeScale = 1;
        GameManager.instance.gameState = GameState.Gameplay;
        pauseButton.SetActive(true);
        producerQuitScreen.SetActive(false);
    }
    public void OnCloseProducer()
    {
        SceneManager.LoadScene("HomeScene");
        LevelGenerator.Instance.currentSong = null;
        LevelGenerator.Instance.myDataList.dataSave.Clear();
        foreach (Transform t in SetBox.instance.whiteBallParent.transform)
        {
            Destroy(t.gameObject);
        }
        foreach (Transform allboxs in SetBox.instance.gameObject.transform)
        {
            Destroy(allboxs.gameObject);
        }
        Time.timeScale = 1;
        GameManager.instance.gameState = GameState.Menu;
        AudioVisualizeManager.instance.audioSource.clip = null;
        LevelGenerator.Instance.RemovePlatforms();
        AudioVisualizeManager.instance.audioSource.enabled = false;
        Destroy(GameManager.instance.gameObject);
        Destroy(LevelGenerator.Instance.gameObject);
        Destroy(AudioVisualizeManager.instance.gameObject);
    }

    public void StartAgainBtn()
    {
        GameManager.instance.RegenerateBtn();
    }


}
