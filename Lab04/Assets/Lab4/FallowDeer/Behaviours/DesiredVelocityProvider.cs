namespace Assets.Lab4.FallowDeer.Behaviours
{
    using UnityEngine;

    public abstract class DesiredVelocityProvider : MonoBehaviour
    {
        [SerializeField, Range(0, 30)]
        private float weight = 1;
        
        public float Weight => weight;

        protected FallowDeer FallowDeer;

        private void Awake() 
        {
            FallowDeer = GetComponent<FallowDeer>();
        }

        public abstract Vector3 GetDesiredVelocity();
    }
}