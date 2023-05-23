import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Maximum number of buttons to be shown
    const maxButtons = 6;

    let markup = '';

    if (numPages > 1) {
      if (numPages <= maxButtons) {
        // Show all buttons if there are less than or equal to `maxButtons` pages
        for (let i = 1; i <= numPages; i++) {
          markup += this._generateButtonMarkup(i, curPage);
        }
      } else {
        // Show first button
        markup += this._generateButtonMarkup(1, curPage);

        // Show dots if current page is not the first page
        if (curPage !== 1 && curPage !== 2) {
          markup += '<span class="pagination__dots">&hellip;</span>';
        }

        // Show middle buttons(last page + curpage + next page)
        let start = Math.max(2, curPage - 1);
        let end = Math.min(numPages - 1, curPage + 1);
        for (let i = start; i <= end; i++) {
          markup += this._generateButtonMarkup(i, curPage);
        }

        // Show dots if current page is not in the last page
        if (curPage < numPages && curPage !== numPages - 1) {
          markup += '<span class="pagination__dots">&hellip;</span>';
        }

        // Show last button
        markup += this._generateButtonMarkup(numPages, curPage);
      }
    }

    return markup;
  }

  _generateButtonMarkup(pageNum, curPage) {
    return `<button data-goto="${pageNum}" class="btn--inline pagination__btn--${pageNum === curPage ? 'active' : ''
      }">${pageNum}</button>`;
  }
}

export default new PaginationView();
