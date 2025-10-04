import { Injectable } from '@nestjs/common';
import { NeoService } from './neo/neo.service';
import { Asteroid, NeoFeed } from './neo/interfaces/neo.interfaces';
import { FeedOptionsDto } from './neo/dtos/feed-options.dto';

@Injectable()
export class AppService {
  constructor(private readonly neoService: NeoService) {}

  async getFeed({ onlyHazardous, limit }: FeedOptionsDto) {
    const feed = await this.neoService.feed();
    const asteroids: Asteroid[] = [];

    for (const [, objects] of Object.entries(feed.near_earth_objects)) {
      for (const asteroid of objects.filter((o) =>
        onlyHazardous ? o.is_potentially_hazardous_asteroid : true,
      )) {
        const approach = asteroid.close_approach_data[0];

        asteroids.push({
          // Identificación
          id: asteroid.id,
          name: asteroid.name,

          closeApproachData: asteroid.close_approach_data.map(
            (approachData) => ({
              closeApproachDate: new Date(
                approachData.epoch_date_close_approach,
              ).toISOString(),
              relativeVelocity: {
                kilometersPerSecond: parseFloat(
                  approachData.relative_velocity.kilometers_per_second,
                ),
                kilometersPerHour: parseFloat(
                  approachData.relative_velocity.kilometers_per_hour,
                ),
              },
              missDistance: {
                astronomical: parseFloat(
                  approachData.miss_distance.astronomical,
                ),
                lunar: parseFloat(approachData.miss_distance.lunar),
                kilometers: parseFloat(approachData.miss_distance.kilometers),
                miles: parseFloat(approachData.miss_distance.miles),
              },
              orbitingBody: approachData.orbiting_body,
            }),
          ),

          // Metadatos para UI
          metadata: {
            isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
            isSentryObject: asteroid.is_sentry_object,
            missDistance: {
              km: parseFloat(approach.miss_distance.kilometers),
              astronomical: parseFloat(approach.miss_distance.astronomical),
              lunar: parseFloat(approach.miss_distance.lunar),
            },
            absoluteMagnitude: asteroid.absolute_magnitude_h,
            estimatedDiameter: {
              min: asteroid.estimated_diameter.kilometers
                .estimated_diameter_min,
              max: asteroid.estimated_diameter.kilometers
                .estimated_diameter_max,
            },
          },
        });
      }
    }

    asteroids.sort(
      (a, b) =>
        Number(b.metadata.isPotentiallyHazardous) -
        Number(a.metadata.isPotentiallyHazardous),
    );
    if (!onlyHazardous && limit && asteroids.length > limit)
      asteroids.length = limit;

    return {
      asteroids,
      metadata: {
        totalCount: asteroids.length,
        hazardousCount: asteroids.filter(
          (a) => a.metadata.isPotentiallyHazardous,
        ).length,
        sentryCount: asteroids.filter((a) => a.metadata.isSentryObject).length,
      },
    };
  }

  async getDetails(asteroidId: string) {
    const {
      id,
      name,
      designation,
      nasa_jpl_url,
      absolute_magnitude_h,
      estimated_diameter,
      is_potentially_hazardous_asteroid,
      close_approach_data,
      is_sentry_object,
      orbital_data,
    } = await this.neoService.details(asteroidId);

    return {
      id,
      name,
      designation,
      closeApproachData: close_approach_data.map((approachData) => ({
        closeApproachDate: new Date(
          approachData.epoch_date_close_approach,
        ).toISOString(),
        relativeVelocity: {
          kilometersPerSecond: parseFloat(
            approachData.relative_velocity.kilometers_per_second,
          ),
          kilometersPerHour: parseFloat(
            approachData.relative_velocity.kilometers_per_hour,
          ),
        },
        missDistance: {
          astronomical: parseFloat(approachData.miss_distance.astronomical),
          lunar: parseFloat(approachData.miss_distance.lunar),
          kilometers: parseFloat(approachData.miss_distance.kilometers),
          miles: parseFloat(approachData.miss_distance.miles),
        },
        orbitingBody: approachData.orbiting_body,
      })),
      orbitalData: {
        orbitId: orbital_data.orbit_id,
        orbitDeterminationDate: new Date(orbital_data.orbit_determination_date),
        first_observation_date: new Date(orbital_data.first_observation_date),
        last_observation_date: new Date(orbital_data.last_observation_date),
        dataArcInDays: orbital_data.data_arc_in_days,
        observationsUsed: orbital_data.observations_used,
        orbitUncertainty: orbital_data.orbit_uncertainty,
        minimumOrbitIntersection: parseFloat(
          orbital_data.minimum_orbit_intersection,
        ),
        jupiterTisserandInvariant: parseFloat(
          orbital_data.jupiter_tisserand_invariant,
        ),
        epochOsculation: parseFloat(orbital_data.epoch_osculation),
        eccentricity: parseFloat(orbital_data.eccentricity),
        semiMajorAxis: parseFloat(orbital_data.semi_major_axis),
        inclination: parseFloat(orbital_data.inclination),
        ascendingNodeLongitude: parseFloat(
          orbital_data.ascending_node_longitude,
        ),
        orbitalPeriod: parseFloat(orbital_data.orbital_period),
        perihelionDistance: parseFloat(orbital_data.perihelion_distance),
        perihelionArgument: parseFloat(orbital_data.perihelion_argument),
        perihelionTime: parseFloat(orbital_data.perihelion_time),
        aphelionDistance: parseFloat(orbital_data.aphelion_distance),
        meanAnomaly: parseFloat(orbital_data.mean_anomaly),
        meanMotion: parseFloat(orbital_data.mean_motion),
        equinox: orbital_data.equinox,
        orbitClass: {
          type: orbital_data.orbit_class.orbit_class_type,
          description: orbital_data.orbit_class.orbit_class_description,
          range: orbital_data.orbit_class.orbit_class_range,
        },
      },
      metadata: {
        nasaJplUrl: nasa_jpl_url,
        isPotentiallyHazardous: is_potentially_hazardous_asteroid,
        isSentryObject: is_sentry_object,
        absoluteMagnitude: absolute_magnitude_h,
        estimatedDiameter: {
          min: estimated_diameter.kilometers.estimated_diameter_min,
          max: estimated_diameter.kilometers.estimated_diameter_max,
        },
      },
    };
  }
}
