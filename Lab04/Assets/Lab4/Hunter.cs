namespace Assets.Lab4
{
    using UnityEngine;

    public class Hunter : MonoBehaviour 
    {
        private Vector3 velocity;
        private Vector3 acceleration;
        private float wolfAttackDist = 5f;

        [SerializeField]
        private int ammo = 50;

        [SerializeField]
        private int lives = 3;

        [SerializeField]
        private float mass = 1;

        [SerializeField, Range(1, 100)]
        private float velocityLimit = 100;

        [SerializeField, Range(1, 100)]
        private float steeringForceLimit = 40;

        private const float Epsilon = 0.01f;

        public float VelocityLimit => velocityLimit;
        public Vector3 Velocity => velocity;

        public GameObject bullet;
        public Transform spawnPoint;

        private void damage()
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
            Shoot();
            getDamaged();

            if (lives == 0) 
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
                var desiredVelocity = Vector3.zero;
                if (Input.GetKey(KeyCode.A))
                {
                    desiredVelocity += new Vector3(-1, 0, 0) * velocityLimit;
                }
                if (Input.GetKey(KeyCode.D))
                {
                    desiredVelocity += new Vector3(1, 0, 0) * velocityLimit;
                }
                if (Input.GetKey(KeyCode.S))
                {
                    desiredVelocity += new Vector3(0, -1, 0) * velocityLimit;
                }
                if (Input.GetKey(KeyCode.W))
                {
                    desiredVelocity += new Vector3(0, 1, 0) * velocityLimit;
                }

                var steeringForce = (desiredVelocity - velocity).normalized * steeringForceLimit;

                ApplyForce(steeringForce);
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
                if (transform.position.x > 237 || transform.position.x < -237 || transform.position.y > 100 || transform.position.y < -100)
                {
                    Destroy(gameObject);
                }
            }

            void Shoot()
            {
                if (Input.GetMouseButtonDown(0) && ammo > 0)
                {
                    Instantiate(bullet, spawnPoint.position, spawnPoint.rotation);
                    ammo--;
                }
            }

            void getDamaged()
            {
                var wolves = GameObject.FindObjectsOfType<Wolf.Wolf>();

                for (int i = 0; i < wolves.Length; ++i) 
                {
                    if (Vector3.Distance(transform.position, wolves[i].transform.position) < wolfAttackDist)
                    {
                        damage();
                    }
                }
            }
        }
    }
}