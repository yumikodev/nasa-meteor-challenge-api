import { Injectable } from '@nestjs/common';
import { NeoService } from './neo/neo.service';
import { Asteroid, NeoFeed } from './neo/interfaces/neo.interfaces';

@Injectable()
export class AppService {
  constructor(private readonly neoService: NeoService) {}

  async getFeed() {
    const feed = await this.neoService.feed();
    const parsedData = this.transformForThreeJS(feed);
    return parsedData;
  }

  transformForThreeJS(nasaData: NeoFeed) {
    const asteroids: Asteroid[] = [];

    Object.entries(nasaData.near_earth_objects).forEach(([date, objects]) => {
      objects.forEach((asteroid) => {
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
                  approach.relative_velocity.kilometers_per_second,
                ),
                kilometersPerHour: parseFloat(
                  approach.relative_velocity.kilometers_per_hour,
                ),
              },
              missDistance: {
                astronomical: parseFloat(approach.miss_distance.astronomical),
                lunar: parseFloat(approach.miss_distance.lunar),
                kilometers: parseFloat(approach.miss_distance.kilometers),
                miles: parseFloat(approach.miss_distance.miles),
              },
              orbitingBody: approach.orbiting_body,
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
      });
    });

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
}
