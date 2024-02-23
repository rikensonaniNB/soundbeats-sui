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
        if (GameManager.Instance.isSpeedupActive)
        {
            if (GameManager.Instance.gameState == GameState.Gameplay)
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
        GameManager.Instance.isSpeedupActive = true;
    }

    private void StopTimer()
    {
        GameManager.Instance.resetGameSpeedToPrevious();
        GameManager.Instance.isSpeedupActive = false;
        gameObject.SetActive(false);
    }
}