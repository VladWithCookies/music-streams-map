import { map, reduce, assoc } from 'ramda';
import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3';

import { MUSIC_STREAMS_DATA_URL, GEO_DATA_URL } from '@/constants/data';
import useGeoData from '@/hooks/useGeoData';
import useCSVData from '@/hooks/useCSVData';
import styles from './App.module.css';

export default function App() {
  const geoData = useGeoData(GEO_DATA_URL);
  const streamsData = useCSVData(MUSIC_STREAMS_DATA_URL);

  const rowByCountryCode = reduce((result, item) => assoc(item['Code'], item, result), {}, streamsData);
  const getColor = (feature) => rowByCountryCode[feature.id] ? '#7e57c2' : '#fafafa';

  const height = 500;
  const width = 1024;

  const projection = geoNaturalEarth1();
  const path = geoPath(projection);
  const graticule = geoGraticule();

  if (!geoData || !streamsData) return null;

  const { countries, interiors } = geoData;

  return (
    <div className={styles.container}>
      <svg width={width} height={height}>
        <path
          d={path({ type: 'Sphere' })}
          className={styles.sphere}
        />
        <path
          d={path(graticule())}
          className={styles.graticule}
        />
        {map((feature) => (
          <path
            d={path(feature)}
            fill={getColor(feature)}
          />
        ), countries.features)}
        <path
          d={path(interiors)}
          className={styles.interiors}
        />
      </svg>
    </div>
  );
}
