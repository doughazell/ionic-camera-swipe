import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab4bPage } from './tab4b.page';

describe('Tab4bPage', () => {
  let component: Tab4bPage;
  let fixture: ComponentFixture<Tab4bPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Tab4bPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab4bPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
