// console.log('BEGIN vitae/theme/print-view.js');
function isObj(obj) {
  return (obj && typeof obj === 'object' && obj !== null) ? true : false;
}

function pushClass(el, targetClass) {
  if (isObj(el) && targetClass) {
    let elClass = el.classList;
    elClass.contains(targetClass) ? false : elClass.add(targetClass);
  }
}

function deleteClass(el, targetClass) {
  if (isObj(el) && targetClass) {
    let elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : false;
  }
}

function containsClass(el, targetClass) {
  if (isObj(el) && targetClass && el !== document) {
    return el.classList.contains(targetClass) ? true : false;
  }
}

// FIXME: Need to wait for DOM to update
// https://www.macarthur.me/posts/when-dom-updates-appear-to-be-asynchronous

const valueAfterDOMUpdate = function (callback) {
  requestAnimationFrame(() => {
    // fires before next repaint
    requestAnimationFrame(() => {
      // fires before the _next_ next repaint
      // ...which is effectively _after_ the next repaint
      return callback();
    });
  });
};

const transferOverflow = function (conf) {
  numberPages(conf);

  // Indicates if any paginationContainer has overflow
  let overflowingContainers = [];

  conf['paginationSections'].forEach(function (paginationSection) {
    paginationSection['paginationContainers'].forEach(function (el) {
      let baseElement = el['clonePages'][0];
      let overflowElement = el['clonePages'][1];

      if (conf['paginationPoliciesToPaginate'].includes(el['policy'])) {
        // Move elements from base to overflow until base no longer overflows
        // console.log('Moving direct descendants of baseElement ', baseElement, ' to overflowElement: ', overflowElement);
        let baseElementOverflow = baseElement.scrollHeight > baseElement.clientHeight;

        if (baseElementOverflow) {
          // Not done yet
          overflowingContainers.push(el);

          // Transfer the last child from the baseElement to the overflowElement
          overflowElement.prepend(baseElement.removeChild(baseElement.lastChild));
          // console.log("Moved to next page:", el);
          // console.log("LastChild: ", baseElement.lastChild);

          // Transfer any non-DOM nodes from the baseElement to the overflowElement
          while (baseElement.lastChild && baseElement.lastChild.nodeType !== 1) {
            let text = baseElement.removeChild(baseElement.lastChild);
            overflowElement.prepend(text);
          }

          // Transfer any DOM nodes that have style 'breakAfter' or 'pageBreakAfter' set to 'avoid'
          // This style should for instance be set for headings (H1, H2, ...)
          let breakAfter;
          while (baseElement.lastChild && baseElement.lastChild.nodeType === 1 && (
            (breakAfter = getComputedStyle(baseElement.lastChild).breakAfter) === 'avoid'
            || (breakAfter = getComputedStyle(baseElement.lastChild).pageBreakAfter) === 'avoid')) {
            let sibling = baseElement.removeChild(baseElement.lastChild);
            overflowElement.prepend(sibling);
            // console.log("Sibling with breakAfter=" + breakAfter + " moved to next page: " + sibling);
            // Transfer any non-DOM nodes from the baseElement to the overflowElement
            while (baseElement.lastChild && baseElement.lastChild.nodeType !== 1) {
              let text = baseElement.removeChild(baseElement.lastChild);
              overflowElement.prepend(text);
            }
          }

          // Set callback after DOM has updated to determine,
          // if any paginationContainer still has overflow
          return valueAfterDOMUpdate(function () {
            const innerConf = conf;
            return transferOverflow(innerConf);
          });
        }
        // else {
        //     console.log("No overflow on baseElement: ", baseElement);
        // }
      }
    });
  });

  if (overflowingContainers.length > 0) {
    // console.log('Pagination containers still have overflow: ', overflowingContainers);
  }
  else {
    // If we get here, none of the paginationContainers has overflow
    // Let overflow be visible
    deleteClass(conf['previewTargetElement'], conf['overflowClass']);
    numberPages(conf);
    // pushClass(conf['previewTargetElement'], conf['previewTargetElementDoneClass']);
    setPreviewStatus(conf, conf['previewStatusDone']);
    setPreviewVisibility(conf, true);
    // console.log('None of the pagination containers have overflow');
  }
};

const numberPages = function (conf) {
  let documentSections = [];
  let documentPages = [];

  conf['paginationSections'].forEach(function (paginationSection) {
    documentSections.push(paginationSection.targetPageElement);
    for (let pageIndex = 0, page = paginationSection.targetPageElement; page; ++pageIndex, page = page.nextElementSibling) {
      // pushClass(page, "page-" + pageIndex);
      documentPages.push(page);
      if (pageIndex == 0) {
        pushClass(page, "page-first");
      }
      else {
        deleteClass(page, "page-first");
      }
      if (!page.nextElementSibling) {
        pushClass(page, "page-last");
      }
      else {
        deleteClass(page, "page-last");
      }

      // Number features within all paginationContainers on page
      paginationSection['paginationContainers'].forEach(function (containerSpec, containerIndex) {
        let selector = containerSpec['selector'];
        let container = page.querySelector(selector);
        // pushClass(container, "container-" + containerIndex);
        if (containerIndex == 0) {
          pushClass(container, "container-first");
        }
        else {
          deleteClass(container, "container-first");
        }
        if (containerIndex === paginationSection['paginationContainers'].length - 1) {
          pushClass(container, "container-last");
        }
        else {
          deleteClass(container, "container-last");
        }
        for (let featureIndex = 0, feature = container.firstElementChild; feature; ++featureIndex, feature = feature.nextElementSibling) {
          // pushClass(feature, "feature-" + featureIndex);
          if (featureIndex == 0) {
            pushClass(feature, "feature-first");
          }
          else {
            deleteClass(feature, "feature-first");
          }
          if (!feature.nextElementSibling) {
            pushClass(feature, "feature-last");
          }
          else {
            deleteClass(feature, "feature-last");
          }
        }
      });
    }
  });

  // Number documentPages
  let pageNumber = 1;
  documentPages.forEach(function (page) {
    let pageNumberPlaceholder = page.querySelector('[data-page-placeholder="page-number"]');
    if (pageNumberPlaceholder) {
      pageNumberPlaceholder.innerHTML = pageNumber;
    }
    let totalPagesPlaceholder = page.querySelector('[data-page-placeholder="total-pages"]');
    if (totalPagesPlaceholder) {
      totalPagesPlaceholder.innerHTML = documentPages.length;
    }
    page.dataset.pageNumber = pageNumber++;
  });
};

const setPreviewVisibility = function (conf, visible = true) {
  if (visible) {
    conf['outermostContainer'].setAttribute(conf['printPreviewVisibleAttr'], true);
  }
  else {
    conf['outermostContainer'].removeAttribute(conf['printPreviewVisibleAttr']);
  }
};

const togglePreview = function (conf, reset = false) {
  // Determine if print preview has been rendered
  if (reset || (!isPreviewReadyToRender(conf) && !isPreviewRendered(conf))) {
    initializePrintPreview(conf);
    preparePrintPreview(conf);
  }
  else if (!isPreviewRendered(conf)) {
    renderPrintPreview(conf);
  }
  else {
    // Determine if print preview is visible
    const visible = isPreviewVisible(conf);
    setPreviewVisibility(conf, !visible);
  }
};

const isPreviewVisible = function (conf) {
  if (conf['outermostContainer'].getAttribute(conf['printPreviewVisibleAttr']) === 'true') {
    return true;
  }
  return false;
};

const setPreviewStatus = function (conf, status) {
  if (status) {
    conf['outermostContainer'].setAttribute(conf['printPreviewStatusAttr'], status);
  }
  else {
    conf['outermostContainer'].removeAttribute(conf['printPreviewStatusAttr']);
  }
};

const isPreviewReadyToRender = function (conf) {
  if (conf['outermostContainer'].getAttribute(conf['printPreviewStatusAttr']) === conf['previewStatusReady']) {
    return true;
  }
  return false;
};

// const isPreviewReadyToRender = function (conf) {
//     if (containsClass(conf['previewTargetElement'], conf['previewTargetElementReadyClass'])) {
//         return true;
//     }
//     return false;
// };

const isPreviewRendered = function (conf) {
  if (conf['outermostContainer'].getAttribute(conf['printPreviewStatusAttr']) === conf['previewStatusDone']) {
    return true;
  }
  return false;
};

// const isPreviewRendered = function (conf) {
//     if (containsClass(conf['previewTargetElement'], conf['previewTargetElementDoneClass'])) {
//         return true;
//     }
//     return false;
// };

const requestPrintViewPrepared = function (conf) {
  // If conf['requestPrintViewPrepared'] appears in the class list,
  // prepare print preview automatically on page load
  if (containsClass(conf['previewTargetElement'], conf['requestPrintViewPrepared'])) {
    // Run automatically
    return true;
  }
  return false;
};

const requestPrintViewRendered = function (conf) {
  // If "auto" appears in the class list, activate print preview automatically
  if (containsClass(conf['previewTargetElement'], conf['requestPrintViewRendered'])) {
    // Run automatically
    return true;
  }
  return false;
};

const preparePrintPreview = function (conf) {
  // We need print preview to be rendered (not 'display: none') to determine if there is overflow
  setPreviewVisibility(conf, true);

  conf['paginationSections'].forEach(function (paginationSection) {
    let overflowingContainers = [];
    let paginationContainers = paginationSection['paginationContainers'];
    let targetPageElement = paginationSection['targetPageElement'];
    paginationContainers.forEach(function (el) {
      let baseElement = targetPageElement.querySelector(el['selector']);
      if (baseElement.scrollHeight > baseElement.clientHeight) {
        overflowingContainers.push(el);
      }
      // Keep reference to baseElement
      el['clonePages'] = [baseElement];
    });

    if (overflowingContainers.length > 0) {
      let overflowPage = targetPageElement.cloneNode(true);
      paginationSection['targetSectionElement'].appendChild(overflowPage);

      paginationContainers.forEach(function (el) {
        el['clonePages'].push(overflowPage.querySelector(el['selector']));

        let overflowElement = el['clonePages'][1];

        // Remove all elements from the pagination columns on the clonePages page
        while (overflowElement.firstChild) {
          overflowElement.removeChild(overflowElement.lastChild);
        }
      });

      paginationContainers.forEach(function (el) {
        el['clonePages'].push(overflowPage.querySelector(el['selector']));
      });
    }
  });
  numberPages(conf);
  // pushClass(conf['previewTargetElement'], conf['previewTargetElementReadyClass']);
  setPreviewStatus(conf, conf['previewStatusReady']);
};

const initializePrintPreview = function (conf) {
  setPreviewVisibility(conf, false);
  setPreviewStatus(conf, null);
  // Start with a clean slate: remove all nodes in previewTargetElement
  while (conf['previewTargetElement'].firstChild) {
    conf['previewTargetElement'].removeChild(conf['previewTargetElement'].lastChild);
  }

  // Ensure overflow is visible
  pushClass(conf['previewTargetElement'], conf['overflowClass']);

  conf['paginationSections'].forEach(function (paginationSection) {
    let targetSectionElement = paginationSection['originalSectionElement'].cloneNode(true);
    targetSectionElement.removeAttribute("id");
    paginationSection['targetSectionElement'] = targetSectionElement;
    paginationSection['targetPageElement'] = targetSectionElement.querySelector(conf['paginationPageSelector']);
    conf['previewTargetElement'].appendChild(targetSectionElement);
  });
};

const renderPrintPreview = function (conf, reset = false) {
  if (reset || !isPreviewReadyToRender(conf)) {
    initializePrintPreview(conf);
    preparePrintPreview(conf);
  }
  transferOverflow(conf);
};

// This function must only be called once
const init = function (reset) {
  const previewTargetElement = document.querySelector('#printPreviewTarget');
  // If there is no previewTargetElement, this means that this page does
  // not render a print view
  if (!previewTargetElement) {
    return;
  }

  let conf = {
    outermostContainer: document.querySelector('#vitaeContainer'),
    originalContainer: document.querySelector("#contentContainer"),
    previewContainer: document.querySelector('#printPreviewContainer'),

    previewTargetElement: previewTargetElement,

    printControl: document.querySelector('#printPreviewNav'),
    previewButton: document.querySelector('#printPreviewToggle'),
    printButton: document.querySelector('#printButton'),

    printPreviewVisibleAttr: "data-print-preview-visible",
    printPreviewStatusAttr: "data-print-preview-status",
    previewStatusReady: "readyToRender",
    previewStatusDone: "done",

    printPreviewClass: "print-preview",
    printPreviewActiveBodyClass: "print-preview_active",
    overflowClass: 'print-preview_overflow',
    requestPrintViewPrepared: "preview-prepare",
    requestPrintViewRendered: "preview-render",

    paginationSectionSelector: ".pagination-section",
    paginationPageSelector: ".pagination-page",

    paginationContainerSelector: ".pagination-container",
    paginationOrderAttr: "data-pagination-order",
    paginationPolicyAttr: "data-pagination-policy",

    paginationPoliciesToPaginate: ["break"],
  };

  let paginationSections = [];
  const paginationSectionElements = document.querySelectorAll(conf['paginationSectionSelector']);
  paginationSectionElements.forEach(function (paginationSection) {
    // FIXME: There must be only one Pagination Page
    const paginationPages = paginationSection.querySelectorAll(conf['paginationPageSelector']);
    if (paginationPages.length > 1) {
      console.log('Fatal error: ' + paginationPages.length
        + ' elements match ' + conf['paginationPageSelector']
        + '. Part: ', paginationSection);
      return;
    }
    const paginationPage = paginationPages[0];
    let paginationContainers = [];

    const containerElements = paginationPage.querySelectorAll(conf['paginationContainerSelector']);
    containerElements.forEach(function (el, idx) {
      const policy = el.getAttribute(conf['paginationPolicyAttr']);
      if (conf['paginationPoliciesToPaginate'].includes(policy)) {
        paginationContainers.push({
          'order': el.getAttribute(conf['paginationOrderAttr']),
          'policy': policy,
          'selector': '.' + el.className.split(' ').join('.'),
          'originalContainer': el,
        });
      }
    });
    paginationContainers.sort((a, b) => (a.order > b.order) ? 1 : -1);
    paginationSections.push({
      'originalSectionElement': paginationSection,
      'originalPageElement': paginationPage,
      'paginationContainers': paginationContainers,
    });
  });

  conf['paginationSections'] = paginationSections;

  // Add OnClick handler on print preview button to generate print preview
  if (conf['previewButton']) {
    conf['previewButton'].addEventListener('click', _e => {
      // console.log('previewButton pressed with shiftKey=', _e.shiftKey);
      togglePreview(conf, _e.shiftKey);
    });
  }

  // Add OnClick handler on print button to ... print
  if (conf['printButton']) {
    conf['printButton'].addEventListener('click', _e => window.print());
  }

  // console.log("pagination_preview.js: Found required DOM elements:"
  //     + " conf['outermostContainer'] = " + (typeof conf['outermostContainer'] === "undefined" ? undefined : conf['outermostContainer'])
  //     + " conf['originalContainer'] = " + (typeof conf['originalContainer'] === "undefined" ? undefined : conf['originalContainer'])
  //     + " conf['previewTargetElement'] = " + (typeof conf['previewTargetElement'] === "undefined" ? undefined : conf['previewTargetElement'])
  //     + " previewButton = " + (typeof conf['previewButton'] === "undefined" ? undefined : conf['previewButton'])
  //     + " printButton = " + (typeof conf['printButton'] === "undefined" ? undefined : conf['printButton'])
  // );
  // initializePrintPreview(conf);
  initializePrintPreview(conf);
  if (requestPrintViewPrepared(conf)) {
    // initializePrintPreview(conf);
    preparePrintPreview(conf);
  }
  else if (requestPrintViewRendered(conf)) {
    // console.log("Automatic print preview: " + conf['requestPrintViewRendered']);
    // initializePrintPreview(conf);
    renderPrintPreview(conf, true);
  }
};

document.addEventListener("DOMContentLoaded", _e => init());

// console.log('END   vitae/theme/print-view.js');
