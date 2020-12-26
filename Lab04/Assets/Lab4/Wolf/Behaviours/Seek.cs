namespace Assets.Lab4.Wolf.Behaviours
{
    using UnityEngine;

    public class Seek : DesiredVelocityProvider
    {
        [SerializeField]
        private float visionRadius = 120f;

        private float killDistance = 5f;

        public override Vector3 GetDesiredVelocity()
        {
            string animal = "deer";
            var desiredVelocity = Vector3.zero;
            FallowDeer.FallowDeer[] deers = GameObject.FindObjectsOfType<FallowDeer.FallowDeer>();
            Rabbit.Rabbit[] rabbits = GameObject.FindObjectsOfType<Rabbit.Rabbit>();
            var hunters = GameObject.FindObjectsOfType<Hunter>();
            
            float dist = visionRadius;
            int id = -1;
            for (int i = 0; i < deers.Length; ++i)
            {
                if (Vector3.Distance(deers[i].transform.position, transform.position) < killDistance)
                {
                    Wolf.killFallowDeer(deers[i]);
                    return desiredVelocity;
                }
                if (dist > Vector3.Distance(deers[i].transform.position, transform.position))
                {
                    dist = Vector3.Distance(deers[i].transform.position, transform.position);
                    id = i;
                }
            }

            for (int i = 0; i < rabbits.Length; ++i)
            {
                if (Vector3.Distance(rabbits[i].transform.position, transform.position) < killDistance)
                {
                    Wolf.killRabbit(rabbits[i]);
                    return desiredVelocity;
                }
                if (dist > Vector3.Distance(rabbits[i].transform.position, transform.position))
                {
                    dist = Vector3.Distance(rabbits[i].transform.position, transform.position);
                    id = i;
                    animal = "rabbit";
                }
            }

            if (hunters.Length > 0)
            {
                Hunter hunter = hunters[0];
                if (dist > Vector3.Distance(hunter.transform.position, transform.position))
                {
                    dist = Vector3.Distance(hunter.transform.position, transform.position);
                    animal = "hunter";
                }
            }

            if (animal == "deer" && id != -1)
            {
                desiredVelocity += (deers[id].transform.position - transform.position).normalized * Wolf.VelocityLimit;
            } else if (animal == "rabbit" && id != -1)
            {
                desiredVelocity += (rabbits[id].transform.position - transform.position).normalized * Wolf.VelocityLimit;
            } else if (animal == "hunter")
            {
                desiredVelocity += (hunters[0].transform.position - transform.position).normalized * Wolf.VelocityLimit;
            }
            return desiredVelocity;
        }
    }
}