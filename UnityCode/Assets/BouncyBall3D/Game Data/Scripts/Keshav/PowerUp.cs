using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PowerUp : MonoBehaviour
{
    [SerializeField] GameObject collectedEffect;

    public static float powerUpTimer = 3f;

    private void OnTriggerEnter(Collider other)
    {
        if (other.tag == "Player")
        {
            if (GameManager.Instance.gameState == GameState.Gameplay && !GameManager.Instance.isSpeedupActive)
            {
                Destroy(Instantiate(collectedEffect, transform.position, Quaternion.Euler(-90, 0, 0)), 1f);
                Debug.Log("Powerup collected");
                GameManager.Instance.IncreaseGameSpeedForNSec();
                Destroy(gameObject);
            }
        }
    }
}
