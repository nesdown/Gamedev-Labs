namespace Assets.Lab4.FallowDeer.Behaviours
{
    using UnityEngine;

    public class Flee : DesiredVelocityProvider
    {
        [SerializeField]
        private float visionRadius = 150f;

        public override Vector3 GetDesiredVelocity()
        {
            var desiredVelocity = Vector3.zero;
            var wolves = GameObject.FindObjectsOfType<Wolf.Wolf>();
            for (int i = 0; i < wolves.Length; ++i) 
            {
                if (Vector3.Distance(wolves[i].transform.position, transform.position) < visionRadius)
                {
                    desiredVelocity += -(wolves[i].transform.position - transform.position).normalized * FallowDeer.VelocityLimit;
                }
            }
            return desiredVelocity;
        }
    }
}