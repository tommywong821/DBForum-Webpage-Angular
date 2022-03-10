import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MainPageComponent} from "./main-page.component";
import {TrainingSeatArrangementComponent} from "./training/seat-arrangement/training-seat-arrangement.component";

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'training/:trainingId', component: TrainingSeatArrangementComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPageRoutingModule {
}
