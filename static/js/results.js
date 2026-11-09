/* Table 1 of the paper: Recognition (%) on 5,507 MME-Emotion items, and the
   interactive bar chart in the Results section. */
(function () {
  'use strict';

  var TASKS = ['ER-Lab', 'ER-Wild', 'SA', 'Noise-ER', 'FG-ER', 'ML-ER', 'FG-SA', 'IR'];
  var SEEN_COUNT = 3;

  var CONDITIONS = [
    { key: 'video', name: 'Video', note: '1 call', color: 'var(--video)' },
    { key: 'audio', name: 'Audio', note: '1 call', color: 'var(--audio-mark)' },
    { key: 'shared', name: 'Shared', note: '4 calls', color: 'var(--shared)' },
    { key: 'luna', name: 'MHE', note: 'GPT-5.6 Luna', color: 'var(--mhe)' },
    { key: 'sol', name: 'MHE', note: 'GPT-6.1 Sol', color: 'var(--sol)' }
  ];

  // tasks: 8 task scores; seen / held / macro summaries; ci: 95% interval of macro.
  // macroDelta: the paper's macro contrasts, computed from unrounded scores
  // (Audio vs Video, Shared vs Audio, each MHE harness vs Shared).
  var STUDENTS = [
    {
      key: 'qwen3vl8b', name: 'Qwen3-VL-8B', short: 'VL-8B',
      macroDelta: { audio: 9.20, shared: 1.32, luna: 0.21, sol: 0.06 },
      rows: {
        video: { tasks: [8.5, 36.2, 41.4, 56.4, 23.6, 38.8, 13.2, 21.5], seen: 28.7, held: 30.7, macro: 29.95, ci: [28.8, 31.1] },
        audio: { tasks: [23.2, 38.0, 63.3, 65.0, 19.2, 41.7, 30.8, 32.0], seen: 41.5, held: 37.7, macro: 39.15, ci: [37.8, 40.5] },
        shared: { tasks: [28.8, 35.5, 59.9, 56.6, 26.1, 48.9, 26.7, 41.2], seen: 41.4, held: 39.9, macro: 40.47, ci: [39.0, 41.9] },
        luna: { tasks: [29.4, 35.0, 60.6, 57.2, 26.2, 48.7, 27.8, 40.6], seen: 41.7, held: 40.1, macro: 40.68, ci: [39.2, 42.1] },
        sol: { tasks: [28.2, 35.7, 60.5, 56.4, 26.4, 49.1, 26.7, 41.2], seen: 41.5, held: 40.0, macro: 40.52, ci: [39.1, 41.9] }
      }
    },
    {
      key: 'qwen3vl4b', name: 'Qwen3-VL-4B', short: 'VL-4B',
      macroDelta: { audio: 9.00, shared: -0.79, luna: 0.95, sol: 0.25 },
      rows: {
        video: { tasks: [8.5, 34.7, 42.6, 51.8, 21.9, 36.9, 11.1, 27.6], seen: 28.6, held: 29.9, macro: 29.39, ci: [28.2, 30.6] },
        audio: { tasks: [18.6, 37.0, 63.8, 61.4, 20.8, 39.4, 35.1, 31.0], seen: 39.8, held: 37.5, macro: 38.39, ci: [37.0, 39.7] },
        shared: { tasks: [22.6, 35.6, 65.6, 57.4, 17.7, 45.4, 20.8, 35.7], seen: 41.3, held: 35.4, macro: 37.60, ci: [36.2, 39.0] },
        luna: { tasks: [23.7, 35.7, 65.7, 58.6, 18.4, 46.4, 21.9, 37.9], seen: 41.7, held: 36.7, macro: 38.56, ci: [37.2, 39.9] },
        sol: { tasks: [23.2, 35.9, 65.8, 57.8, 18.1, 45.5, 20.8, 35.7], seen: 41.6, held: 35.6, macro: 37.85, ci: [36.5, 39.2] }
      }
    },
    {
      key: 'qwen35', name: 'Qwen3.5-4B', short: 'Q3.5',
      macroDelta: { audio: 5.38, shared: 2.23, luna: 0.00, sol: 0.03 },
      retainedLuna: true,
      rows: {
        video: { tasks: [14.1, 38.1, 38.3, 46.8, 20.7, 46.7, 6.1, 26.2], seen: 30.2, held: 29.3, macro: 29.62, ci: [28.4, 30.8] },
        audio: { tasks: [20.3, 38.2, 56.1, 51.2, 20.8, 39.2, 21.7, 32.5], seen: 38.2, held: 33.1, macro: 34.99, ci: [33.7, 36.4] },
        shared: { tasks: [29.9, 33.4, 60.6, 45.6, 23.8, 45.7, 24.9, 33.9], seen: 41.3, held: 34.8, macro: 37.23, ci: [35.8, 38.6] },
        luna: { tasks: [29.9, 33.4, 60.6, 45.6, 23.8, 45.7, 24.9, 33.9], seen: 41.3, held: 34.8, macro: 37.23, ci: [35.8, 38.6] },
        sol: { tasks: [29.9, 33.6, 60.6, 45.6, 23.8, 45.7, 24.9, 33.9], seen: 41.4, held: 34.8, macro: 37.25, ci: [35.8, 38.6] }
      }
    },
    {
      key: 'gemma4', name: 'Gemma-4-E4B', short: 'Gemma',
      macroDelta: { audio: 10.71, shared: 2.54, luna: -0.07, sol: 0.11 },
      rows: {
        video: { tasks: [9.0, 30.8, 39.8, 41.0, 25.1, 36.0, 9.1, 25.4], seen: 26.6, held: 27.3, macro: 27.03, ci: [25.8, 28.2] },
        audio: { tasks: [27.1, 33.4, 61.2, 52.4, 20.2, 40.4, 32.8, 34.5], seen: 40.6, held: 36.1, macro: 37.74, ci: [36.3, 39.2] },
        shared: { tasks: [29.4, 31.0, 64.9, 47.4, 26.0, 47.2, 38.8, 37.5], seen: 41.7, held: 39.4, macro: 40.28, ci: [38.8, 41.7] },
        luna: { tasks: [29.4, 31.5, 64.5, 47.2, 26.0, 47.6, 38.6, 36.9], seen: 41.8, held: 39.3, macro: 40.21, ci: [38.8, 41.7] },
        sol: { tasks: [29.4, 31.1, 64.2, 46.6, 25.9, 48.5, 39.7, 37.7], seen: 41.6, held: 39.7, macro: 40.39, ci: [38.9, 41.9] }
      }
    }
  ];

  var METRICS = [
    { key: 'macro', label: 'Macro', title: 'Task-macro Recognition (%), mean of the eight task types', digits: 2 },
    { key: 'seen', label: 'Seen types', title: 'Recognition (%) on the three seen task types', digits: 1 },
    { key: 'held', label: 'Held-out types', title: 'Recognition (%) on the five held-out task types', digits: 1 }
  ];

  var AXIS_MAX = 50;
  var TICKS = [0, 10, 20, 30, 40, 50];

  var BASE = { audio: 'video', shared: 'audio', luna: 'shared', sol: 'shared' };
  var BASE_NAME = { video: 'Video', audio: 'Audio', shared: 'Shared' };

  function fmt(value, digits) { return value.toFixed(digits); }

  // Contrast of a condition with the one below it on the ladder.
  function delta(student, conditionKey, metricKey) {
    if (metricKey === 'macro') { return student.macroDelta[conditionKey]; }
    var rows = student.rows;
    return rows[conditionKey][metricKey] - rows[BASE[conditionKey]][metricKey];
  }
  function signed(value, digits) {
    var text = Math.abs(value).toFixed(digits);
    if (Number(text) === 0) { return '0.' + '0'.repeat(digits); }
    return (value > 0 ? '+' : '−') + text;
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (name) {
      if (name === 'text') { node.textContent = attrs[name]; }
      else if (name === 'style') { node.setAttribute('style', attrs[name]); }
      else { node.setAttribute(name, attrs[name]); }
    });
    (children || []).forEach(function (child) { if (child) { node.appendChild(child); } });
    return node;
  }

  function conditionLabel(condition, student) {
    var retained = student.retainedLuna && condition.key === 'luna';
    return condition.name + (condition.key === 'luna' || condition.key === 'sol' ? ' (' + condition.note + ')' : '') + (retained ? ', retained scaffold' : '');
  }

  function buildSegmented(container, items, selectedKey, onSelect) {
    container.textContent = '';
    items.forEach(function (item) {
      var button = el('button', {
        type: 'button', role: 'radio', 'data-key': item.key,
        'aria-checked': String(item.key === selectedKey),
        tabindex: item.key === selectedKey ? '0' : '-1',
        text: item.label
      });
      button.addEventListener('click', function () { onSelect(item.key); });
      container.appendChild(button);
    });
    container.addEventListener('keydown', function (event) {
      var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(event.key in keys)) { return; }
      event.preventDefault();
      var buttons = Array.prototype.slice.call(container.querySelectorAll('button'));
      var index = buttons.indexOf(document.activeElement);
      var next = buttons[(index + keys[event.key] + buttons.length) % buttons.length];
      next.focus();
      next.click();
    });
  }

  function syncSegmented(container, selectedKey) {
    container.querySelectorAll('button').forEach(function (button) {
      var on = button.getAttribute('data-key') === selectedKey;
      button.setAttribute('aria-checked', String(on));
      button.setAttribute('tabindex', on ? '0' : '-1');
    });
  }

  function init() {
    var card = document.getElementById('recognition-chart');
    if (!card) { return; }
    var state = { student: STUDENTS[0].key, metric: 'macro' };
    var studentControl = card.querySelector('[data-control="student"]');
    var metricControl = card.querySelector('[data-control="metric"]');
    var barsNode = card.querySelector('.bars');
    var titleNode = card.querySelector('.chart-title');
    var summaryNode = card.querySelector('.chart-note');
    var tooltip = card.querySelector('.chart-tooltip');
    var thead = card.querySelector('.results-table thead');
    var tbody = card.querySelector('.results-table tbody');

    // Axis ticks, aligned with the bar track column.
    var axis = card.querySelector('.bar-axis');
    var ticks = el('div', { class: 'bar-ticks' });
    TICKS.forEach(function (t) { ticks.appendChild(el('span', { style: '--x:' + t, text: String(t) })); });
    axis.appendChild(el('span'));
    axis.appendChild(ticks);

    // One persistent row per condition so widths animate between selections.
    var rowNodes = CONDITIONS.map(function (condition) {
      var row = el('div', { class: 'bar-row', tabindex: '0', style: '--c:' + condition.color });
      var nameNode = el('span', { class: 'bar-name' }, [el('span', { class: 'swatch', 'aria-hidden': 'true' })]);
      var nameText = el('span', { text: condition.name });
      var small = el('small', { text: condition.note });
      nameText.appendChild(small);
      nameNode.appendChild(nameText);
      var value = el('span', { class: 'bar-val' });
      var track = el('span', { class: 'bar-track' }, [el('span', { class: 'bar' }), el('span', { class: 'whisker' }), value]);
      row.appendChild(nameNode);
      row.appendChild(track);
      barsNode.appendChild(row);
      return { condition: condition, row: row, small: small, value: value, whisker: track.querySelector('.whisker') };
    });

    function currentStudent() { return STUDENTS.filter(function (s) { return s.key === state.student; })[0]; }
    function currentMetric() { return METRICS.filter(function (m) { return m.key === state.metric; })[0]; }

    function tooltipLines(student, condition) {
      var row = student.rows[condition.key];
      var metric = currentMetric();
      var lines = [metric.label + ': ' + fmt(row[metric.key], metric.digits) + '%'];
      if (metric.key === 'macro') { lines.push('95% CI: ' + fmt(row.ci[0], 1) + ' to ' + fmt(row.ci[1], 1)); }
      if (condition.key !== 'video') {
        lines.push('vs ' + BASE_NAME[BASE[condition.key]] + ': ' + signed(delta(student, condition.key, metric.key), metric.digits) + ' pp');
      }
      if (student.retainedLuna && condition.key === 'luna') { lines.push('No candidate passed the gates'); }
      return lines;
    }

    function showTooltip(entry, anchor) {
      var student = currentStudent();
      tooltip.textContent = '';
      tooltip.appendChild(el('strong', { text: conditionLabel(entry.condition, student) }));
      tooltipLines(student, entry.condition).forEach(function (line) { tooltip.appendChild(el('span', { text: line })); });
      tooltip.hidden = false;
      var cardBox = card.getBoundingClientRect();
      var box = anchor.getBoundingClientRect();
      var left = Math.min(box.right - cardBox.left + 10, cardBox.width - tooltip.offsetWidth - 10);
      var top = box.top - cardBox.top - tooltip.offsetHeight - 6;
      if (left < box.left - cardBox.left) { top = box.bottom - cardBox.top + 6; left = Math.max(10, box.left - cardBox.left); }
      tooltip.style.left = Math.max(10, left) + 'px';
      tooltip.style.top = Math.max(4, top) + 'px';
    }
    function hideTooltip() { tooltip.hidden = true; }

    rowNodes.forEach(function (entry) {
      var bar = entry.row.querySelector('.bar');
      entry.row.addEventListener('mouseenter', function () { showTooltip(entry, bar); });
      entry.row.addEventListener('mouseleave', hideTooltip);
      entry.row.addEventListener('focus', function () { showTooltip(entry, bar); });
      entry.row.addEventListener('blur', hideTooltip);
    });

    function renderBars() {
      var student = currentStudent();
      var metric = currentMetric();
      titleNode.textContent = metric.title + ', ' + student.name;
      rowNodes.forEach(function (entry) {
        var row = student.rows[entry.condition.key];
        var v = row[metric.key];
        entry.row.style.setProperty('--v', String(v));
        entry.row.style.setProperty('--end', String(metric.key === 'macro' ? Math.max(v, row.ci[1]) : v));
        entry.value.textContent = fmt(v, metric.digits);
        var retained = student.retainedLuna && entry.condition.key === 'luna';
        entry.small.textContent = entry.condition.note + (retained ? ' †' : '');
        entry.row.setAttribute('aria-label', conditionLabel(entry.condition, student) + ': ' + fmt(v, metric.digits) + ' percent' +
          (metric.key === 'macro' ? ', 95% interval ' + fmt(row.ci[0], 1) + ' to ' + fmt(row.ci[1], 1) : ''));
        if (metric.key === 'macro') {
          entry.whisker.style.display = '';
          entry.whisker.style.setProperty('--lo', String(row.ci[0]));
          entry.whisker.style.setProperty('--hi', String(row.ci[1]));
        } else {
          entry.whisker.style.display = 'none';
        }
      });
      var k = metric.key;
      var d = metric.digits;
      function dd(key) { return signed(delta(student, key, k), d); }
      summaryNode.textContent = student.name + ': Audio adds ' + dd('audio') +
        ' points over Video, Shared ' + dd('shared') + ' over Audio, and the evolved harnesses ' +
        dd('luna') + ' (Luna) and ' + dd('sol') + ' (Sol) over Shared.' +
        (k === 'macro' ? ' Whiskers: 95% task-stratified bootstrap intervals.' : ' Differences of the rounded scores shown.') +
        (student.retainedLuna ? ' † The Luna run promoted no edit, so its harness equals Shared.' : '');
    }

    function renderTable() {
      var student = currentStudent();
      thead.textContent = '';
      tbody.textContent = '';
      var head = el('tr', {}, [el('th', { scope: 'col', text: 'Condition' })]);
      TASKS.forEach(function (task, i) {
        head.appendChild(el('th', { scope: 'col', class: i === SEEN_COUNT ? 'group-gap' : '', text: task }));
      });
      ['Seen', 'Held-out', 'Macro'].forEach(function (label, i) {
        head.appendChild(el('th', { scope: 'col', class: 'col-sum' + (i === 0 ? ' group-gap' : ''), text: label }));
      });
      thead.appendChild(head);

      // Unique best per column (ties unmarked), as in the paper.
      function bestIndex(values) {
        var max = Math.max.apply(null, values);
        var hits = values.filter(function (v) { return v === max; }).length;
        return hits === 1 ? values.indexOf(max) : -1;
      }
      var columns = TASKS.map(function (_, i) { return CONDITIONS.map(function (c) { return student.rows[c.key].tasks[i]; }); });
      columns.push(CONDITIONS.map(function (c) { return student.rows[c.key].seen; }));
      columns.push(CONDITIONS.map(function (c) { return student.rows[c.key].held; }));
      columns.push(CONDITIONS.map(function (c) { return student.rows[c.key].macro; }));
      var best = columns.map(bestIndex);

      CONDITIONS.forEach(function (condition, rowIndex) {
        var row = student.rows[condition.key];
        var isMhe = condition.key === 'luna' || condition.key === 'sol';
        var label = isMhe ? 'MHE, ' + condition.note.replace('GPT-', 'GPT‑') : condition.name;
        if (student.retainedLuna && condition.key === 'luna') { label += ' †'; }
        var tr = el('tr', { class: isMhe ? 'row-mhe' : '' }, [el('th', { scope: 'row', text: label })]);
        var values = row.tasks.concat([row.seen, row.held, row.macro]);
        values.forEach(function (value, colIndex) {
          var digits = colIndex === values.length - 1 ? 2 : 1;
          var cls = [];
          if (colIndex === SEEN_COUNT || colIndex === TASKS.length) { cls.push('group-gap'); }
          if (colIndex >= TASKS.length) { cls.push('col-sum'); }
          var td = el('td', { class: cls.join(' ') });
          if (best[colIndex] === rowIndex) { td.appendChild(el('b', { text: fmt(value, digits) })); }
          else { td.textContent = fmt(value, digits); }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }

    function render() {
      syncSegmented(studentControl, state.student);
      syncSegmented(metricControl, state.metric);
      renderBars();
      renderTable();
    }

    buildSegmented(studentControl, STUDENTS.map(function (s) { return { key: s.key, label: s.name }; }), state.student, function (key) {
      state.student = key; hideTooltip(); render();
    });
    buildSegmented(metricControl, METRICS, state.metric, function (key) {
      state.metric = key; hideTooltip(); render();
    });
    render();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();
