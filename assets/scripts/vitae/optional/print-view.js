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
  // Indicates if any paginationContainer has overflow
  let overflowingContainers = [];

  conf['parts'].forEach(function (part) {
    part['pages'].forEach(function (page) {

      const targetPageElement = page['targetPageElement'];
      const paginationContainers = page['paginationContainers'];
      let pageOverflowingContainers = [];
      // Do the preparation steps formerly done in preparePrintPreview(conf)
      if (!page['paginatedPageElements']) {
        // The targetPageElement is the copy of this page in the previewTarget

        let overflowingContainers = [];

        // paginatedPageElements is a list of all pages that represent the page
        page['paginatedPageElements'] = [targetPageElement];

        paginationContainers.forEach(function (el) {
          let baseElement = targetPageElement.querySelector(el['selector']);
          if (baseElement.scrollHeight > baseElement.clientHeight) {
            overflowingContainers.push(el);
          }

          // Keep reference to baseElement
          el['clonePages'] = [baseElement];
        });

        if (overflowingContainers.length > 0) {
          const overflowPage = targetPageElement.cloneNode(false);
          page['paginatedPageElements'].push(overflowPage);

          const parent = page['targetPageElement'].parentNode;
          parent.insertBefore(overflowPage, page['targetPageElement'].nextSibling);

          paginationContainers.forEach(function (el) {
            const deepClone = el.policy == "clone";
            const overflowContainer = el.originalContainer.cloneNode(deepClone);
            overflowPage.appendChild(overflowContainer);
            el['clonePages'].push(overflowContainer);
          });
        }
      }

      const paginatedPageElements = page['paginatedPageElements'];
      paginatedPageElements.forEach(function (paginatedPage, paginatedPageIdx) {
        paginationContainers.forEach(function (el, idx) {
          const baseElement = el['clonePages'][paginatedPageIdx];
          let overflowElement = null;
          if (paginatedPageIdx < el['clonePages'].length) {
            overflowElement = el['clonePages'][paginatedPageIdx + 1];
          }


          if (conf['paginationPoliciesToPaginate'].includes(el['policy'])) {
            // Move elements from base to overflow until base no longer overflows
            let baseElementOverflow = baseElement.scrollHeight > baseElement.clientHeight;

            if (baseElementOverflow) {
              // Not done yet
              overflowingContainers.push(el);

              if (!overflowElement) {
                // console.log('Element', baseElement, ' still has overflow but overflowElement is ', overflowElement);
                pageOverflowingContainers.push(el);
                return;
              }

              // Transfer the last child from the baseElement to the overflowElement
              overflowElement.prepend(baseElement.removeChild(baseElement.lastChild));

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

              // Re-number components after having them transferred between base and overflow page
              for (let componentIndex = 0, component = baseElement.firstElementChild; component; ++componentIndex, component = component.nextElementSibling) {
                // pushClass(component, "component_" + componentIndex);
                if (componentIndex == 0) {
                  pushClass(component, "component_first");
                }
                else if (component.classList.contains("component_first")) {
                  component.classList.remove("component_first");
                }
                if (!component.nextElementSibling) {
                  pushClass(component, "component_last");
                }
                else if (component.classList.contains("component_last")) {
                  component.classList.remove("component_last");
                }
              }

              // Set callback after DOM has updated to determine,
              // if any paginationContainer still has overflow
              return valueAfterDOMUpdate(function () {
                const innerConf = conf;
                return transferOverflow(innerConf);
              });
            }
            else {
              // console.log("No overflow on baseElement: ", baseElement);
            }
          }
        });

        if (pageOverflowingContainers.length > 0) {
          if (paginatedPageElements.length > conf['maxNumPages']) {
            return;
          }
          const overflowPage = targetPageElement.cloneNode(false);
          paginatedPageElements.push(overflowPage);

          const parent = page['targetPageElement'].parentNode;
          // parent.insertBefore(overflowPage, page['targetPageElement'].nextSibling);
          parent.insertBefore(overflowPage, paginatedPageElements[paginatedPageElements.length - 1].nextSibling);

          paginationContainers.forEach(function (el) {
            const deepClone = el.policy == "clone";
            const overflowContainer = el.originalContainer.cloneNode(deepClone);
            overflowPage.appendChild(overflowContainer);
            el['clonePages'].push(overflowContainer);
          });
          // Set callback after DOM has updated to determine,
          // if any paginationContainer on subsequent pages still has overflow
          return valueAfterDOMUpdate(function () {
            const innerConf = conf;
            return transferOverflow(innerConf);
          });
        }
      });
    });
  });

  if (overflowingContainers.length > 0) {
    // console.log('Pagination containers still have overflow: ', overflowingContainers);
  }
  else {
    // If we get here, none of the paginationContainers has overflow
    numberPages(conf);
    // Let overflow be visible
    setPreviewStatus(conf, conf['previewStatusDone']);
    setPreviewVisibility(conf, true);
    // console.log('None of the pagination containers have overflow');
  }
};

const numberPages = function (conf) {
  let documentSections = [];
  let documentPages = [];

  conf['parts'].forEach(function (part) {
    documentSections.push(part.targetPageElement);
    for (let pageIndex = 0; pageIndex < part['pages'].length; pageIndex++) {
      const page = part['pages'][pageIndex];
      for (let pageElementIndex = 0; pageElementIndex < page['paginatedPageElements'].length; pageElementIndex++) {
        const pageElement = page['paginatedPageElements'][pageElementIndex];
        // Check if any pagination container on this page has any children
        let numPageElements = 0;
        const paginationContainers = Array.from(pageElement.querySelectorAll(conf['paginationContainerSelector']))
        paginationContainers.map( container => numPageElements += container.children.length);
        if (numPageElements == 0) {
          // Remove empty page element from the array
          page['paginatedPageElements'].splice(pageElementIndex, 1);
          pageElementIndex--;
          pageElement.remove();
          continue;
        }
        documentPages.push(pageElement);
        if (pageIndex == 0) {
          pushClass(pageElement, "page-first");
        }
        else {
          deleteClass(pageElement, "page-first");
        }
        if (!pageElement.nextElementSibling) {
          pushClass(pageElement, "page-last");
        }
        else {
          deleteClass(pageElement, "page-last");
        }
      }
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
  const resetPreview = reset || (!isPreviewReadyToRender(conf) && !isPreviewRendered(conf));
  if (resetPreview) {
    preparePrintPreview(conf, resetPreview);
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

const requestPrintViewVisible = function (conf) {
  // If conf['requestPrintViewVisible'] appears in the class list,
  // show print preview on page load
  if (containsClass(conf['previewTargetElement'], conf['requestPrintViewVisible'])) {
    return true;
  }
  return false;
};

const requestPrintViewPrepared = function (conf) {
  // If conf['requestPrintViewPrepared'] appears in the class list,
  // prepare print preview automatically on page load
  if (containsClass(conf['previewTargetElement'], conf['requestPrintViewPrepared'])) {
    return true;
  }
  return false;
};

const requestPrintViewRendered = function (conf) {
  // If conf['requestPrintViewPrepared'] appears in the class list,
  // render print preview automatically on page load
  if (containsClass(conf['previewTargetElement'], conf['requestPrintViewRendered'])) {
    return true;
  }
  return false;
};

const preparePrintPreview = function (conf, reset = false) {
  if (reset) {
    initializePrintPreview(conf);
  }
  // We need print preview to be rendered (not 'display: none') to determine if there is overflow
  setPreviewVisibility(conf, true);
  // Ensure overflow is visible
  setPreviewStatus(conf, conf['previewStatusReady']);
};

const initializePrintPreview = function (conf) {
  setPreviewVisibility(conf, false);
  setPreviewStatus(conf, null);
  // Start with a clean slate: remove all nodes in previewTargetElement
  while (conf['previewTargetElement'].firstChild) {
    conf['previewTargetElement'].removeChild(conf['previewTargetElement'].lastChild);
  }

  conf['parts'].forEach(function (part) {
    part['pages'].forEach(function (page) {
      delete page['paginatedPageElements'];
    });
  });

  conf['parts'].forEach(function (part) {
    part['pages'].forEach(function (page) {
      let targetPageElement = page['originalPageElement'].cloneNode(true);
      targetPageElement.removeAttribute("id");
      page['targetPageElement'] = targetPageElement;
      conf['previewTargetElement'].appendChild(targetPageElement);
    });
  });
};

const renderPrintPreview = function (conf, reset = false) {
  if (reset || !isPreviewReadyToRender(conf)) {
    preparePrintPreview(conf, reset);
  }
  transferOverflow(conf);
};

// This function must only be called once
export const initializePrintView = function (reset) {
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
    requestPrintViewVisible: "preview-visible",
    requestPrintViewPrepared: "preview-prepare",
    requestPrintViewRendered: "preview-render",

    partClassPrefix: "part-",
    pageSelector: ".pagination-page",

    paginationContainerSelector: ".pagination-container",
    paginationOrderAttr: "data-pagination-order",
    paginationPolicyAttr: "data-pagination-policy",

    paginationPoliciesToPaginate: ["break"],
    paginationPoliciesToClone: ["clone"],

    maxNumPages: 10,
  };

  let parts = [];
  let pagesInPart = [];
  let partNumber = -1;
  const partClassPrefixLength = conf['partClassPrefix'].length;

  const pageElements = document.querySelectorAll(conf['pageSelector']);

  pageElements.forEach(function (pageElement) {

    let pagePartNumber = partNumber;
    pageElement.classList.forEach((cl) => {
      if (cl.startsWith(conf['partClassPrefix'])) {
        pagePartNumber = Number(cl.substring(partClassPrefixLength));
      }
    });

    if (pagePartNumber != partNumber) {
      // This page marks beginning of first or new part
      if (pagesInPart?.length > 0) {
        parts.push({
          'partNumber': partNumber,
          'pages': pagesInPart,
        });
        pagesInPart = [];
      }
      partNumber = pagePartNumber;
    }

    let paginationContainers = [];

    const containerElements = pageElement.querySelectorAll(conf['paginationContainerSelector']);
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
      if (conf['paginationPoliciesToClone'].includes(policy)) {
        paginationContainers.push({
          'order': el.getAttribute(conf['paginationOrderAttr']),
          'policy': policy,
          'selector': '.' + el.className.split(' ').join('.'),
          'originalContainer': el,
        });
      }
    });
    paginationContainers.sort((a, b) => (a.order > b.order) ? 1 : -1);
    pagesInPart.push({
      'partNumber': partNumber,
      'originalPageElement': pageElement,
      'paginationContainers': paginationContainers,
    });
  });

  parts.push({
    'partNumber': partNumber,
    'pages': pagesInPart,
  });
  conf['parts'] = parts;

  // Add OnClick handler on print preview button to generate print preview
  if (conf['previewButton']) {
    conf['previewButton'].addEventListener('click', _e => {
      // console.log('previewButton pressed with shiftKey=', _e.shiftKey);
      togglePreview(conf, _e.shiftKey);
    });
  }

  // Add OnClick handler on print button to call browser's print function
  if (conf['printButton']) {
    conf['printButton'].addEventListener('click', _e => window.print());
  }

  window.vitae = {
    'printView': {
      'togglePreview': () => {
        togglePreview(conf);
      },
      'renderPrintPreview': (reset) => {
        renderPrintPreview(conf, reset)
      },
      'transferOverflow': () => {
        transferOverflow(conf)
      },
    }
  };

  // console.log("pagination_preview.js: Found required DOM elements:"
  //     + " conf['outermostContainer'] = " + (typeof conf['outermostContainer'] === "undefined" ? undefined : conf['outermostContainer'])
  //     + " conf['originalContainer'] = " + (typeof conf['originalContainer'] === "undefined" ? undefined : conf['originalContainer'])
  //     + " conf['previewTargetElement'] = " + (typeof conf['previewTargetElement'] === "undefined" ? undefined : conf['previewTargetElement'])
  //     + " previewButton = " + (typeof conf['previewButton'] === "undefined" ? undefined : conf['previewButton'])
  //     + " printButton = " + (typeof conf['printButton'] === "undefined" ? undefined : conf['printButton'])
  // );
  initializePrintPreview(conf);
  if (requestPrintViewVisible(conf)) {
    setPreviewVisibility(conf, true);
  }
  else if (requestPrintViewPrepared(conf)) {
    preparePrintPreview(conf);
  }
  else if (requestPrintViewRendered(conf)) {
    // console.log("Automatic print preview: " + conf['requestPrintViewRendered']);
    renderPrintPreview(conf, true);
  }
};

// document.addEventListener("DOMContentLoaded", _e => initializePrintView());

// console.log('END   vitae/theme/print-view.js');
