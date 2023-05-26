import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root',
})
export class DateUtil {
  convertTimeZone(date: any, tzString: string) {
    return new Date(
      (typeof date === 'string' ? new Date(date) : date).toLocaleString(
        'en-US',
        { timeZone: tzString }
      )
    );
  }

  //input non Hong Kong Time
  formatToHKTimeWithHour(date: any) {
    const format = 'yyyy/MM/dd HH:mm';
    const locale = 'en-US';
    const timeZone = 'Asia/Hong_Kong';
    return formatDate(this.convertTimeZone(date, timeZone), format, locale);
  }

  //input non Hong Kong Time mongodb
  formatToHKTimeDateOnly(date: any) {
    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    const timeZone = 'Asia/Hong_Kong';
    return formatDate(this.convertTimeZone(date, timeZone), format, locale);
  }

  displayFormat(date: any) {
    //display postgres db HK time to UTC display format, no value change
    return moment(date).tz('UTC').format('YYYY/MM/DD HH:mm');
  }
}

export const DATEPICKER_FORMAT = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
