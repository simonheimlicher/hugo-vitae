// console.log('BEGIN pagination_preview.js');
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
  if (isObj(el) && targetClass && el !== document ) {
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

    conf['paginationContainers'].forEach(function (el) {

        let baseElement = el['clonePages'][0];
        let overflowElement = el['clonePages'][1];

        if (['break'].includes(el['policy'])) {
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

    if (overflowingContainers.length > 0) {
        // console.log('Pagination containers still have overflow: ', overflowingContainers)
    }
    else {
        // If we get here, none of the paginationContainers has overflow
        // Let overflow be visible
        deleteClass(conf['previewTargetElement'], conf['overflowClass']);
        numberPages(conf);
        // pushClass(conf['previewTargetElement'], conf['previewTargetElementDoneClass']);
        setPreviewStatus(conf, conf['previewStatusDone']);
        setPreviewVisibility(conf, true);
    }
};

const numberPages = function (conf) {
    // Number pages
    for (let pageIndex = 0, page = conf['previewTargetElement'].firstElementChild; page; ++pageIndex, page = page.nextElementSibling) {
        // pushClass(page, "page-" + pageIndex);
        if (pageIndex == 0) {
            pushClass(page, "page-first");
        }
        else {
            deleteClass(page, "page-first");
        }
        if (! page.nextElementSibling) {
            pushClass(page, "page-last");
        }
        else {
            deleteClass(page, "page-last");
        }

        // Number features within all paginationContainers on page
        conf['paginationContainers'].forEach(function (containerSpec, containerIndex) {
            let selector = containerSpec['selector'];
            let container = page.querySelector(selector);
            // pushClass(container, "container-" + containerIndex);
            if (containerIndex == 0) {
                pushClass(container, "container-first");
            }
            else {
                deleteClass(container, "container-first");
            }
            if (containerIndex === conf['paginationContainers'].length - 1) {
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
                if (! feature.nextElementSibling) {
                    pushClass(feature, "feature-last");
                }
                else {
                    deleteClass(feature, "feature-last");
                }
            }
        });
    }
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
    if (reset || (!isPreviewReadyToRender(conf) && ! isPreviewRendered(conf))) {
        initializePrintPreview(conf);
        preparePrintPreview(conf);
    }
    else if (! isPreviewRendered(conf)) {
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

const isPrintPreview = function (conf) {
    // If "auto" appears in the class list, activate print preview automatically
    if (containsClass(conf['previewTargetElement'], conf['printPreviewPrepared'])) {
        // Run automatically
        return true;
    }
    return false;
};

const isPrintLive = function (conf) {
    // If "auto" appears in the class list, activate print preview automatically
    if (containsClass(conf['previewTargetElement'], conf['printPreviewRendered'])) {
        // Run automatically
        return true;
    }
    return false;
};

const preparePrintPreview = function (conf) {
    // We need print preview to be rendered (not 'display: none') to determine if there is overflow
    setPreviewVisibility(conf, true);

    let overflowingContainers = [];
    let paginationContainers = conf['paginationContainers'];
    let basePage = conf['basePage'];
    paginationContainers.forEach(function (el) {
        let baseElement = basePage.querySelector(el['selector']);
        if (baseElement.scrollHeight > baseElement.clientHeight) {
            overflowingContainers.push(el);
        }
        // Keep reference to baseElement
        el['clonePages'] = [baseElement];
    });

    if (overflowingContainers.length > 0) {
        let overflowPage = basePage.cloneNode(true);
        conf['previewTargetElement'].appendChild(overflowPage);

        paginationContainers.forEach(function (el) {
            el['clonePages'].push(overflowPage.querySelector(el['selector']));

            let overflowElement = el['clonePages'][1];

            if (['first', 'break'].includes(el['policy'])) {
                // Remove all elements from the pagination columns on the clonePages page
                while (overflowElement.firstChild) {
                    overflowElement.removeChild(overflowElement.lastChild);
                }
            }
        });

        paginationContainers.forEach(function (el) {
            el['clonePages'].push(overflowPage.querySelector(el['selector']));
        });
    }
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

    let basePage = conf['originalContainer'].cloneNode(true);
    basePage.removeAttribute("id");
    // conf['originalContainer'].classList.forEach(function(cls) {
    //     pushClass(conf['previewTargetElement'], cls);
    // });

    conf['previewTargetElement'].appendChild(basePage);
    conf['basePage'] = basePage;
};

const renderPrintPreview = function (conf, reset=false) {
    if (reset || !isPreviewReadyToRender(conf)) {
        initializePrintPreview(conf);
        preparePrintPreview(conf);
    }
    transferOverflow(conf);
};

// This function must only be called once
const init = function (reset) {
    let conf = {
        outermostContainer: document.querySelector('#vitaeContainer'),
        originalContainer: document.querySelector("#contentContainer"),
        previewContainer: document.querySelector('#printPreviewContainer'),

        previewTargetElement: document.querySelector('#printPreviewTarget'),

        previewButton: document.querySelector('#printPreviewToggle'),
        printButton: document.querySelector('#printButton'),

        printPreviewVisibleAttr: "data-print-preview-visible",
        printPreviewStatusAttr: "data-print-preview-status",
        previewStatusReady: "readyToRender",
        previewStatusDone: "done",

        printPreviewClass: "print-preview",
        printPreviewActiveBodyClass: "print-preview_active",
        overflowClass: 'print-preview_overflow',
        printPreviewPrepared: "preview-prepare",
        printPreviewRendered: "preview-render",

        paginationSelector: ".pagination-container",
        paginationOrderAttr: "data-pagination-order",
        paginationPolicyAttr: "data-pagination-policy",
    };

    let paginationContainers = [];
    pushClass(conf['previewTargetElement'], conf['overflowClass']);
    pushClass(conf['outermostContainer'], conf['overflowClass']);
    let paginationElements = document.querySelectorAll(conf['paginationSelector']);
    paginationElements.forEach(function (el, idx) {
        paginationContainers.push({
            'order': el.getAttribute(conf['paginationOrderAttr']),
            'policy': el.getAttribute(conf['paginationPolicyAttr']),
            'selector': '.' + el.className.split(' ').join('.'),
            'originalContainer': el,
        });
    });
    paginationContainers.sort((a, b) => (a.order > b.order) ? 1 : -1);

    conf['paginationContainers'] = paginationContainers;

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
    if (isPrintPreview(conf)) {
        initializePrintPreview(conf);
        preparePrintPreview(conf);
    }
    else if (isPrintLive(conf)) {
        // console.log("Automatic print preview: " + conf['printPreviewRendered']);
        initializePrintPreview(conf);
        renderPrintPreview(conf, true);
    }
};

document.addEventListener("DOMContentLoaded", _e => init());

// console.log('END   pagination_preview.js');
