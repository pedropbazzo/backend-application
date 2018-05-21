import { Component, OnInit } from '@angular/core';
import {Task} from '../../../models/task.model';
import {DashboardService} from '../dashboard.service';
import {ApiService} from '../../../api/api.service';

@Component({
  selector: 'dashboard-tasklist',
  templateUrl: './tasks.list.component.html'
})
export class TaskListComponent implements OnInit {
    itemsArray: Task[] = [];

    constructor(protected api: ApiService, protected dashboardService: DashboardService) {
    }

    ngOnInit() {
        const user: any = this.api.getUser() ? this.api.getUser() : null;
        const params = {
            'user_id': user.id,
            'limit': 10
        };
        this.dashboardService.getTasks(this.setTasks.bind(this), params);
    }

    setTasks(result) {
        this.itemsArray = result;
    }



}
