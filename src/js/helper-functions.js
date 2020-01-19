const exceptions = ['checked', 'textContent', 'data', 'onpointerdown', 'onpointerup'];

export {
    configClone,
    configElement
};

/**
 * Clones the provided element shallowly and returns a partially applied version of configElement().
 * @param { Node } template The element to be cloned.
 * @returns { Function }
 */
function configClone(template) {
    return attrs => configElement(template.cloneNode(false), attrs);
}

/**
 * Applies attributes and properties to an HTMLElement.
 * @param { Element } element The element to be configured.
 * @param { Object } keyValPairs The attributes and properties to be applied to the element.
 * @returns { Element }
 */
function configElement(element, keyValPairs) {
    Object.keys(keyValPairs).forEach((key) => {
        if (exceptions.includes(key)) {
            element[key] = keyValPairs[key];
        } else {
            element.setAttribute(key, keyValPairs[key]);
        }
    });

    return element;
}