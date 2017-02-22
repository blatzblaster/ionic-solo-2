import { Component, Input, ViewChild } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { ApiScheduleDataService, ScheduleAssignment, ScheduleEvent } from "../../providers/schedule/schedule-data.service";
import { DateService } from "../../utilities/date-service";
import { GoogleMapComponent, MapComponent } from "../../components/map.component";

@Component({
  templateUrl: "schedule-detail.html",
  providers: [DateService]
})
export class ScheduleDetailPage {
  @Input() eventItem: ScheduleEvent;
  @ViewChild(GoogleMapComponent) mapComponent: MapComponent;

  private drivers: ScheduleAssignment[] = [];
  private driversLoaded: boolean;
  constructor(private navCtrl: NavController,
    private _apiService: ApiScheduleDataService,
    private _navParams: NavParams,
    private _dateSvc: DateService) {
        this.eventItem = _navParams.get("eventItem");
  }

  ionViewDidLoad() {
    this.loadDrivers();
  }

  onMapLoaded() {
    this.mapComponent.setCenter(this.eventItem.venue.geo.coordinates[1], this.eventItem.venue.geo.coordinates[0]);
    this.mapComponent.setZoom(16);
    this.mapComponent.setSatelliteView();
  }

  driverLine1(driver: ScheduleAssignment) {
    return `${driver.firstName} ${driver.lastName}`;
  }

  driverLine2(driver: ScheduleAssignment) {
    return `${driver.year} ${driver.make} ${driver.model}`;
  }

  loadDrivers() {
    this._apiService.getEventAttendees(this.eventItem.id).subscribe((drivers) => {
      if (!drivers || !drivers.length) {
        this.driversLoaded = true;
        return;
      }

      this.drivers = drivers.sort((a, b) => {
          return a.class > b.class ? 1 : -1;
      });

      let groupedList: ScheduleAssignment[] = [];

      for (let i = 0; i < this.drivers.length; i++) {
        let driverClass = this.drivers[i].class;
        if (i === 0 || drivers[i].class !== drivers[i - 1].class)
          groupedList.push({ class: driverClass });

        groupedList.push(this.drivers[i]);
      }

      this.drivers = groupedList;

      this.driversLoaded = true;
    });
  }

  openDetailUri() {
    window.open(this.eventItem.detailuri, "blank");
  }

}
