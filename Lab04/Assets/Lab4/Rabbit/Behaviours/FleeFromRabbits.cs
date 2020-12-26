namespace Assets.Lab4.Rabbit.Behaviours
{
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public class FleeFromRabbits : DesiredVelocityProvider
    {
        public override Vector3 GetDesiredVelocity()
        {
            Vector3 desiredVelocity = Vector3.zero;
            var rabbits = GameObject.FindObjectsOfType<Rabbit>();
            for (int i = 0; i < rabbits.Length; ++i) 
            {
                if (Vector3.Distance(rabbits[i].transform.position, transform.position) < Rabbit.VisionRadius)
                {
                    Rabbit.Run();
                    desiredVelocity += -(rabbits[i].transform.position - transform.position).normalized * Rabbit.VelocityLimit;
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