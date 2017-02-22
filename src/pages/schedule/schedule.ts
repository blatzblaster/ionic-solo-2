import { Component, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import { NavController, PopoverController } from "ionic-angular";

import { ApiScheduleDataService, ScheduleEvent } from "../../providers/schedule/schedule-data.service";
import { ScheduleDetailPage } from "./schedule-detail";
import { GoogleMapComponent, MapComponent } from "../../components/map.component";
import { ScheduleSortPopover } from "./schedule-sort";
import { DateService } from "../../utilities/date-service";

@Component({
  templateUrl: "schedule.html",
  providers: [DateService]
})
export class SchedulePage {
  @ViewChild(GoogleMapComponent) mapComponent: MapComponent;

  private events: ScheduleEvent[];
  constructor(private navCtrl: NavController,
    private _apiService: ApiScheduleDataService,
    private popoverCtrl: PopoverController,
    private _dateSvc: DateService) {

  }

  ionViewDidLoad() {
    this.loadSchedule();
  }

  loadSchedule() {
    let grr = this._apiService.getOrganizationSchedule("85F4C7CC-1D72-822B-79115982FA66F935");
    let iowa = this._apiService.getOrganizationSchedule("A183CF63-A4FA-43EF-FFA5531834256DB8");
    let dmvr = this._apiService.getOrganizationSchedule("241F05F5-F073-A014-D9ACF01391D132F9");
    let milw = this._apiService.getOrganizationSchedule("4BA9992B-0D5E-4BB9-FFDBB58CCEE3931E");
    let cir = this._apiService.getOrganizationSchedule("FB77E264-A7ED-387A-581F7D73295D5B69");
    Observable.forkJoin<[ScheduleEvent[]]>([grr, iowa, dmvr, milw, cir]).subscribe((events) => {
      // Sort initially by start date
      this.events = events[0].concat(events[1], events[2], events[3], events[4]).sort((a, b) => {
          return a.start >= b.start ? 1 : -1;
      });
    });
  }

  onMapLoaded() {
    this.mapComponent.setCenter(42.47, -90.67);
    this.mapComponent.setZoom(6);
  }

  viewEvent(eventItem: ScheduleEvent) {
    this.navCtrl.push(ScheduleDetailPage, { eventItem: eventItem });
  }

  showSortMenu(myEvent: Event) {
    let popover = this.popoverCtrl.create(ScheduleSortPopover, { items: this.events });
    popover.present({
      ev: myEvent
    });
  }

  markerUrl(eventItem: ScheduleEvent) {
    return this.eventType(eventItem) === "AX" ? "assets/img/autox-marker.png" : "assets/img/rallyx-marker.png";
  }

  eventType(eventItem: ScheduleEvent) {
    switch (eventItem.type) {
      case "RallyCross":
        return "RX";
      case "Autocross/Solo":
        return "AX";
      default:
        return "AX";
    }
  }

}
