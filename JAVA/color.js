 document.addEventListener('DOMContentLoaded', function () {
      const boldBtn = document.getElementById('bold-btn');
      const italicBtn = document.getElementById('italic-btn');
      const underlineBtn = document.getElementById('underline-btn');
      const colorBtn = document.getElementById('color-btn');
      const colorPicker = document.getElementById('colorPicker');
      const listBtn = document.getElementById('list-btn');
      const listMenu = document.getElementById('listMenu');
      const fontSelect = document.getElementById('fontSelect');
      const noteArea = document.getElementById('note-area');

      // Selection helpers
      let savedRange = null;
      function saveSelection() {
        const sel = window.getSelection();
        if (sel && sel.rangeCount) savedRange = sel.getRangeAt(0).cloneRange();
      }
      function restoreSelection() {
        if (!savedRange) return;
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedRange);
      }

      // Keep caret updated
      ['keyup','mouseup','mouseleave','blur','focus'].forEach(evt => {
        noteArea.addEventListener(evt, saveSelection);
      });

      // Placeholder handling
      noteArea.addEventListener('focus', function () {
        if (this.textContent === 'Start writing your note here...') this.textContent = '';
      });
      noteArea.addEventListener('blur', function () {
        if (this.textContent === '') this.textContent = 'Start writing your note here...';
      });

      // Button states
      function updateButtonStates() {
        try {
          boldBtn.classList.toggle('active', document.queryCommandState('bold'));
          italicBtn.classList.toggle('active', document.queryCommandState('italic'));
          underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
        } catch (_) {}
      }
      document.addEventListener('selectionchange', function () {
        if (document.activeElement === noteArea) updateButtonStates();
      });

      function applyFormatting(command, value=null) {
        document.execCommand('styleWithCSS', false, true);
        document.execCommand(command, false, value);
        noteArea.focus(); saveSelection(); updateButtonStates();
      }

      // B / I / U
      boldBtn.addEventListener('click', () => applyFormatting('bold'));
      italicBtn.addEventListener('click', () => applyFormatting('italic'));
      underlineBtn.addEventListener('click', () => applyFormatting('underline'));

      // Color
      colorBtn.addEventListener('click', function (e) {
        e.preventDefault(); saveSelection();
        colorPicker.style.display = colorPicker.style.display === 'block' ? 'none' : 'block';
      });
      document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function (e) {
          e.preventDefault();
          const color = this.getAttribute('data-color');
          restoreSelection();
          document.execCommand('styleWithCSS', false, true);
          document.execCommand('foreColor', false, color);
          colorPicker.style.display = 'none';
          noteArea.focus(); saveSelection(); updateButtonStates();
        });
      });

      // LISTS
      // 1) Main button: quick bulleted list
     listBtn.addEventListener('click', function () {
        listMenu.style.display = listMenu.style.display === 'flex' ? 'none' : 'flex';
      });

      // Options
      document.getElementById('opt-bulleted').addEventListener('click', function () {
        restoreSelection();
        document.execCommand('insertUnorderedList', false, null);
        listMenu.style.display = 'none'; noteArea.focus(); saveSelection();
      });
      document.getElementById('opt-numbered').addEventListener('click', function () {
        restoreSelection();
        document.execCommand('insertOrderedList', false, null);
        listMenu.style.display = 'none'; noteArea.focus(); saveSelection();
      });
      document.getElementById('opt-indent').addEventListener('click', function () {
        restoreSelection();
        document.execCommand('indent', false, null);
        listMenu.style.display = 'none'; noteArea.focus(); saveSelection();
      });
      document.getElementById('opt-outdent').addEventListener('click', function () {
        restoreSelection();
        document.execCommand('outdent', false, null);
        listMenu.style.display = 'none'; noteArea.focus(); saveSelection();
      });

      // Checklist: convert current list or insert new checklist
      document.getElementById('opt-checklist').addEventListener('click', function () {
        restoreSelection();
        let anchor = window.getSelection()?.anchorNode;
        while (anchor && anchor.nodeType === 3) anchor = anchor.parentNode;
        let ul = anchor ? (anchor.closest && anchor.closest('ul, ol')) : null;

        if (!ul) {
          const html = '<ul class="checklist"><li><input type="checkbox"> Your item</li></ul>';
          document.execCommand('insertHTML', false, html);
        } else {
          if (ul.tagName.toLowerCase() === 'ol') {
            const newUl = document.createElement('ul');
            newUl.className = 'checklist';
            while (ul.firstChild) {
              const li = ul.firstChild;
              if (li.nodeType === 1 && li.tagName.toLowerCase() === 'li') {
                const first = li.firstElementChild;
                if (!(first && first.type === 'checkbox')) {
                  const cb = document.createElement('input');
                  cb.type = 'checkbox';
                  li.insertBefore(cb, li.firstChild);
                  li.insertBefore(document.createTextNode(' '), cb.nextSibling);
                }
              }
              newUl.appendChild(li);
            }
            ul.replaceWith(newUl);
          } else {
            ul.classList.add('checklist');
            ul.querySelectorAll('li').forEach(li => {
              const first = li.firstElementChild;
              if (!(first && first.type === 'checkbox')) {
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                li.insertBefore(cb, li.firstChild);
                li.insertBefore(document.createTextNode(' '), cb.nextSibling);
              }
            });
          }
        }
        listMenu.style.display = 'none'; noteArea.focus(); saveSelection();
      });

      // Font
      fontSelect.addEventListener('change', function () {
        document.execCommand('fontName', false, this.value);
        noteArea.focus(); saveSelection();
      });

      // Outside click closes popups (but not when clicking inside)
      document.addEventListener('click', function (e) {
        const clickInColor = colorBtn.contains(e.target) || colorPicker.contains(e.target);
        if (!clickInColor) colorPicker.style.display = 'none';

        const clickInListControls = listBtn.contains(e.target) || listMenu.contains(e.target);
        if (!clickInListControls) {
          listMenu.style.display = 'none';
        }
      });

      // ✅ Tab/Shift+Tab: indent/outdent in lists; else insert spaces
      noteArea.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          const sel = window.getSelection();
          let node = sel && sel.anchorNode;
          while (node && node.nodeType === 3) node = node.parentNode;
          const inList = node && (node.closest('ul, ol') != null);

          if (inList) {
            document.execCommand(e.shiftKey ? 'outdent' : 'indent', false, null);
          } else {
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
          }
          saveSelection();
        }
      });
    }); 
      

  
