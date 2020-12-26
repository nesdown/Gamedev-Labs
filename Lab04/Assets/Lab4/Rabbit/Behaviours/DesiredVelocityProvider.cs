namespace Assets.Lab4.Rabbit.Behaviours
{
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public abstract class DesiredVelocityProvider : MonoBehaviour
    {
        [SerializeField, Range(0, 3)]
        private float weight = 1f;

        public float Weight => weight;

        protected Rabbit Rabbit;

        private void Awake() {
            Rabbit = GetComponent<Rabbit>();
        }

        public abstract Vector3 GetDesiredVelocity();
    }
}