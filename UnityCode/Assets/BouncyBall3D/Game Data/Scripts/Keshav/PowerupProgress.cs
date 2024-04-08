using UnityEngine;
using UnityEngine.UI;

public class PowerupProgress : MonoBehaviour
{
    public Slider progressBar;
    private float timer;

    private void OnEnable()
    {
        StartTimer();
    }

    private void Update()
    {
        if (GameManager.instance.isSpeedupActive)
        {
            if (GameManager.instance.gameState == GameState.Gameplay)
            {
                timer -= Time.deltaTime;
                progressBar.value = timer / PowerUp.powerUpTimer;

                if (timer <= 0f)
                {
                    timer = 0f;
                    StopTimer();
                }
            }
            else
            {
                StopTimer();
            }
        }
    }

    private void StartTimer()
    {
        timer = PowerUp.powerUpTimer;
        GameManager.instance.isSpeedupActive = true;
    }

    private void StopTimer()
    {
        GameManager.instance.resetGameSpeedToPrevious();
        GameManager.instance.isSpeedupActive = false;
        gameObject.SetActive(false);
    }
}