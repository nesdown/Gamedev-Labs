namespace Assets.Lab4.Wolf.Behaviours
{
    using UnityEngine;

    public abstract class DesiredVelocityProvider : MonoBehaviour
    {
        [SerializeField, Range(0, 30)]
        private float weight = 1;
        
        public float Weight => weight;

        protected Wolf Wolf;

        private void Awake() 
        {
            Wolf = GetComponent<Wolf>();
        }

        public abstract Vector3 GetDesiredVelocity();
    }
}