import { Component, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { DateRangeSelectorComponent } from '../date-range-selector/date-range-selector.component';
import * as moment from 'moment';
import { ApiService } from '../../../../api/api.service';
import { User } from '../../../../models/user.model';

export interface ViewData {
    name: string,
    start: moment.Moment,
    end: moment.Moment,
    timezone: string,
}

@Component({
    selector: 'view-switcher',
    templateUrl: './view-switcher.component.html',
    styleUrls: ['./view-switcher.component.scss']
})
export class ViewSwitcherComponent implements OnInit {
    @ViewChild('dateRangeSelector') dateRangeSelector: DateRangeSelectorComponent;

    start: moment.Moment = moment.utc();
    end: moment.Moment = moment.utc().add(1, 'day');

    timezone: string = 'Asia/Omsk';

    userInteraction: boolean = false;
    viewName: string = 'timelineDay';
    activeButton: string = 'timelineDay';

    @Output() setView = new EventEmitter<ViewData>();

    constructor(private api: ApiService) {

    }
    ngOnInit() {
        const user = this.api.getUser() as User;

        let timezone = localStorage.getItem('statistics-timezone');
        if (timezone === null) {
            timezone = user.timezone !== null ? user.timezone : 'Asia/Omsk';
        }

        this.timezone = timezone;
    }

    applyChanges() {
        this.setView.emit({
            name: this.viewName,
            start: this.start,
            end: this.end,
            timezone: this.timezone,
        });
    }

    changeViewName(viewName: string) {
        this.activeButton = viewName;
        if (viewName !== 'timelineRange') {
            this.viewName = viewName;
            this.applyChanges();
        }
    }

    changeStartDate(date: moment.Moment) {
        this.start = date;

        switch (this.viewName) {
            case 'timelineDay': this.end = date.clone().add(1, 'day'); break;
            case 'timelineWeek': this.end = date.clone().add(1, 'week'); break;
            case 'timelineMonth': this.end = date.clone().add(1, 'month'); break;
            default: break;
        }

        this.applyChanges();
    }

    changeRange(start: moment.Moment, end: moment.Moment) {
        this.viewName = 'timelineRange';
        this.start = start;
        this.end = end;
        this.applyChanges();
    }

    changeTimezone(timezone: string) {
        this.timezone = timezone;
        localStorage.setItem('statistics-timezone', timezone);
        this.applyChanges();
    }
}
