namespace Assets.Lab4.FallowDeer.Behaviours
{
    using UnityEngine;

    public class Separation : DesiredVelocityProvider 
    {
        [SerializeField]
        private float separationRadius = 15f;

        public override Vector3 GetDesiredVelocity()
        {
            Vector3 desiredVelocity = Vector3.zero;
            FallowDeer[] deers = GameObject.FindObjectsOfType<FallowDeer>();
            for (int i = 0; i < deers.Length; ++i) 
            {
                if (Vector3.Distance(deers[i].transform.position, transform.position) < separationRadius)
                {
                    desiredVelocity += -(deers[i].transform.position - transform.position).normalized * FallowDeer.VelocityLimit;
                }
            }
            return desiredVelocity;
        }
    }
}