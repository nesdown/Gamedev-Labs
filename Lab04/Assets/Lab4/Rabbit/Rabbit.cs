namespace Assets.Lab4.Rabbit
{
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public class Rabbit : MonoBehaviour
    {
        private Vector3 velocity;
        private Vector3 acceleration;
        private float visionRadius = 100;
        private bool running = false;

        [SerializeField]
        private float mass = 1;

        [SerializeField]
        private float velocityLimit = 50;

        [SerializeField]
        private float steeringForceLimit = 40;

        private const float Epsilon = 0.01f;

        public float VelocityLimit => velocityLimit;
        public Vector3 Velocity => velocity;
        public float VisionRadius => visionRadius;

        public void Run()
        {
            if (!running)
            {
                velocityLimit *= 3;
                running = true;
            }
        }

        public void StopRun()
        {
            if (running)
            {
                velocityLimit /= 3;
                running = false;
            }
        }

        public void damage()
        {
            Destroy(gameObject);
        }

        public void ApplyForce(Vector3 force)
        {
            force /= mass;
            acceleration += force;
        }

        // Update is called once per frame
        void Update()
        {
            ApplyFriction();
            ApplySteeringForce();
            ApplyForces();

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