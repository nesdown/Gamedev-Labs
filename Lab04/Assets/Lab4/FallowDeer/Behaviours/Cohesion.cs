namespace Assets.Lab4.FallowDeer.Behaviours
{
    using UnityEngine;

    public class Cohesion : DesiredVelocityProvider
    {
        [SerializeField]
        private float deerHerdRadius = 40;

        public override Vector3 GetDesiredVelocity()
        {
            Vector3 desiredVelocity = Vector3.zero;
            FallowDeer[] deers = GameObject.FindObjectsOfType<FallowDeer>();
            for (int i = 0; i < deers.Length; ++i) 
            {
                if (Vector3.Distance(deers[i].transform.position, transform.position) < deerHerdRadius)
                {
                    desiredVelocity += (deers[i].transform.position - transform.position).normalized * FallowDeer.VelocityLimit;
                }
            }
            return desiredVelocity;
        }
    }
}