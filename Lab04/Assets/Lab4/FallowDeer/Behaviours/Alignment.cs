namespace Assets.Lab4.FallowDeer.Behaviours
{
    using UnityEngine;

    public class Alignment : DesiredVelocityProvider
    {
        [SerializeField]
        private float alignmentRadius = 40f;

        public override Vector3 GetDesiredVelocity()
        {
            Vector3 desiredVelocity = Vector3.zero;
            FallowDeer[] deers = GameObject.FindObjectsOfType<FallowDeer>();
            for (int i = 0; i < deers.Length; ++i) 
            {
                if (Vector3.Distance(deers[i].transform.position, transform.position) < alignmentRadius)
                {
                    desiredVelocity += deers[i].Velocity;
                }
            }
            return desiredVelocity.normalized * FallowDeer.VelocityLimit;
        }
    }
}