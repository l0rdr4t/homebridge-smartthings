import { PlatformAccessory } from 'homebridge';
import { IKHomeBridgeHomebridgePlatform } from '../platform';
import { MultiServiceAccessory } from '../multiServiceAccessory';
import { SensorService } from './sensorService';
import { ShortEvent } from '../webhook/subscriptionHandler';

export class AirQualityService extends SensorService {
  serviceName = 'AirQualityService';

  constructor(platform: IKHomeBridgeHomebridgePlatform, accessory: PlatformAccessory, componentId: string, capabilities: string[],
    multiServiceAccessory: MultiServiceAccessory,
    name: string, deviceStatus) {

    super(platform, accessory, componentId, capabilities, multiServiceAccessory, name, deviceStatus);

    this.initService(platform.Service.AirQualityService,
      platform.Characteristic.AirQuality,
      (status) => {
        const deviceStatus = status.airQualitySensor.airQuality.value;
        if (deviceStatus === null || deviceStatus === undefined) {
          this.log.warn(`${this.name} returned bad value for status`);
          return 0;
        }
        return deviceStatus;
      });

    this.log.debug(`Adding ${this.serviceName} Service to ${this.name}`);
  }

  public processEvent(event: ShortEvent): void {
    if (event.capability === 'airQualitySensor') {
      this.service.updateCharacteristic(this.platform.Characteristic.AirQuality, event.value);
    }
  }
}