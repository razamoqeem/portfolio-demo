/* AMK Digital Agency Website — title generator.
   Runs fully in the browser: fixed sentence patterns filled with the visitor's
   keyword. No AI, no server, no limit. Returns plain text; callers must insert
   it with textContent (never innerHTML). */
(function () {
  'use strict';

  var SMALL_WORDS = ['a', 'an', 'the', 'and', 'or', 'but', 'for', 'of', 'to', 'in', 'on', 'with', 'vs'];

  function titleCase(text) {
    return String(text).trim().split(/\s+/).map(function (word, index) {
      if (index !== 0 && SMALL_WORDS.indexOf(word.toLowerCase()) !== -1) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  /**
   * @param {{keyword:string, audience?:string, contentType?:string, secondary?:string[]}} input
   * @returns {{category:string, title:string, length:number, tooLong:boolean}[]}
   */
  function generateTitles(input) {
    var keyword = (input && input.keyword ? String(input.keyword) : '').trim();
    if (!keyword) return [];

    var k = titleCase(keyword);
    var year = new Date().getFullYear();
    var audience = (input.audience || '').trim();
    var aud = audience ? ' for ' + titleCase(audience) : '';
    var type = (input.contentType || 'blog').toLowerCase();

    var titles = [
      ['How-To', 'How to ' + k + ': A Step-by-Step Guide (' + year + ')'],
      ['Listicle', '10 Best ' + k + ' Strategies' + aud + ' in ' + year],
      ['Guide', 'The Complete Guide to ' + k + aud],
      ['Question', 'What Is ' + k + '? Everything You Need to Know'],
      ['Comparison', k + ': Which Approach Is Right' + aud + '?'],
      ['Practical', k + ': Practical Tactics You Can Apply Today'],
      ['Beginner', k + ' for Beginners: Start Here'],
      ['Trends', 'Top ' + k + ' Trends to Watch in ' + year],
      ['Listicle', '7 ' + k + ' Mistakes to Avoid (and How to Fix Them)'],
      ['Checklist', 'The ' + k + ' Checklist' + aud]
    ];

    if (type === 'case-study' || type === 'case study' || type === 'landing') {
      titles.unshift(['Landing', k + aud + ': What You Get and How It Works']);
    }

    var secondary = (input.secondary || []).filter(Boolean);
    if (secondary.length) {
      titles.push(['Semantic', k + ' & ' + titleCase(secondary[0]) + ': The ' + year + ' Playbook']);
    }

    return titles.map(function (pair) {
      return { category: pair[0], title: pair[1], length: pair[1].length, tooLong: pair[1].length > 60 };
    });
  }

  /** Render results safely into a container element. */
  function renderTitles(container, results) {
    container.textContent = '';
    if (!results.length) return;

    results.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'tool-result-item';

      var left = document.createElement('div');
      var tag = document.createElement('span');
      tag.className = 'tool-result-tag';
      tag.textContent = item.category;
      var text = document.createElement('p');
      text.className = 'title-result-text';
      text.textContent = item.title;
      var count = document.createElement('small');
      count.className = 'title-result-count' + (item.tooLong ? ' is-long' : '');
      count.textContent = item.length + ' characters' + (item.tooLong ? ' (may be cut off in search results)' : '');
      left.appendChild(tag);
      left.appendChild(text);
      left.appendChild(count);

      var copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'tool-copy-btn';
      copy.textContent = 'Copy';
      copy.addEventListener('click', function () {
        var done = function () {
          copy.textContent = 'Copied';
          setTimeout(function () { copy.textContent = 'Copy'; }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(item.title).then(done, function () {});
        }
      });

      row.appendChild(left);
      row.appendChild(copy);
      container.appendChild(row);
    });
  }

  window.AMKTitleGenerator = { generateTitles: generateTitles, renderTitles: renderTitles };
})();
