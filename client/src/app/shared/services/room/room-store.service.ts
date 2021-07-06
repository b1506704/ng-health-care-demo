import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Room } from '../../models/room';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { RoomHttpService } from './room-http.service';

interface RoomState {
  roomList: Array<Room>;
  filteredRoomList: Array<Room>;
  searchedRoomList: Array<Room>;
  selectedRoom: Object;
  responseMsg: String;
}
const initialState: RoomState = {
  roomList: [],
  filteredRoomList: [],
  searchedRoomList: [],
  selectedRoom: {},
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class RoomStore extends StateService<RoomState> {
  constructor(
    private roomService: RoomHttpService,
    private store: StoreService
  ) {
    super(initialState);
    this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.roomService.fetchRoom().subscribe({
      next: (data: any) => {
        this.setState({ roomList: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.store.showNotif('Load room successfully', 'custom');
      },
    });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $roomList: Observable<Array<Room>> = this.select((state) => state.roomList);

  $filteredRoomList: Observable<Array<Room>> = this.select(
    (state) => state.filteredRoomList
  );

  $searchedRoomList: Observable<Array<Room>> = this.select(
    (state) => state.searchedRoomList
  );

  $selectedRoom: Observable<Object> = this.select(
    (state) => state.selectedRoom
  );

  uploadRoom(room: Room) {
    this.setIsLoading(true);
    this.roomService.uploadRoom(room).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
      },
    });
  }

  updateRoom(room: Room) {
    this.setIsLoading(true);
    this.roomService.updateRoom(room).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
      },
    });
  }

  deleteRoom(room: Room) {
    this.setIsLoading(true);
    this.roomService.deleteRoom(room).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
      },
    });
  }

  selectRoom(_room: Room) {
    this.setState({ selectedRoom: _room });
  }

  getRoom(id: string | number) {
    return this.$roomList.pipe(
      map((rooms: Array<Room>) => rooms.find((room) => room.id === id)!)
    );
  }

  filterRoom(_roomList: Array<Room>, _criteria: string) {
    this.setState({ filteredRoomList: _roomList });
  }

  searchRoom(_roomList: Array<Room>, _criteria: string) {
    this.setState({ searchedRoomList: _roomList });
  }
}
