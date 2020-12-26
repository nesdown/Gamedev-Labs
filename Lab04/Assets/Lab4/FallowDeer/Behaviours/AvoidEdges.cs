namespace Assets.Lab4.FallowDeer.Behaviours
{
    using UnityEngine;

    public class AvoidEdges : DesiredVelocityProvider
    {
        private float edge = 25f;
        private float x = 237f;
        private float y = 100f;

        public override Vector3 GetDesiredVelocity()
        {
            var maxSpeed = FallowDeer.VelocityLimit;
            var v = FallowDeer.Velocity;

            if (transform.position.x > x - edge)
            {
                return new Vector3(-maxSpeed, 0, 0);
            }
            if (transform.position.x < edge - x)
            {
                return new Vector3(maxSpeed, 0, 0);
            }
            if (transform.position.y > y - edge) 
            {
                return new Vector3(0, -maxSpeed, 0);
            }
            if (transform.position.y < edge - y)
            {
                return new Vector3(0, maxSpeed, 0);
            }
            return Vector3.zero;
        }
    }
}