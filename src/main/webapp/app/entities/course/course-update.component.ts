import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICourse, Course } from 'app/shared/model/course.model';
import { CourseService } from './course.service';
import { JhiEventManager } from 'ng-jhipster';

@Component({
  selector: 'jhi-course-update',
  templateUrl: './course-update.component.html'
})
export class CourseUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]]
  });

  constructor(
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ course }) => {
      this.updateForm(course);
    });
  }

  updateForm(course: ICourse) {
    this.editForm.patchValue({
      id: course.id,
      name: course.name
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const course = this.createFromForm();
    if (course.id !== undefined) {
      this.subscribeToSaveResponse(this.courseService.update(course));
    } else {
      this.subscribeToSaveResponse(this.courseService.create(course));
    }
  }

  private createFromForm(): ICourse {
    const entity = {
      ...new Course(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourse>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
    this.broadcastChange();
  }

  private broadcastChange() {
    this.eventManager.broadcast({
      name: 'courseListModification',
      content: 'Created a course'
    });
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
