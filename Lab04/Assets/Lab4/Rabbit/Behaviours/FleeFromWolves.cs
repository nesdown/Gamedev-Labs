namespace Assets.Lab4.Rabbit.Behaviours
{
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public class FleeFromWolves : DesiredVelocityProvider
    {
        public override Vector3 GetDesiredVelocity()
        {
            Vector3 desiredVelocity = Vector3.zero;
            var wolves = GameObject.FindObjectsOfType<Wolf.Wolf>();
            for (int i = 0; i < wolves.Length; ++i) 
            {
                if (Vector3.Distance(wolves[i].transform.position, transform.position) < Rabbit.VisionRadius)
                {
                    Rabbit.Run();
                    desiredVelocity += -(wolves[i].transform.position - transform.position).normalized * Rabbit.VelocityLimit;
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