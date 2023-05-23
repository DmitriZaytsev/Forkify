import View from './View.js';

class BookmarksDel extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it)';
    _message = 'Bookmarks was successfully removed!';
    _confirmMsg = 'Do you want delete all bookmarks?';
    _delButton = document.querySelector('.bookmarks__delete--btn');


    addHandlerBookmarksDel(handler) {
        this._delButton.addEventListener('click', handler)
    }

}

export default new BookmarksDel();
