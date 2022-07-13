const commutesPerYear = 260 * 2;
const litresPerKM = 10 / 100;
const gasLitreCost = 1.5;
const litreCostKM = litresPerKM * gasLitreCost;
const secondsPerDay = 60 * 60 * 24;

type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Distance({ leg }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;

  const dist = Math.floor(
    (leg.duration.value)
  );

  return <div>
    <p>
      Этот адрес находится в <span className="highlight">{leg.distance.text}</span>. 
      Время в пути <span className="highlight">{leg.duration.text}</span>.
    </p>
    </div>;
}
