namespace Assets.Lab4.Rabbit.Behaviours
{
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public class Seek : DesiredVelocityProvider
    {
        [SerializeField]
        private Transform objectToFollow;

        public override Vector3 GetDesiredVelocity() 
        {
            if (objectToFollow == null) 
            {
                return Vector3.zero;
            }
            return (objectToFollow.position - transform.position).normalized * Rabbit.VelocityLimit;
        }
    }
}
