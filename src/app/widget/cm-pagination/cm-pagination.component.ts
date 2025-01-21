import { Component, EventEmitter, Input, Output } from '@angular/core';

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
}

@Component({
    selector: 'app-cm-pagination',
    templateUrl: './cm-pagination.component.html',
    styleUrls: ['./cm-pagination.component.css']
})
export class CmPaginationComponent {
    @Input() totalRecords = 0;
    @Input() recordsPerPage = 0;
    @Input() totalPages = 10;
    selectedValue: number = 1;
    selectedPageValue:number = 10;
    @Output() pageno = new EventEmitter<number>();
    @Output() perPage = new EventEmitter<number>();
    @Input() collectionSize =1;
    public pages: number[] = [];
    activePage!: number;

    ngOnChanges(): any {
        const pageCount = this.getPageCount();
        this.pages = this.getArrayOfPage(pageCount);
        this.activePage = 1;
    }

    private getPageCount(): number {
        let totalPage = 0;

        if (this.totalRecords > 0 && this.recordsPerPage > 0) {
            const pageCount = this.totalRecords / this.recordsPerPage;
            const roundedPageCount = Math.floor(pageCount);

            totalPage = roundedPageCount < pageCount ? roundedPageCount + 1 : roundedPageCount;
        }

        return totalPage;
    }

    private getArrayOfPage(pageCount: number): number[] {
        const pageArray = [];

        if (pageCount > 0) {
            for (let i = 1; i <= pageCount; i++) {
                pageArray.push(i);
            }
        }

        return pageArray;
    }

    onClickPage(pageNumber: number): void {
        if (pageNumber >= 1 && pageNumber <= this.pages.length) {
            this.activePage = pageNumber;
        }
    }
    onPageRecordsChange() {
      this.perPage.emit(this.selectedPageValue);
      //this.pageno.emit(this.selectedValue);
    }
    onPageChange() {
        this.pageno.emit(this.selectedValue);
    }

    fakeArray(length: number) {
        if (length >= 0) {
            return new Array(Math.floor(length));
        }
        else
            return new Array(1);
    }

}
