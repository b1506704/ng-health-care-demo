import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Image } from '../../models/image';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { ImageHttpService } from './image-http.service';

interface ImageState {
  imageList: Array<Image>;
  filteredImageList: Array<Image>;
  searchedImageList: Array<Image>;
  selectedImage: Object;
  responseMsg: String;
}
const initialState: ImageState = {
  imageList: [],
  filteredImageList: [],
  searchedImageList: [],
  selectedImage: {},
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class ImageStore extends StateService<ImageState> {
  constructor(
    private imageService: ImageHttpService,
    private store: StoreService
  ) {
    super(initialState);
    this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.imageService.fetchImage().subscribe({
      next: (data: any) => {
        this.setState({ imageList: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.store.showNotifSuccess('Load image successfully', 'custom');
      },
    });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $imageList: Observable<Array<Image>> = this.select(
    (state) => state.imageList
  );

  $filteredImageList: Observable<Array<Image>> = this.select(
    (state) => state.filteredImageList
  );

  $searchedImageList: Observable<Array<Image>> = this.select(
    (state) => state.searchedImageList
  );

  $selectedImage: Observable<Object> = this.select(
    (state) => state.selectedImage
  );

  uploadImage(image: Image) {
    this.setIsLoading(true);
    this.imageService.uploadImage(image).subscribe({
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

  updateImage(image: Image) {
    this.setIsLoading(true);
    this.imageService.updateImage(image).subscribe({
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

  deleteImage(image: Image) {
    this.setIsLoading(true);
    this.imageService.deleteImage(image).subscribe({
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

  selectImage(_image: Image) {
    this.setState({ selectedImage: _image });
  }

  getImage(id: string | number) {
    return this.$imageList.pipe(
      map((images: Array<Image>) => images.find((image) => image.id === id)!)
    );
  }

  filterImage(_imageList: Array<Image>, _criteria: string) {
    this.setState({ filteredImageList: _imageList });
  }

  searchImage(_imageList: Array<Image>, _criteria: string) {
    this.setState({ searchedImageList: _imageList });
  }
}
