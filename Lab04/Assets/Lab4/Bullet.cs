namespace Assets.Lab4
{
    using UnityEngine;

    public class Bullet : MonoBehaviour 
    {
        private Vector3 velocity;
        private Vector3 startPosition;
        private float killDistance = 3f;

        [SerializeField, Range(1, 1000)]
        private float velocityLimit = 40;

        [SerializeField]
        private float flyDistance = 200;

        private const float Epsilon = 0.01f;

        public float VelocityLimit => velocityLimit;
        public Vector3 Velocity => velocity;

        void Awake() {
            startPosition = transform.position;
            Mouse aim = GameObject.FindObjectsOfType<Mouse>()[0];
            Vector3 vec = aim.transform.position;
            vec.z = 0;
            velocity = (vec - transform.position).normalized * velocityLimit;
        }

        void Update() 
        {
            hit();
            transform.position += velocity * Time.deltaTime;

            if (Vector3.Distance(startPosition, transform.position) > flyDistance)
            {
                Destroy(gameObject);
            }
        }

        void hit()
        {
            var rabbits = GameObject.FindObjectsOfType<Rabbit.Rabbit>();
            var deers = GameObject.FindObjectsOfType<FallowDeer.FallowDeer>();
            var wolves = GameObject.FindObjectsOfType<Wolf.Wolf>();

            for (int i = 0; i < rabbits.Length; ++i) 
            {
                if (Vector3.Distance(transform.position, rabbits[i].transform.position) < killDistance)
                {
                    rabbits[i].damage();
                    Destroy(gameObject);
                }
            }
            for (int i = 0; i < deers.Length; ++i) 
            {
                if (Vector3.Distance(transform.position, deers[i].transform.position) < killDistance)
                {
                    deers[i].damage();
                    Destroy(gameObject);
                }
            }
            for (int i = 0; i < wolves.Length; ++i) 
            {
                if (Vector3.Distance(transform.position, wolves[i].transform.position) < killDistance)
                {
                    wolves[i].damage();
                    Destroy(gameObject);
                }
            }
        }
    }
}