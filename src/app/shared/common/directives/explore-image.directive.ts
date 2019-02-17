import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';
import {UserService} from '../../services/user.service';

@Directive({
  selector: '[exploreImage]'
})
export class ExploreImageDirective implements OnInit {

  public nativeElement: Node;

  constructor(private renderer: Renderer2,
              private element: ElementRef,
              private user: UserService
              ) {
      this.nativeElement = element.nativeElement;
  }
    ngOnInit() {
      this.user.currentImageUrl
        .subscribe((l) => {
          const newImage = this.renderer.createElement('img');
          this.renderer.setAttribute(newImage, 'src', l);
          this.renderer.setAttribute(newImage, 'class', 'card-img-top block');
          this.nativeElement.replaceChild(newImage, this.nativeElement.firstChild);
        });
   }

}
