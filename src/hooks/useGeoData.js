import { useState, useEffect } from 'react';
import { not, equals } from 'ramda';
import { json } from 'd3';
import { feature, mesh } from 'topojson';

export default function useGeoData(url) {
  const [data, setData] = useState();

  useEffect(() => {
    json(url).then((data) => setData({
      land: feature(data, data.objects.land),
      countries: feature(data, data.objects.countries),
      interiors: mesh(data, data.objects.countries, (a, b) => not(equals(a, b))),
    }));
  }, [url]);

  return data;
};
