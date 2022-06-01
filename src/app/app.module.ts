import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import {HttpClientModule} from "@angular/common/http";
// @ts-ignore
import {EngineFrameComponent} from '@app/ui/engine-frame/engine-frame.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    EngineFrameComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
