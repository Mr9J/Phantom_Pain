import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

type DirectionsProps = {
  address: string;
  origin: string;
};

const Directions = ({ address, origin }: DirectionsProps) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    directionsService
      .route({
        origin: origin ? origin : "106台北市大安區復興南路一段390號",
        destination: address ? address : "106台北市大安區復興南路一段390號",
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });
  }, [directionsService, directionsRenderer, origin]);

  useEffect(() => {
    if (!directionsRenderer) return;

    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  return (
    <div className="lg:absolute top-0 left-0 bg-slate-700/80 rounded-lg text-white p-4">
      <h2>{selected.summary}</h2>
      <p>
        {leg.start_address.split(",")[0]} 到 {leg.end_address.split(",")[0]}
      </p>
      <p>距離: {leg.distance?.text}</p>
      <p>時間: {leg.duration?.text}</p>

      <h2>其他路線</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={route.summary}>
            <Button
              variant="link"
              className="text-white"
              onClick={() => setRouteIndex(index)}
            >
              {route.summary}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Directions;
