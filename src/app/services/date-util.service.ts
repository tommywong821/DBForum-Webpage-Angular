import {Injectable} from "@angular/core";
import {formatDate} from "@angular/common";

@Injectable()
export class DateUtil {
  convertTimeZone(date: any, tzString: string) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));
  }

  //input non Hong Kong Time
  formatToHKTime(date: any) {
    const format = 'yyyy-MM-ddTHH:mm';
    const locale = 'en-US';
    const timeZone = 'Asia/Hong_Kong';
    return formatDate(this.convertTimeZone(date, timeZone), format, locale) + 'Z';
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
