using UnityEngine;

public class CameraFollow : MonoBehaviour
{
    public Transform target;
    [SerializeField] float smoothDamp = 0.5f;

    public Vector3 offset, velocity;
    public static CameraFollow instance;
    private void Awake()
    {
        instance = this;
    }
    private void Start()
    {
    }

    void LateUpdate()
    {
        transform.position = Vector3.SmoothDamp(transform.position, target.position + offset, ref velocity, smoothDamp);
    }
}
