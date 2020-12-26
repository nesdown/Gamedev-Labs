namespace Assets.Lab4.Wolf.Behaviours
{
    using UnityEngine;

    public class AvoidEdges : DesiredVelocityProvider
    {
        private float edge = 30f;
        private float x = 237f;
        private float y = 100f;

        public override Vector3 GetDesiredVelocity()
        {
            var maxSpeed = Wolf.VelocityLimit;
            var v = Wolf.Velocity;

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