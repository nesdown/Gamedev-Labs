namespace Assets.Lab4.Rabbit.Behaviours
{
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public class FleeFromDeers : DesiredVelocityProvider
    {
        public override Vector3 GetDesiredVelocity()
        {
            Vector3 desiredVelocity = Vector3.zero;
            var deers = GameObject.FindObjectsOfType<FallowDeer.FallowDeer>();
            for (int i = 0; i < deers.Length; ++i) 
            {
                if (Vector3.Distance(deers[i].transform.position, transform.position) < Rabbit.VisionRadius)
                {
                    Rabbit.Run();
                    desiredVelocity += -(deers[i].transform.position - transform.position).normalized * Rabbit.VelocityLimit;
                }
            }

            if (desiredVelocity == Vector3.zero)
            {
                Rabbit.StopRun();
            }
            return desiredVelocity;
        }
    }
}