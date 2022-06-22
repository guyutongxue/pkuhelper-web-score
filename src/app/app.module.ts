import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ControllerComponent } from './controller/controller.component';
import { OsuButtonComponent } from './osu-button/osu-button.component';
import { ViewerComponent } from './viewer/viewer.component';
import { FooterComponent } from './footer/footer.component';
import { NewBlockViewerComponent } from './new-block-viewer/new-block-viewer.component';
import { SemesterViewerComponent } from './semester-viewer/semester-viewer.component';
import { OverallViewerComponent } from './overall-viewer/overall-viewer.component';
import { RowLayoutComponent } from './row-layout/row-layout.component';
import { VerticalLayoutComponent } from './vertical-layout/vertical-layout.component';
import { CourseViewerComponent } from './course-viewer/course-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    ControllerComponent,
    OsuButtonComponent,
    ViewerComponent,
    FooterComponent,
    NewBlockViewerComponent,
    SemesterViewerComponent,
    OverallViewerComponent,
    RowLayoutComponent,
    VerticalLayoutComponent,
    CourseViewerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
