import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IComment, Comment } from 'app/shared/model/comment.model';
import { CommentService } from './comment.service';

@Component({
  selector: 'jhi-comment-update',
  templateUrl: './comment-update.component.html'
})
export class CommentUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    videoID: [null, [Validators.required]],
    commentBody: [null, [Validators.required]],
    likesCount: [],
    dislikesCount: [],
    isApproved: [null, [Validators.required]]
  });

  constructor(protected commentService: CommentService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ comment }) => {
      this.updateForm(comment);
    });
  }

  updateForm(comment: IComment) {
    this.editForm.patchValue({
      id: comment.id,
      videoID: comment.videoID,
      commentBody: comment.commentBody,
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      isApproved: comment.isApproved
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const comment = this.createFromForm();
    if (comment.id !== undefined) {
      this.subscribeToSaveResponse(this.commentService.update(comment));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment));
    }
  }

  private createFromForm(): IComment {
    const entity = {
      ...new Comment(),
      id: this.editForm.get(['id']).value,
      videoID: this.editForm.get(['videoID']).value,
      commentBody: this.editForm.get(['commentBody']).value,
      likesCount: this.editForm.get(['likesCount']).value,
      dislikesCount: this.editForm.get(['dislikesCount']).value,
      isApproved: this.editForm.get(['isApproved']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComment>>) {
    result.subscribe((res: HttpResponse<IComment>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
