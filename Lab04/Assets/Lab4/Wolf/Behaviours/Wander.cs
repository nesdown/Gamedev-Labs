namespace Assets.Lab4.Wolf.Behaviours
{
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public class Wander : DesiredVelocityProvider
    {
        [SerializeField, Range(5, 50)]
        private float circleDistance = 10;

        [SerializeField, Range(5, 50)]
        private float circleRadius = 20;

        [SerializeField, Range(1, 80)]
        private int angleChangeStep = 71;

        private int angle = 0;

        public override Vector3 GetDesiredVelocity()
        {
            var rnd = Random.value;
            if (rnd < 0.5)
            {
                angle += angleChangeStep;
            } else if (rnd < 1)
            {
                angle -= angleChangeStep;
            }

            var futurePos = Wolf.transform.position + Wolf.Velocity.normalized * circleDistance;
            var vector = new Vector3(Mathf.Cos(angle * Mathf.Deg2Rad), Mathf.Sin(angle * Mathf.Deg2Rad), 0) * circleRadius;

            return (futurePos + vector - transform.position).normalized * Wolf.VelocityLimit;
        }
    }
}