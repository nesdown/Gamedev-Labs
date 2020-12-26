namespace Assets.Lab4.Rabbit.Behaviours
{
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public class Flee : DesiredVelocityProvider
    {
        [SerializeField]
        private Transform objectToFlee;

        public override Vector3 GetDesiredVelocity()
        {
            Vector3 desiredVelocity = Vector3.zero;
            var rabbits = GameObject.FindObjectsOfType<Rabbit>();
            for (int i = 0; i < rabbits.Length; ++i) 
            {
                if (Vector3.Distance(rabbits[i].transform.position, transform.position) < Rabbit.VisionRadius)
                {
                    desiredVelocity += -(rabbits[i].transform.position - transform.position).normalized * Rabbit.VelocityLimit;
                }
            }

            var deers = GameObject.FindObjectsOfType<FallowDeer.FallowDeer>();
            for (int i = 0; i < deers.Length; ++i) 
            {
                if (Vector3.Distance(deers[i].transform.position, transform.position) < Rabbit.VisionRadius)
                {
                    desiredVelocity += -(deers[i].transform.position - transform.position).normalized * Rabbit.VelocityLimit;
                }
            }

            if (desiredVelocity != Vector3.zero)
            {
                Rabbit.Run();
            } else
            {
                Rabbit.StopRun();
            }
            if (objectToFlee != null) 
            {
                desiredVelocity += -(objectToFlee.position - transform.position).normalized * Rabbit.VelocityLimit;
            }
            return desiredVelocity;
        }
    }
}