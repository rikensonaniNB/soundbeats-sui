using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PowerUp : MonoBehaviour
{
    [SerializeField] GameObject collectedEffect;

    public static float powerUpTimer = 5f;

    private void OnTriggerEnter(Collider other)
    {
        if (other.tag == "Player")
        {
            Destroy(Instantiate(collectedEffect, transform.position, Quaternion.Euler(-90, 0, 0)), 3);
            GameManager.Instance.IncreaseGameSpeedForNSec();
            Destroy(gameObject);
        }
    }
}
