namespace Assets.Lab4
{
    using UnityEngine;

    public class Mouse : MonoBehaviour 
    {
        void Update() 
        {
            Vector3 mousePos = Input.mousePosition;
            mousePos.z = Camera.main.nearClipPlane;
            transform.position = Camera.main.ScreenToWorldPoint(mousePos);
        }
    }
}