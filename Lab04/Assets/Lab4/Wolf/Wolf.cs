namespace Assets.Lab4.Wolf
{
    using UnityEngine;

    public class Wolf : MonoBehaviour 
    {
        private Vector3 velocity;
        private Vector3 acceleration;
        private int lives = 3;
        private float maxTimeNoFood = 60f;

        [SerializeField]
        private float mass = 1;

        [SerializeField]
        private float velocityLimit = 15;

        [SerializeField]
        private float steeringForceLimit = 30;

        private const float Epsilon = 0.01f;

        public float VelocityLimit => velocityLimit;
        public Vector3 Velocity => velocity;

        public void killRabbit(Rabbit.Rabbit rabbit)
        {
            maxTimeNoFood = 60f;
            Destroy(rabbit.gameObject);
        }

        public void killFallowDeer(FallowDeer.FallowDeer fallowDeer)
        {
            maxTimeNoFood = 60f;
            Destroy(fallowDeer.gameObject);
        }

        public void damage()
        {
            lives -= 1;
        }

        public void ApplyForce(Vector3 force)
        {
            force /= mass;
            acceleration += force;
        }

        void Update()
        {
            ApplyFriction();
            ApplySteeringForce();
            ApplyForces();

            if (lives == 0)
            {
                Destroy(gameObject);
            }

            maxTimeNoFood -= Time.deltaTime;
            if (maxTimeNoFood <= 0) 
            {
                Destroy(gameObject);
            }

            void ApplyFriction() 
            {
                var friction = -velocity.normalized * 0.5f;
                ApplyForce(friction);
            }

            void ApplySteeringForce()
            {
                var providers = GetComponents<Behaviours.DesiredVelocityProvider>();
                if (providers == null)
                {
                    return;
                }

                Vector3 steeringForcesSum = Vector3.zero;
                for (int i = 0; i < providers.Length; ++i) 
                {
                    var desiredVelocity = providers[i].GetDesiredVelocity();
                    if (desiredVelocity != Vector3.zero) 
                    {
                        steeringForcesSum += (desiredVelocity - velocity) * providers[i].Weight;
                    }
                }

                ApplyForce(steeringForcesSum.normalized * steeringForceLimit);
            }

            void ApplyForces() 
            {
                velocity += acceleration * Time.deltaTime;

                velocity = Vector3.ClampMagnitude(velocity, velocityLimit);

                if (velocity.magnitude < Epsilon) 
                {
                    velocity = Vector3.zero;
                    return;
                }

                transform.position += velocity * Time.deltaTime;
                acceleration = Vector3.zero;
                float angle = Mathf.Atan2(velocity.y, velocity.x) * Mathf.Rad2Deg;
                transform.rotation = Quaternion.AngleAxis(angle, Vector3.forward);
                if (transform.position.x > 237 || transform.position.x < -237 || transform.position.y > 100 || transform.position.y < -100)
                {
                    Destroy(gameObject);
                }
            }
        }
    }
}