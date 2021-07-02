import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { StateService } from './state.service';

interface ThemeState {
  backgroundColor: any;
  textColor: any;
  cardBackgroundColor: any;
  cardTextColor: any;
  typoFontSize: any;
  typoLetterSpacing: any;
  typoFontFamily: any;
  hoverTextColor: any;
  hoverBackgroundColor: any;
}
const initialState: ThemeState = {
  backgroundColor: undefined,
  textColor: undefined,
  cardBackgroundColor: undefined,
  cardTextColor: undefined,
  typoFontSize: 15,
  typoLetterSpacing: 0,
  typoFontFamily: 'monospace',
  hoverTextColor: undefined,
  hoverBackgroundColor: undefined,
};
@Injectable({
  providedIn: 'root',
})
export class ThemeService extends StateService<ThemeState> {
  constructor(private notifService: NotificationService) {
    super(initialState);
  }
  // state Observable for subscribers and get state data
  $state: Observable<ThemeState> = this.select((state) => state);

  $backgroundColor: Observable<any> = this.select(
    (state) => state.backgroundColor
  );

  $textColor: Observable<any> = this.select((state) => state.textColor);

  $cardBackgroundColor: Observable<any> = this.select(
    (state) => state.cardBackgroundColor
  );

  $cardTextColor: Observable<any> = this.select((state) => state.cardTextColor);

  $typoFontSize: Observable<any> = this.select((state) => state.typoFontSize);

  $typoLetterSpacing: Observable<any> = this.select(
    (state) => state.typoLetterSpacing
  );

  $typoFontFamily: Observable<any> = this.select(
    (state) => state.typoFontFamily
  );

  $hoverBackgroundColor: Observable<any> = this.select(
    (state) => state.hoverBackgroundColor
  );

  $hoverTextColor: Observable<any> = this.select(
    (state) => state.hoverTextColor
  );

  showNotifSuccess(msg: any) {
    this.notifService.showNotif(msg, {
      delay: 3500,
    });
  }

  setBackgroundColor(color: any) {
    this.setState({ backgroundColor: color });
    this.showNotifSuccess(`Set background color to ${color}`);
  }

  setTextColor(color: any) {
    this.setState({ textColor: color });
    this.showNotifSuccess(`Set text color to ${color}`);
  }

  setCardBackgroundColor(color: any) {
    this.setState({ cardBackgroundColor: color });
    this.showNotifSuccess(`Set card background color to ${color}`);
  }

  setCardTextColor(color: any) {
    this.setState({ cardTextColor: color });
    this.showNotifSuccess(`Set card text color to ${color}`);
  }

  setTypoFontSize(fontSize: any) {
    this.setState({ typoFontSize: fontSize });
    this.showNotifSuccess(`Set font size to ${fontSize}`);
  }

  setTypoLetterSpacing(px: any) {
    this.setState({ typoLetterSpacing: px });
    this.showNotifSuccess(`Set letter spacing to ${px}`);
  }

  setTypoFontFamily(fontFamily: any) {
    this.setState({ typoFontFamily: fontFamily });
    this.showNotifSuccess(`Set font family to ${fontFamily}`);
  }

  setHoverTextColor(color: any) {
    this.setState({ hoverTextColor: color });
    this.showNotifSuccess(`Set hover text color to ${color}`);
  }

  setHoverBackgroundColor(color: any) {
    this.setState({ hoverBackgroundColor: color });
    this.showNotifSuccess(`Set hover background color to ${color}`);
  }
}
