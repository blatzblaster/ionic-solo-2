import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { ApiScheduleDataService, ScheduleDataService } from "../providers/schedule/schedule-data.service";

import { SchedulePage } from "../pages/schedule/schedule";
import { ScheduleDetailPage } from "../pages/schedule/schedule-detail";
import { ScheduleSortPopover } from "../pages/schedule/schedule-sort";
import { ClassesPage } from "../pages/classes/classes";
import { ConvertPage } from "../pages/convert/convert";

import { GoogleMapComponent } from "../components/map.component";
import { AgmCoreModule } from 'angular2-google-maps/core';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    SchedulePage,
    ScheduleDetailPage,
    ScheduleSortPopover,
    GoogleMapComponent,
    ClassesPage,
    ConvertPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: ''
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    SchedulePage,
    ScheduleDetailPage,
    ScheduleSortPopover,
    ClassesPage,
    ConvertPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: ApiScheduleDataService, useClass: ScheduleDataService }
  ]
})
export class AppModule {}
